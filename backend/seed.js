// Puebla la BD con los datos iniciales de la app
// Uso: node seed.js
require('dotenv').config();
const db = require('./db');

const eventos = [
  { titulo: 'Flamenco en el Sacromonte',          zona: 'Sacromonte', fecha: '2025-04-12', hora: '21:00', precio: 'Gratuito',             ubicacion: 'Camino del Sacromonte, s/n',       descripcion: 'Espectaculo de flamenco tradicional en las cuevas historicas. Cante, musica y baile gitano en un entorno incomparable.',              categoria: 'Musica',      aforo: '80 personas',  organizador: 'Asociacion Cultural Sacromonte' },
  { titulo: 'Visita guiada al Albaicin',           zona: 'Albaicin',   fecha: '2025-04-15', hora: '10:30', precio: 'Gratuito',             ubicacion: 'Plaza Nueva, Granada',             descripcion: 'Recorrido historico por el barrio mas antiguo de Granada, Patrimonio de la Humanidad. Guias en historia arabe y medieval.',               categoria: 'Cultura',     aforo: '25 personas',  organizador: 'Ayuntamiento de Granada' },
  { titulo: 'Mercado Artesanal del Realejo',       zona: 'Realejo',    fecha: '2025-04-20', hora: '11:00', precio: 'Gratuito',             ubicacion: 'Campo del Principe, Realejo',      descripcion: 'Mercado de artesania local con mas de 40 expositores. Ceramica, textiles, joyeria y productos de la provincia.',                         categoria: 'Mercado',     aforo: 'Libre',        organizador: 'Colectivo Artesanos Granada' },
  { titulo: 'Concierto en el Parque Garcia Lorca', zona: 'Centro',     fecha: '2025-09-14', hora: '19:00', precio: 'Gratuito',             ubicacion: 'Parque Garcia Lorca, Granada',     descripcion: 'Musica clasica al aire libre en homenaje al poeta granadino. Orquesta Ciudad de Granada.',                                                 categoria: 'Musica',      aforo: '500 personas', organizador: 'Diputacion de Granada' },
  { titulo: 'Exposicion: Granada Intima',          zona: 'Centro',     fecha: '2025-10-10', hora: '09:00', precio: 'Gratuito',             ubicacion: 'Centro Cultural Gran Capitan',     descripcion: '60 fotografias que capturan la vida cotidiana de Granada. Fotografos locales emergentes.',                                                  categoria: 'Arte',        aforo: 'Libre',        organizador: 'Escuela de Arte de Granada' },
  { titulo: 'Taller de Ceramica Arabe',            zona: 'Albaicin',   fecha: '2025-11-18', hora: '16:00', precio: 'Materiales: 5EUR',     ubicacion: 'C/ Caldereria Nueva, 14',          descripcion: 'Aprende tecnicas de ceramica nazari con maestros artesanos. Taller de 3 horas para todos los niveles.',                                    categoria: 'Talleres',    aforo: '12 personas',  organizador: 'Taller Al-Andalus' },
  { titulo: 'Ruta de Tapas del Zaidin',            zona: 'Zaidin',     fecha: '2025-12-06', hora: '13:00', precio: 'Gratuito con bebida',  ubicacion: 'Av. de Dilar (punto de encuentro)',descripcion: 'Recorre los mejores bares del Zaidin. Granada es famosa por sus tapas gratuitas al pedir una bebida.',                                    categoria: 'Gastronomia', aforo: 'Libre',        organizador: 'Hosteleros del Zaidin' },
  { titulo: 'Festival de Cine Arabe',              zona: 'Centro',     fecha: '2025-12-20', hora: '20:00', precio: 'Gratuito',             ubicacion: 'Palacio de los Cordova',           descripcion: 'Proyeccion de cortometrajes y documentales del mundo arabe. Debate posterior con los directores.',                                          categoria: 'Cine',        aforo: '150 personas', organizador: 'Casa Arabe Granada' },
  { titulo: 'Noche de Flamenco en las Cuevas',     zona: 'Sacromonte', fecha: '2026-05-03', hora: '21:30', precio: 'Gratuito',             ubicacion: 'Cuevas del Sacromonte, s/n',       descripcion: 'Una noche magica de flamenco puro entre las cuevas trogloditas del Sacromonte. Artistas locales de primer nivel.',                         categoria: 'Musica',      aforo: '60 personas',  organizador: 'Peña Flamenca La Plateria' },
  { titulo: 'Mercado Medieval de la Alhambra',     zona: 'Centro',     fecha: '2026-05-10', hora: '10:00', precio: 'Gratuito',             ubicacion: 'Paseo de la Alhambra, Granada',    descripcion: 'Mercado medieval con artesanos, musicos y actores disfrazados. Recreacion historica de la epoca nazari con mas de 80 puestos.',            categoria: 'Mercado',     aforo: 'Libre',        organizador: 'Patronato de la Alhambra' },
  { titulo: 'Festival Internacional de Jazz',      zona: 'Realejo',    fecha: '2026-05-17', hora: '20:00', precio: '5EUR',                 ubicacion: 'Plaza del Campillo, Realejo',      descripcion: 'Cuarta edicion del festival de jazz en el corazon del Realejo. Artistas nacionales e internacionales en un escenario al aire libre.',       categoria: 'Musica',      aforo: '300 personas', organizador: 'Asociacion Jazz Granada' },
  { titulo: 'Taller de Alfareria Granadina',       zona: 'Albaicin',   fecha: '2026-05-24', hora: '17:00', precio: 'Materiales: 8EUR',     ubicacion: 'C/ Agua, 5, Albaicin',            descripcion: 'Descubre el arte de la alfareria tradicional granadina con maestros ceramistas del Albaicin. Incluye piezas para llevar a casa.',           categoria: 'Talleres',    aforo: '10 personas',  organizador: 'Ceramicas La Alhambra' },
  { titulo: 'Exposicion Arte Nazari Contemporaneo',zona: 'Centro',     fecha: '2026-05-31', hora: '09:00', precio: 'Gratuito',             ubicacion: 'Museo de Bellas Artes de Granada', descripcion: 'Exposicion temporal que fusiona motivos nazaries con tecnicas de arte contemporaneo. Obra de 15 artistas granadinos.',                      categoria: 'Arte',        aforo: 'Libre',        organizador: 'Consejeria de Cultura de Andalucia' },
  { titulo: 'Cine al Aire Libre en el Zaidin',     zona: 'Zaidin',     fecha: '2026-06-06', hora: '22:00', precio: 'Gratuito',             ubicacion: 'Parque Federico Garcia Lorca, Zaidin', descripcion: 'Ciclo de cine de verano con peliculas clasicas del cine espanol. Trae tu manta y disfruta bajo las estrellas.',                      categoria: 'Cine',        aforo: 'Libre',        organizador: 'Distrito Zaidin' },
  { titulo: 'Ruta Gastronomica del Albaicin',      zona: 'Albaicin',   fecha: '2026-06-14', hora: '13:00', precio: 'Gratuito con bebida',  ubicacion: 'Plaza Larga, Albaicin',            descripcion: 'Descubre los sabores autenticos del Albaicin: tapas, vinos locales y productos artesanales en los bares mas tradicionales del barrio.',   categoria: 'Gastronomia', aforo: 'Libre',        organizador: 'Asociacion de Hosteleros del Albaicin' },
  { titulo: 'Visita Nocturna a los Jardines del Generalife', zona: 'Centro', fecha: '2026-06-21', hora: '21:00', precio: '12EUR',          ubicacion: 'Jardines del Generalife, Alhambra', descripcion: 'Visita guiada nocturna a los jardines del palacio de verano de los reyes nazaries. Iluminacion especial y musica en vivo.',              categoria: 'Cultura',     aforo: '30 personas',  organizador: 'Patronato de la Alhambra' },
  { titulo: 'Festival Mundo Arabe Granada',        zona: 'Centro',     fecha: '2026-07-05', hora: '18:00', precio: 'Gratuito',             ubicacion: 'Plaza de Bib-Rambla, Granada',     descripcion: 'Celebracion multicultural con musica arabe, danza del vientre, artesania y gastronomia del Magreb y Oriente Medio.',                      categoria: 'Cultura',     aforo: 'Libre',        organizador: 'Casa Arabe Granada' },
  { titulo: 'Taller de Cocina Andaluza',           zona: 'Centro',     fecha: '2026-07-12', hora: '11:00', precio: '15EUR',                ubicacion: 'Escuela de Cocina El Granadino, Centro', descripcion: 'Aprende a preparar los platos mas emblematicos de la gastronomia andaluza: gazpacho, remojon granadino, plato alpujarreno y tarta de la Alhambra.', categoria: 'Talleres', aforo: '16 personas', organizador: 'Escuela de Cocina El Granadino' },
  { titulo: 'Feria del Libro de Granada',          zona: 'Centro',     fecha: '2026-05-01', hora: '10:00', precio: 'Gratuito',             ubicacion: 'Paseo del Salon, Granada',         descripcion: 'La feria anual del libro reune a mas de 50 librerias y editoriales. Presentaciones de autores locales, firma de libros y actividades para niños.', categoria: 'Cultura', aforo: 'Libre', organizador: 'Gremio de Libreros de Granada' },
  { titulo: 'Mercado de Arte Contemporaneo',       zona: 'Realejo',    fecha: '2026-05-08', hora: '11:00', precio: 'Gratuito',             ubicacion: 'Plaza del Campillo, Realejo',      descripcion: 'Mas de 30 artistas locales exponen y venden obra original: pintura, escultura, fotografia y arte digital.',                                 categoria: 'Arte',        aforo: 'Libre',        organizador: 'Colectivo Arte Granada' },
  { titulo: 'Taller de Fotografia Urbana',         zona: 'Albaicin',   fecha: '2026-05-20', hora: '09:30', precio: '10EUR',                ubicacion: 'Plaza Nueva, Granada (punto de encuentro)', descripcion: 'Recorre el Albaicin con un fotografo profesional y aprende a capturar la esencia del barrio.',                                       categoria: 'Talleres',    aforo: '15 personas',  organizador: 'Escuela de Fotografia Granada' },
  { titulo: 'Festival de Teatro en la Calle',      zona: 'Realejo',    fecha: '2026-06-28', hora: '19:00', precio: 'Gratuito',             ubicacion: 'Campo del Principe y alrededores, Realejo', descripcion: 'Grupos de teatro amateur y profesional llenan las plazas y calles del Realejo con obras cortas, mimo y performance.',               categoria: 'Cultura',     aforo: 'Libre',        organizador: 'Circuito de Teatro de Granada' },
  { titulo: 'Taller de Danza Arabe',               zona: 'Centro',     fecha: '2026-07-19', hora: '18:00', precio: 'Materiales: 6EUR',     ubicacion: 'Centro Cultural Casa de Porras, Centro', descripcion: 'Introduccion a la danza del vientre y danzas folcloricas arabes. Vestuario y musica en directo. Apto para todos los niveles.',       categoria: 'Talleres',    aforo: '20 personas',  organizador: 'Centro Cultural Casa Arabe' },
];

