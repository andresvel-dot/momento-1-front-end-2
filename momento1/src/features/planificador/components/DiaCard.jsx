export function DiaCard({ dia, comidas }) {
  return (
    <article className="planificador-dia-card">
      <h3 className="planificador-dia-card__titulo">
        <span className="planificador-dia-card__corto">{dia.corto}</span>
        <span className="planificador-dia-card__largo">{dia.largo}</span>
      </h3>

      {comidas.length === 0 ? (
        <p className="planificador-dia-card__vacio">Sin comidas planeadas</p>
      ) : (
        <ul className="planificador-dia-card__lista">
          {comidas.map((comida) => (
            <li key={comida.id} className="planificador-dia-card__comida">
              <span className="planificador-dia-card__tipo">{comida.tipo}</span>
              <span>{comida.nombre}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}