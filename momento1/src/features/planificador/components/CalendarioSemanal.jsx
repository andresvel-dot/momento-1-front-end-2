import { DIAS_SEMANA } from '../utils/diasSemana';
import { usePlanSemanal } from '../hooks/usePlanSemanal';
import { DiaCard } from './DiaCard';
import './planificador.css';

export function CalendarioSemanal({ semana }) {
  const { plan, cargando, error } = usePlanSemanal(semana);

  return (
    <section className="planificador-calendario" aria-labelledby="planificador-titulo">
      <h2 id="planificador-titulo" className="planificador-calendario__titulo">
        Plan semanal · Semana {semana}
      </h2>

      {cargando && <p role="status">Cargando plan…</p>}
      {error && <p role="alert" className="planificador-calendario__error">{error}</p>}

      {plan && !cargando && (
        <div className="planificador-calendario__grid">
          {DIAS_SEMANA.map((dia) => (
            <DiaCard key={dia.id} dia={dia} comidas={plan.dias[dia.id] ?? []} />
          ))}
        </div>
      )}
    </section>
  );
}