const bares = [
  { nombre: 'Bar Veleta',           zona: 'Zaidin',   descripcion: 'Famoso por sus platos caseros y su ambiente relajado',                             direccion: 'C. Primavera, 12, Granada',          horarios: 'Lun–Dom 12:00–24:00', telefono: '958 22 00 00' },
  { nombre: 'Bar Los Diamantes',    zona: 'Centro',   descripcion: 'Clasico de Granada famoso por sus gambas y pescaito frito.',                       direccion: 'Calle Navas, 26, Granada',           horarios: 'Lun–Dom 12:00–24:00', telefono: '958 22 70 70' },
  { nombre: 'Taberna La Tana',      zona: 'Realejo',  descripcion: 'Taberna con vinos de autor y tapas creativas en el Realejo.',                      direccion: 'C/ Rosario, 11, Granada',            horarios: 'Mar–Dom 13:00–16:00, 20:00–23:30', telefono: '958 22 52 48' },
  { nombre: 'El Trillo',            zona: 'Albaicin', descripcion: 'Terraza con vistas a la Alhambra y cocina granadina tradicional.',                 direccion: 'C/ Aljibe de Trillo, 3, Albaicin',  horarios: 'Lun–Dom 13:00–23:00', telefono: '958 22 51 82' },
  { nombre: 'Bodegas Castañeda',    zona: 'Centro',   descripcion: 'Bodega centenaria con los mejores vermuts y tapas de la ciudad.',                  direccion: 'C/ Almireceros, 1-3, Granada',       horarios: 'Lun–Dom 11:30–01:00', telefono: '958 21 54 64' },
  { nombre: 'La Cueva de 1900',     zona: 'Centro',   descripcion: 'Ambiente acogedor, tapas abundantes y vinos de la tierra.',                        direccion: 'C/ Reyes Católicos, 42, Granada',   horarios: 'Lun–Dom 12:00–24:00', telefono: '958 22 40 28' },
  { nombre: 'Bar El Gordo',         zona: 'Zaidin',   descripcion: 'Referente de la ruta de tapas del Zaidin, tapa generosa con cada bebida.',         direccion: 'Av. de Dilar, 25, Granada',          horarios: 'Lun–Sab 11:00–16:00, 19:00–23:30', telefono: '958 12 34 56' },
  { nombre: 'Restaurante Arrayanes',zona: 'Albaicin', descripcion: 'Autentica cocina marroqui con vistas al Albaicin.',                                direccion: 'C/ Cuesta Maranas, 4, Albaicin',    horarios: 'Mar–Dom 13:00–16:00, 20:00–23:00', telefono: '958 22 84 01' },
  { nombre: 'Terraza Mirador',      zona: 'Sacromonte',descripcion:'Restaurante con vistas panoramicas y especialidades granadinas.',                  direccion: 'Camino del Sacromonte, 35',          horarios: 'Lun–Dom 12:00–23:00', telefono: '958 22 18 00' },
  { nombre: 'Casa Julio',           zona: 'Beiro',    descripcion: 'Bar familiar con tapas caseras y ambiente de barrio autentico.',                   direccion: 'C/ Pedro Antonio de Alarcon, 46',   horarios: 'Lun–Sab 08:00–22:00', telefono: '958 25 60 12' },
  { nombre: 'La Taberna del Realejo',zona:'Realejo',  descripcion: 'Especialidades en carnes a la brasa y tapas de temporada.',                        direccion: 'Campo del Principe, 8, Realejo',     horarios: 'Mar–Dom 13:00–16:00, 20:00–24:00', telefono: '958 22 91 34' },
  { nombre: 'Bar Churrería Norte',  zona: 'Norte',    descripcion: 'Desayunos con churros, bocadillos y tapas a buen precio en el barrio Norte.',      direccion: 'Av. de Madrid, 12, Granada',         horarios: 'Lun–Dom 07:00–14:00, 17:00–21:00', telefono: '958 28 45 67' },
  { nombre: 'El Huerto de Juan Ranas',zona:'Albaicin',descripcion: 'Terraza ajardinada con vistas directas a la Alhambra, muy popular al atardecer.', direccion: 'C/ Atarazana Vieja, 8, Albaicin',   horarios: 'Lun–Dom 12:00–24:00', telefono: '958 28 69 25' },
  { nombre: 'Mesón La Morayma',     zona: 'Albaicin', descripcion: 'Cocina andaluza clasica en un carmen tipico del Albaicin.',                        direccion: 'C/ Pianista Garcia Carillo, 2',      horarios: 'Lun–Sab 13:30–15:30, 20:00–23:00', telefono: '958 22 82 90' },
  { nombre: 'Bar Chana Pepe',       zona: 'Chana',    descripcion: 'El favorito del barrio Chana: tapa con cada consumición y buen ambiente.',          direccion: 'C/ Arabial, 56, Chana, Granada',    horarios: 'Lun–Sab 10:00–16:00, 19:00–23:00', telefono: '958 14 23 45' },
];

