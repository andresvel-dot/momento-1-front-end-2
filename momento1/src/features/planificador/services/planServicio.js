const LATENCIA_MS = 400;

const PLAN_SIMULADO = Object.freeze({
  lun: [
    { id: 'lun-1', tipo: 'Desayuno', nombre: 'Arepa con huevo' },
    { id: 'lun-2', tipo: 'Almuerzo', nombre: 'Bandeja paisa' },
    { id: 'lun-3', tipo: 'Cena', nombre: 'Sopa de verduras' },
  ],
  mar: [
    { id: 'mar-1', tipo: 'Desayuno', nombre: 'Calentado' },
    { id: 'mar-2', tipo: 'Almuerzo', nombre: 'Sancocho de gallina' },
  ],
  mie: [
    { id: 'mie-1', tipo: 'Almuerzo', nombre: 'Ajiaco santafereño' },
    { id: 'mie-2', tipo: 'Cena', nombre: 'Ensalada de piña' },
  ],
  jue: [],
  vie: [
    { id: 'vie-1', tipo: 'Desayuno', nombre: 'Changua' },
    { id: 'vie-2', tipo: 'Almuerzo', nombre: 'Pescado frito con patacón' },
  ],
  sab: [],
  dom: [],
});

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const planServicio = {
  async obtenerPlanSemanal(semana) {
    if (!Number.isInteger(semana) || semana < 1 || semana > 53) {
      throw new Error(`Semana inválida: ${semana}`);
    }
    await esperar(LATENCIA_MS);
    return { semana, dias: PLAN_SIMULADO };
  },
};