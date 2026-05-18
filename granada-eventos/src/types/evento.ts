// Tipos principales relacionados con los eventos de la aplicación.

// Sesion indica si hay usuario autenticado. null = visitante, 'admin' = administrador.
export type Sesion = 'admin' | null;

// Interfaz Evento: representa un evento tal como lo devuelve la API / base de datos.
// Todos los campos son obligatorios excepto imagen, que puede no estar definida.
export interface Evento {
  id: string;           // identificador único generado por la BD
  titulo: string;
  zona: string;         // barrio o zona de Granada donde se celebra
  fecha: string;        // formato AAAA-MM-DD
  hora: string;         // formato HH:MM
  precio: string;       // texto libre: 'Gratuito', '5€', etc.
  ubicacion: string;    // dirección completa
  descripcion: string;
  categoria: string;    // debe coincidir con una de las CATEGORIAS de data/eventos.ts
  aforo: string;        // texto libre: 'Libre', '50 personas', etc.
  organizador: string;
  imagen?: string;      // URL externa o ruta local en el dispositivo
}

// EventoInput es lo que se manda al crear o editar un evento.
// Es igual que Evento pero sin el id, que lo asigna la base de datos automáticamente.
export type EventoInput = Omit<Evento, 'id'>;
