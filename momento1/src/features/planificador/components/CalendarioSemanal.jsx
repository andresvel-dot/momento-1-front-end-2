import { useEffect, useMemo, useState } from 'react';
import { COMIDAS, DIAS_SEMANA } from '../utils/diasSemana';
import { usePlanSemanal } from '../hooks/usePlanSemanal';
import { planServicio } from '../services/planServicio';
import { DiaCard } from './DiaCard';
import './planificador.css';

const TOTAL_BLOQUES = DIAS_SEMANA.length * COMIDAS.length;

const normalizar = (texto = '') =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export function CalendarioSemanal({ semana = 'semana-principal', onPlanCreado, planState: planStateProp }) {
  // Si el padre levantó el estado, lo usamos; si no, usamos el hook interno.
  const planStateLocal = usePlanSemanal(semana);
  const plan = planStateProp ?? planStateLocal;
  const { nombrePlan, bloques, recetas, cargando, error, agregarReceta, quitarReceta, vaciarPlan } = plan;

  const [destino, setDestino] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const [modalPlanAbierto, setModalPlanAbierto] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [idNuevo, setIdNuevo] = useState('');
  const [errorForm, setErrorForm] = useState(null);
  const [creando, setCreando] = useState(false);

  const recetaPorId = useMemo(() => new Map(recetas.map((r) => [r.id, r])), [recetas]);

  const { totalRecetas, bloquesLlenos, minutos } = useMemo(() => {
    const listas = Object.values(bloques);
    const ids = listas.flat();
    return {
      totalRecetas: ids.length,
      bloquesLlenos: listas.filter((l) => l.length > 0).length,
      minutos: ids.reduce((acc, id) => acc + (recetaPorId.get(id)?.tiempo ?? 0), 0),
    };
  }, [bloques, recetaPorId]);

  const hayBusqueda = busqueda.trim().length > 0;

  // FIX: si ya hay destino activo, mostramos todas las recetas del momento.
  const recetasFiltradas = useMemo(() => {
    const consulta = normalizar(busqueda);
    if (!consulta) return destino ? recetas : [];
    return recetas.filter((r) => normalizar(r.nombre).startsWith(consulta));
  }, [recetas, busqueda, destino]);

  const seleccionarReceta = (recetaId) => {
    agregarReceta(destino.clave, recetaId);
    setDestino(null);
    setBusqueda('');
  };

  const abrirModalPlan = () => {
    setNombreNuevo('');
    setIdNuevo('');
    setErrorForm(null);
    setModalPlanAbierto(true);
  };

  const crearPlan = async (e) => {
    e.preventDefault();
    setErrorForm(null);
    setCreando(true);
    try {
      const plan = await planServicio.crearPlan({ nombre: nombreNuevo, id: idNuevo });
      setModalPlanAbierto(false);
      onPlanCreado?.(plan.id);
    } catch (err) {
      setErrorForm(err.message);
    } finally {
      setCreando(false);
    }
  };

  useEffect(() => {
    if (!destino && !modalPlanAbierto) return undefined;
    const alPresionar = (e) => {
      if (e.key !== 'Escape') return;
      if (modalPlanAbierto) setModalPlanAbierto(false);
      else setDestino(null);
    };
    document.addEventListener('keydown', alPresionar);
    return () => document.removeEventListener('keydown', alPresionar);
  }, [destino, modalPlanAbierto]);

  return (
    <section className="view-content active" aria-labelledby="planificador-titulo">
      <header className="page-head">
        <div>
          <span className="label">Semana Activa: {nombrePlan}</span>
          <h1 id="planificador-titulo">Calendario Semanal de <em>Comidas</em></h1>
          <p>Organiza tu alimentación de Lunes a Viernes por momento de comida.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn btn-create" onClick={abrirModalPlan}>
            <i className="bi bi-plus-circle" />
            <span className="btn-label">Crear plan semanal</span>
          </button>
          <button type="button" className="btn btn-ghost" onClick={vaciarPlan}>
            <i className="bi bi-trash" />
            <span className="btn-label">Vaciar Semana</span>
          </button>
        </div>
      </header>

      {cargando && <p role="status">Cargando plan…</p>}
      {error && <p role="alert" className="planificador-calendario__error">{error}</p>}

      {!cargando && !error && (
        <>
          <div className="stats">
            <div className="stat-card"><strong>{totalRecetas}</strong><span className="label">Recetas Agendadas</span></div>
            <div className="stat-card"><strong>{bloquesLlenos}/{TOTAL_BLOQUES}</strong><span className="label">Bloques Llenos</span></div>
            <div className="stat-card"><strong>{minutos} min</strong><span className="label">Cocina Total</span></div>
          </div>

          <div className="workspace">
            <div className="calendar-wrap">
              <div className="calendar planificador-calendario__grid">
                <div className="cell-head"><span className="label">Momento</span></div>
                {COMIDAS.map((comida) => (
                  <div key={comida.id} className="meal-label">
                    <i className={`bi ${comida.icono}`} />
                    <span className="label">{comida.label}</span>
                  </div>
                ))}

                {DIAS_SEMANA.map((dia) => (
                  <DiaCard
                    key={dia.id}
                    dia={dia}
                    bloques={bloques}
                    recetaPorId={recetaPorId}
                    onAbrirSelector={setDestino}
                    onQuitar={quitarReceta}
                  />
                ))}
              </div>
            </div>

            <aside className="panel planificador-recetas" aria-labelledby="recetas-titulo">
              <h2 id="recetas-titulo">Recetas Disponibles</h2>
              <p className="label">Escribe una inicial para buscar</p>

              <input
                className="field"
                type="search"
                placeholder="Filtrar recetas..."
                aria-label="Filtrar recetas por inicial"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value.toUpperCase())}
              />

              {destino && (
                <p className="label planificador-recetas__destino">Agregando a: {destino.etiqueta}</p>
              )}

              {!hayBusqueda && !destino && (
                <p className="label planificador-recetas__vacio">Escribe una inicial para buscar recetas</p>
              )}
              {hayBusqueda && recetasFiltradas.length === 0 && (
                <p className="label planificador-recetas__vacio">No se encontró ningún registro</p>
              )}
              {recetasFiltradas.length > 0 && !destino && (
                <p className="label planificador-recetas__vacio">
                  Elige un bloque con «Agregar» para asignar una receta
                </p>
              )}

              <ul className="recipe-list">
                {recetasFiltradas.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      className="recipe-item-card"
                      disabled={!destino}
                      onClick={() => seleccionarReceta(r.id)}
                    >
                      <strong>{r.nombre}</strong>
                      <span className="label">{r.marca} · {r.tiempo} min</span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </>
      )}

      <div
        className={`modal-backdrop${modalPlanAbierto ? ' open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && setModalPlanAbierto(false)}
      >
        <form className="modal" role="dialog" aria-modal="true" aria-labelledby="nuevo-plan-titulo" onSubmit={crearPlan}>
          <div className="dlg-head">
            <div>
              <span className="label">Gestión Interactiva</span>
              <h2 id="nuevo-plan-titulo">Nuevo Plan Semanal</h2>
            </div>
            <button type="button" className="dlg-close" aria-label="Cerrar" onClick={() => setModalPlanAbierto(false)}>
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <div className="planificador-form">
            <label className="label" htmlFor="plan-nombre">Nombre del Plan</label>
            <input
              id="plan-nombre"
              className="field"
              type="text"
              placeholder="Ej. Semana Fitness Nutresa"
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
              autoFocus
            />

            <label className="label" htmlFor="plan-id">ID Único</label>
            <input
              id="plan-id"
              className="field"
              type="text"
              placeholder="Ej. semana-fitness-01"
              value={idNuevo}
              onChange={(e) => setIdNuevo(e.target.value)}
            />

            {errorForm && <p role="alert" className="planificador-calendario__error">{errorForm}</p>}

            <button type="submit" className="btn btn-create btn-block" disabled={creando}>
              <i className="bi bi-plus-circle" />
              <span>{creando ? 'Creando…' : 'Crear plan semanal'}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}