async function seed() {
  console.log('Iniciando seed de la base de datos...\n');

  // Limpiar tablas existentes
  await db.query('DELETE FROM eventos');
  await db.query('DELETE FROM bares');
  await db.query('ALTER TABLE eventos AUTO_INCREMENT = 1');
  await db.query('ALTER TABLE bares AUTO_INCREMENT = 1');

  // Insertar eventos
  for (const e of eventos) {
    await db.query(
      `INSERT INTO eventos (titulo, zona, fecha, hora, precio, ubicacion, descripcion, categoria, aforo, organizador)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [e.titulo, e.zona, e.fecha, e.hora, e.precio, e.ubicacion, e.descripcion, e.categoria, e.aforo, e.organizador]
    );
  }
  console.log(`✓ ${eventos.length} eventos insertados`);

  // Insertar bares
  for (const b of bares) {
    await db.query(
      `INSERT INTO bares (nombre, zona, descripcion, direccion, horarios, telefono) VALUES (?, ?, ?, ?, ?, ?)`,
      [b.nombre, b.zona, b.descripcion, b.direccion, b.horarios, b.telefono]
    );
  }
  console.log(`✓ ${bares.length} bares insertados`);

  console.log('\nSeed completado correctamente.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error en seed:', err.message);
  process.exit(1);
});
