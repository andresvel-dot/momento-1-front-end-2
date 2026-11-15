import { COMIDAS, crearClave } from '../utils/diasSemana';

export function DiaCard({ dia, bloques, recetaPorId, onAbrirSelector, onQuitar }) {
  return (
    <article className="planificador-dia-card">
      <h3 className="cell-head">{dia.largo}</h3>

      {COMIDAS.map((comida) => {
        const clave = crearClave(dia.id, comida.id);
        const ids = bloques[clave] ?? [];

        return (
          <div key={comida.id} className="slot">
            <ul className="slot-list">
              {ids.map((id, indice) => (
                <li key={`${id}-${indice}`} className="chip">
                  <span className="n">{recetaPorId.get(id)?.nombre}</span>
                  <button
                    type="button"
                    className="chip-x"
                    aria-label={`Quitar ${recetaPorId.get(id)?.nombre}`}
                    onClick={() => onQuitar(clave, indice)}
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="slot-add"
              aria-label={`Agregar receta a ${comida.label} del ${dia.largo}`}
              onClick={() => onAbrirSelector({ clave, etiqueta: `${comida.label} · ${dia.largo}` })}
            >
              <i className="bi bi-plus-lg" /> Agregar
            </button>
          </div>
        );
      })}
    </article>
  );
}