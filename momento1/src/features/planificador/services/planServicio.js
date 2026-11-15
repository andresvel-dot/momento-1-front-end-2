const LATENCIA_MS = 300;

const RECETAS = Object.freeze([
  { id: 'r1', nombre: 'Pasta cremosa con Salchicha Ranchera Zenú', marca: 'Zenú', tiempo: 25, kcal: 450,
    ingredientes: ['Salchicha Ranchera Zenú', 'Pastas Doria', 'Crema de leche'] },
  { id: 'r2', nombre: 'Fettuccine ligero con Jamón Pietrán', marca: 'Pietrán · Doria', tiempo: 20, kcal: 320,
    ingredientes: ['Jamón Pietrán', 'Pastas Doria', 'Yogur griego'] },
  { id: 'r3', nombre: 'Mousse de Maracuyá con Galletas Ducales', marca: 'Ducales', tiempo: 15, kcal: 280,
    ingredientes: ['Galletas Ducales', 'Leche condensada', 'Maracuyá'] },
  { id: 'r4', nombre: 'Café Sello Rojo con Galletas Noel', marca: 'Sello Rojo · Noel', tiempo: 10, kcal: 180,
    ingredientes: ['Café Sello Rojo', 'Galletas Noel Galeras'] },
  { id: 'r5', nombre: 'Sándwich de Jamón Pietrán y aguacate', marca: 'Pietrán', tiempo: 10, kcal: 290,
    ingredientes: ['Jamón Pietrán', 'Pan tajado', 'Aguacate'] },
]);

const planes = {
  'semana-principal': {
    id: 'semana-principal',
    nombre: 'Semana Principal',
    bloques: { 'lun|desayuno': ['r1'] },
  },
  'semana-fitness-01': {
    id: 'semana-fitness-01',
    nombre: 'Semana Fitness 01',
    bloques: { 'mar|almuerzo': ['r2'], 'mie|merienda': ['r3'] },
  },
};

const FORMATO_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const planServicio = {
  async obtenerPlanSemanal(semanaId) {
    const plan = typeof semanaId === 'string' ? planes[semanaId.trim()] : undefined;
    if (!plan) {
      throw new Error(`Plan no encontrado: ${semanaId}`);
    }
    await esperar(LATENCIA_MS);
    return { id: plan.id, nombre: plan.nombre, bloques: { ...plan.bloques } };
  },

  async crearPlan({ nombre = '', id = '' }) {
    const nombreLimpio = nombre.trim();
    const idLimpio = id.trim().toLowerCase();

    if (!nombreLimpio) throw new Error('El nombre del plan es obligatorio.');
    if (!idLimpio) throw new Error('El ID único es obligatorio.');
    if (!FORMATO_ID.test(idLimpio)) {
      throw new Error('El ID solo admite minúsculas, números y guiones (ej. semana-fitness-02).');
    }
    if (planes[idLimpio]) throw new Error(`Ya existe un plan con el ID "${idLimpio}".`);

    await esperar(LATENCIA_MS);
    planes[idLimpio] = { id: idLimpio, nombre: nombreLimpio, bloques: {} };
    return { id: idLimpio, nombre: nombreLimpio };
  },

  async obtenerRecetas() {
    await esperar(LATENCIA_MS);
    return RECETAS;
  },
};