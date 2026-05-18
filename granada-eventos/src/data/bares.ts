import type { Bar } from '../types/bar';

export const ZONAS_COMER = [
  'Albaicin',
  'Centro',
  'Realejo',
  'Chana',
  'Zaidin',
  'Sacromonte',
  'Beiro',
  'Norte',
] as const;

export type ZonaComer = (typeof ZONAS_COMER)[number];

export interface ZonaInfo {
  id: ZonaComer;
  descripcion: string;
}

export const ZONAS_INFO: ZonaInfo[] = [
  { id: 'Albaicin',   descripcion: 'Terrazas con vistas a la Alhambra, tés morunos y tabernas tradicionales.' },
  { id: 'Centro',     descripcion: 'El corazón gastronómico: bares de tapas, restaurantes históricos y cafeterías.' },
  { id: 'Realejo',    descripcion: 'El barrio de las terrazas nocturnas con ruta de tapas en el Campo del Príncipe.' },
  { id: 'Chana',      descripcion: 'Bares de barrio auténticos, ambiente local y tapas generosas.' },
  { id: 'Zaidin',     descripcion: 'La Avenida de Dílar concentra una de las mejores rutas de tapas de Granada.' },
  { id: 'Sacromonte', descripcion: 'Restaurantes con vistas panorámicas y cocina tradicional granadina.' },
  { id: 'Beiro',      descripcion: 'Zona tranquila con restaurantes familiares y buena relación calidad-precio.' },
  { id: 'Norte',      descripcion: 'Bares de barrio con tapas abundantes y precios ajustados.' },
];

// Rellena aquí los bares de cada zona
export const BARES: Bar[] = [
  // Ejemplo de estructura — puedes eliminar esta entrada y añadir las tuyas:
  // {
  //   id: '1',
  //   nombre: 'Bar Los Diamantes',
  //   zona: 'Centro',
  //   descripcion: 'Famoso por sus gambas y pescaíto frito. Imprescindible en Granada.',
  //   direccion: 'Calle Navas, 26, Granada',
  //   horarios: 'Lun–Dom 12:00–24:00',
  //   telefono: '958 22 00 00',
  // },
   {
   id: '1',
   nombre: 'Bar Veleta',
     zona: 'Zaidin',
     descripcion: 'Famoso por sus platos caseros y su ambiente relajado',
     direccion: 'C. Primavera, 12, Granada',
     horarios: 'Lun–Dom 12:00–24:00',
     telefono: '958 22 00 00',
   },
];
