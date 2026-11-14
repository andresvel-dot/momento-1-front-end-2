import { useEffect, useState } from 'react';
import { planServicio } from '../services/planServicio';

export function usePlanSemanal(semana) {
  const [plan, setPlan] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargarPlan() {
      setCargando(true);
      setError(null);
      try {
        const datos = await planServicio.obtenerPlanSemanal(semana);
        if (!cancelado) setPlan(datos);
      } catch (e) {
        if (!cancelado) setError(e.message);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarPlan();
    return () => {
      cancelado = true;
    };
  }, [semana]);

  return { plan, cargando, error };
}