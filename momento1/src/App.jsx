import { useState, useEffect, useMemo } from 'react';
import { CalendarioSemanal } from './features/planificador/components/CalendarioSemanal';
import { usePlanSemanal } from './features/planificador/hooks/usePlanSemanal';
import { COMIDAS, DIAS_SEMANA, crearClave } from './features/planificador/utils/diasSemana';
import { planServicio } from './features/planificador/services/planServicio';
import './features/planificador/components/planificador.css';

const CELULAS = [
  {
    id: 'c1',
    nombre: 'Catálogo de Productos Nutresa',
    icon: 'bi-box-seam',
    hus: [
      { code: '1.1.1', title: 'Dashboard de Inventario Maestro de Productos', role: 'A' },
      { code: '1.2.1', title: 'Vitrina de Alimentos con Filtros por Marca Nutresa', role: 'U' },
      { code: '1.3.1', title: 'Ficha Técnica e Historial de Recetas del Producto', role: 'U' }
    ]
  },
  {
    id: 'c2',
    nombre: 'Recetario y Contenido',
    icon: 'bi-book-half',
    hus: [
      { code: '2.1.1', title: 'Panel de Moderación y Publicación de Recetas', role: 'A' },
      { code: '2.2.1', title: 'Galería de Recetas con Filtros Múltiples', role: 'U' },
      { code: '2.3.1', title: 'Editor de Recetas y Modo Cocina Paso a Paso', role: 'U' }
    ]
  },
  {
    id: 'c3',
    nombre: 'Despensa Virtual y Sugerencias',
    icon: 'bi-basket',
    hus: [
      { code: '3.1.1', title: 'Gestión del Catálogo de Equivalencias de Ingredientes', role: 'A' },
      { code: '3.2.1', title: "Control e Ingreso de Insumos en 'Mi Alacena'", role: 'U' },
      { code: '3.3.1', title: 'Generador de Recetas Sugeridas por Coincidencia', role: 'U' }
    ]
  },
  {
    id: 'c4',
    nombre: 'Nutrición y Perfiles Alimentarios',
    icon: 'bi-heart-pulse',
    hus: [
      { code: '4.1.1', title: 'Parámetros Nutricionales y Catálogo de Alérgenos', role: 'A' },
      { code: '4.2.1', title: 'Formulario de Perfil Alimentario y Restricciones', role: 'U' },
      { code: '4.3.1', title: 'Semáforo Nutricional y Contador de Metas Diarias', role: 'U' }
    ]
  },
  {
    id: 'c5',
    nombre: 'Planificador de Menús y Lista de Mercado',
    icon: 'bi-calendar-week',
    hus: [
      { code: '5.1.1', title: 'Resumen Estadístico de Planes de Menú', role: 'A' },
      { code: '5.1.2', title: 'Calendario Semanal de Comidas', role: 'U' },
      { code: '5.1.3', title: 'Generador de Lista de Mercado Inteligente', role: 'U' }
    ]
  },
  {
    id: 'c6',
    nombre: 'Comunidad y Valoraciones',
    icon: 'bi-people',
    hus: [
      { code: '6.1.1', title: 'Moderación de Comentarios y Contenido Reportado', role: 'A' },
      { code: '6.2.1', title: 'Formulario de Valoración por Estrellas y Reseñas', role: 'U' },
      { code: '6.3.1', title: 'Colecciones Temáticas de Recetas y Favoritos', role: 'U' }
    ]
  },
  {
    id: 'c7',
    nombre: 'Mercadeo, Campañas y Fidelización',
    icon: 'bi-megaphone',
    hus: [
      { code: '7.1.1', title: 'Gestión de Campañas de Temporada y Cupones', role: 'A' },
      { code: '7.2.1', title: 'Banners de Promoción y Redención de Cupones', role: 'U' },
      { code: '7.3.1', title: 'Panel de Puntos Nutresa y Catálogo de Recompensas', role: 'U' }
    ]
  }
];

