import { useCallback, useEffect, useState } from 'react';
import { planServicio } from '../services/planServicio';

export function usePlanSemanal(semanaId) {
  const [nombrePlan, setNombrePlan] = useState('');
  const [bloques, setBloques] = useState({});
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const [plan, catalogo] = await Promise.all([
          planServicio.obtenerPlanSemanal(semanaId),
          planServicio.obtenerRecetas(),
        ]);
        if (!cancelado) {
          setNombrePlan(plan.nombre);
          setBloques(plan.bloques);
          setRecetas(catalogo);
        }
      } catch (e) {
        if (!cancelado) setError(e.message);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, [semanaId]);

  const agregarReceta = useCallback(
    (clave, recetaId) =>
      setBloques((actual) => ({ ...actual, [clave]: [...(actual[clave] ?? []), recetaId] })),
    []
  );

  const quitarReceta = useCallback(
    (clave, indice) =>
      setBloques((actual) => ({
        ...actual,
        [clave]: (actual[clave] ?? []).filter((_, i) => i !== indice),
      })),
    []
  );

  const vaciarPlan = useCallback(() => setBloques({}), []);

  return {
    nombrePlan,
    bloques,
    recetas,
    cargando,
    error,
    agregarReceta,
    quitarReceta,
    vaciarPlan,
  };
}