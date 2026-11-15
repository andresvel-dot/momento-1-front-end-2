export const DIAS_SEMANA = Object.freeze([
  { id: 'lun', largo: 'Lunes' },
  { id: 'mar', largo: 'Martes' },
  { id: 'mie', largo: 'Miércoles' },
  { id: 'jue', largo: 'Jueves' },
  { id: 'vie', largo: 'Viernes' },
]);

export const COMIDAS = Object.freeze([
  { id: 'desayuno', label: 'Desayuno', icono: 'bi-cup-hot' },
  { id: 'almuerzo', label: 'Almuerzo', icono: 'bi-egg-fried' },
  { id: 'merienda', label: 'Merienda', icono: 'bi-cookie' },
  { id: 'cena', label: 'Cena', icono: 'bi-moon-stars' },
]);

export const crearClave = (diaId, comidaId) => `${diaId}|${comidaId}`;