const truncar = (txt) => {
  const palabras = txt.split(' ');
  return palabras.slice(0, 4).join(' ') + (palabras.length > 4 ? '…' : '');
};

const LOGO_SAZON = (
  <svg className="logo-mark" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Logo Sazón">
    <circle cx="20" cy="20" r="20" fill="#8BD317" />
    <path d="M20 8c-3 4-3 8 0 12s3 8 0 12" stroke="#0A2410" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="14" cy="20" r="2" fill="#0A2410" />
    <circle cx="26" cy="20" r="2" fill="#0A2410" />
  </svg>
);

export function App() {
  const [theme, setTheme] = useState('night');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openCell, setOpenCell] = useState('c5');
  const [activeTab, setActiveTab] = useState('calendario');
  const [semanaId, setSemanaId] = useState('semana-principal');
  const [busquedaPlanId, setBusquedaPlanId] = useState('');
  const [diaCronograma, setDiaCronograma] = useState('Lunes');

  // Estado para la lista dinámica de planes creados
  const [listaPlanes, setListaPlanes] = useState([]);

  // Estado del plan levantado a App, compartido entre Calendario y Cronograma
  const planState = usePlanSemanal(semanaId);
  const { bloques, recetas } = planState;

  // Consultar la lista de planes actualizados al iniciar o cambiar de semana
  useEffect(() => {
    planServicio.obtenerListaPlanes().then(setListaPlanes).catch(() => {});
  }, [semanaId]);

  // Mapa id -> receta y día seleccionado
  const recetaPorId = useMemo(() => new Map(recetas.map((r) => [r.id, r])), [recetas]);
  const diaObj = useMemo(
    () => DIAS_SEMANA.find((d) => d.largo === diaCronograma) ?? DIAS_SEMANA[0],
    [diaCronograma]
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'night' ? 'day' : 'night');
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const buscarPlanPorId = (e) => {
    e.preventDefault();
    if (!busquedaPlanId.trim()) return;
    setSemanaId(busquedaPlanId.trim().toLowerCase());
    setActiveTab('calendario');
    setBusquedaPlanId('');
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <button className="menu-toggle" onClick={toggleSidebar} aria-label="Menú">
          <i className="bi bi-list"></i>
        </button>
        <a className="logo" href="#">
          {LOGO_SAZON}
          <span><b>Sa·zón</b><small>NUTRESA DIGITAL</small></span>
        </a>
        <div className="search">
          <i className="bi bi-search"></i>
          <input type="search" placeholder="Buscar en el planificador o recetas..." />
        </div>
        <div className="header-right">
          <button className="icon-btn" aria-label="Notificaciones"><i className="bi bi-bell"></i><span className="dot"></span></button>
          <div className="profile-btn" style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <span className="avatar">AV</span>
            <div><strong>Andrés Vélez Hurtado</strong><span>Chef Desarrollador</span></div>
          </div>
        </div>
      </header>

      {/* SIDEBAR BACKDROP & DRAWER */}
      <div className={`sidebar-backdrop${sidebarOpen ? ' open' : ''}`} onClick={toggleSidebar} />
      <nav className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-head">
          <b>Módulos por Célula</b>
          <button className="close-side" onClick={toggleSidebar}><i className="bi bi-x-lg"></i></button>
        </div>
        <div className="sidebar-scroll">
          {CELULAS.map((c) => (
            <div key={c.id} className={`cell-group${openCell === c.id ? ' open' : ''}`}>
              <button className="nav-cell-head" onClick={() => setOpenCell(openCell === c.id ? null : c.id)}>
                <i className={`bi ${c.icon}`}></i>
                <span className="cell-name">{c.nombre}</span>
                <i className="bi bi-chevron-right chevron"></i>
              </button>
              {openCell === c.id && (
                <ul className="cell-hus">
                  {c.hus.map((h) => (
                    <li key={h.code}>
                      <button className={`hu-tab${h.code === '5.1.2' ? ' active' : ''}`}>
                        <span className="hu-label" title={h.title}>{truncar(h.title)}</span>
                        <span className={`role-pill ${h.role === 'A' ? 'admin' : 'user'}`}>{h.role}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* BREADCRUMBS */}
      <nav className="breadcrumbs">
        <span className="crumb">Inicio</span>
        <span className="crumb-sep"><i className="bi bi-chevron-right"></i></span>
        <span className="crumb">Planificador de Menús y Lista de Mercado</span>
      </nav>

      {/* MAIN VIEW */}
      <main className="main">
        {/* SUB-TABS SUPERIORES */}
        <div className="sub-tabs" style={{ marginBottom: '20px', display: 'flex', gap: '6px', background: 'var(--surface)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <button className={`sub-tab${activeTab === 'calendario' ? ' active' : ''}`} onClick={() => setActiveTab('calendario')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', background: activeTab === 'calendario' ? 'var(--lima-active)' : 'transparent', color: activeTab === 'calendario' ? '#06200F' : 'var(--text)', border: 0, fontWeight: activeTab === 'calendario' ? 600 : 500, cursor: 'pointer' }}>
            <i className="bi bi-calendar-week"></i> Calendario Semanal
          </button>
          <button className={`sub-tab${activeTab === 'cronograma' ? ' active' : ''}`} onClick={() => setActiveTab('cronograma')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', background: activeTab === 'cronograma' ? 'var(--lima-active)' : 'transparent', color: activeTab === 'cronograma' ? '#06200F' : 'var(--text)', border: 0, fontWeight: activeTab === 'cronograma' ? 600 : 500, cursor: 'pointer' }}>
            <i className="bi bi-clock-history"></i> Cronograma Diario
          </button>
          <button className={`sub-tab${activeTab === 'balance' ? ' active' : ''}`} onClick={() => setActiveTab('balance')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', background: activeTab === 'balance' ? 'var(--lima-active)' : 'transparent', color: activeTab === 'balance' ? '#06200F' : 'var(--text)', border: 0, fontWeight: activeTab === 'balance' ? 600 : 500, cursor: 'pointer' }}>
            <i className="bi bi-heart-pulse"></i> Balance Nutricional
          </button>
          <button className={`sub-tab${activeTab === 'plantillas' ? ' active' : ''}`} onClick={() => setActiveTab('plantillas')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', background: activeTab === 'plantillas' ? 'var(--lima-active)' : 'transparent', color: activeTab === 'plantillas' ? '#06200F' : 'var(--text)', border: 0, fontWeight: activeTab === 'plantillas' ? 600 : 500, cursor: 'pointer' }}>
            <i className="bi bi-journal-text"></i> Plantillas & Menús
          </button>
        </div>

        {/* VISTA 1: CALENDARIO SEMANAL */}
        {activeTab === 'calendario' && (
          <CalendarioSemanal
            semana={semanaId}
            onPlanCreado={(nuevoId) => {
              setSemanaId(nuevoId);
              planServicio.obtenerListaPlanes().then(setListaPlanes).catch(() => {});
            }}
            planState={planState}
          />
        )}

        {/* VISTA 2: CRONOGRAMA DIARIO */}
        {activeTab === 'cronograma' && (
          <div className="card-box" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <span className="label">Vista de Enfoque</span>
                <h2>Cronograma & Detalle del <em>Día</em></h2>
                <p className="label">Visualiza las preparaciones continuas del día seleccionado.</p>
              </div>
              <select
                value={diaCronograma}
                onChange={(e) => setDiaCronograma(e.target.value)}
                className="field"
                style={{width: '160px', cursor: 'pointer'}}
              >
                {DIAS_SEMANA.map((d) => (
                  <option key={d.id} value={d.largo}>{d.largo}</option>
                ))}
              </select>
            </div>
            <div className="daily-timeline">
              {COMIDAS.map((comida) => {
                const clave = crearClave(diaObj.id, comida.id);
                const ids = bloques[clave] ?? [];
                const nombres = ids
                  .map((id) => recetaPorId.get(id)?.nombre)
                  .filter(Boolean);
                return (
                  <div className="timeline-item" key={comida.id}>
                    <div className="time-badge">
                      <i className={`bi ${comida.icono}`}></i> {comida.label}
                    </div>
                    {nombres.length > 0 ? (
                      <span>{nombres.join(' · ')}</span>
                    ) : (
                      <span className="label">Sin receta agendada</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VISTA 3: BALANCE NUTRICIONAL */}
        {activeTab === 'balance' && (
          <div className="card-box" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div>
              <span className="label">Análisis Semanal</span>
              <h2>Balance <em>Nutricional</em></h2>
              <p className="label">Medición estimada de balance energético y macronutrientes.</p>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px'}}>
              <div className="stat-card">
                <span className="label">Calorías Totales Estimadas</span>
                <strong style={{color: 'var(--accent)', fontSize: '2rem', margin: '8px 0'}}>450 kcal</strong>
                <span className="label">Promedio diario: 90 kcal/día</span>
              </div>
              <div className="stat-card">
                <span className="label" style={{display:'block', marginBottom:'8px'}}>Distribución Macronutricional</span>
                <span className="label" style={{fontSize:'0.75rem'}}>Proteína (Zenú / Pietrán)</span>
                <div className="macro-bar"><div className="macro-fill" style={{width: '65%', background: 'var(--accent)'}}></div></div>
                <span className="label" style={{fontSize:'0.75rem', marginTop:'10px', display:'block'}}>Carbohidratos (Pastas Doria / Noel)</span>
                <div className="macro-bar"><div className="macro-fill" style={{width: '35%', background: 'var(--surface3)'}}></div></div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 4: PLANTILLAS & MENÚS (BÚSQUEDA Y HISTORIAL DINÁMICO) */}
        {activeTab === 'plantillas' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div className="card-box">
              <span className="label">Gestión de Menús</span>
              <h2>Historial de Planes Semanales & <em>Plantillas</em></h2>
              <p className="label" style={{marginBottom: '16px'}}>Busca un plan por ID o cárgalo directamente como semana activa.</p>

              <form onSubmit={buscarPlanPorId} style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <input
                  type="text"
                  className="field"
                  placeholder="Ej. semana-principal o semana-fitness-01"
                  value={busquedaPlanId}
                  onChange={(e) => setBusquedaPlanId(e.target.value)}
                  style={{flex: 1}}
                />
                <button type="submit" className="btn btn-primary" style={{cursor: 'pointer'}}>
                  <i className="bi bi-search"></i> Buscar Plan
                </button>
              </form>
            </div>

            <div className="card-box">
              <h3>Historial de Planes Semanales Creados</h3>
              <p className="label" style={{marginBottom: '12px'}}>Lista de tus planes personalizados en el sistema.</p>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {listaPlanes.map((p) => {
                  const esActivo = p.id === semanaId;
                  return (
                    <div className="week-item" key={p.id}>
                      <div>
                        <strong>{p.nombre}</strong>
                        <span className="label" style={{display:'block'}}>ID: {p.id}</span>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                        {esActivo ? (
                          <span className="label" style={{color: 'var(--accent)', fontWeight: 600}}>Activo (En uso)</span>
                        ) : (
                          <button type="button" className="btn btn-ghost" onClick={() => { setSemanaId(p.id); setActiveTab('calendario'); }}>
                            <i className="bi bi-arrow-down-circle"></i> Cargar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer" style={{ marginTop: '40px' }}>
        <div className="footer-brand">
          {LOGO_SAZON}
          <div>
            <b>Sa·zón · Nutresa Digital</b><br />
            <span className="label">Cocina con lo que tienes en casa</span>
          </div>
        </div>
        <span className="label">Sistema Nutresa</span>
      </footer>

      {/* THEME TOGGLE */}
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
        <i className={`bi ${theme === 'night' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
      </button>
    </div>
  );
}