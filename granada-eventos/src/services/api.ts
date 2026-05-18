// Servicio que gestiona todas las llamadas HTTP a la API REST del servidor.
// El servidor corre en Node.js con Express y SQLite y expone los endpoints bajo /api.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Evento, EventoInput } from '../types/evento';
import type { Bar } from '../types/bar';

// IMPORTANTE: cambia esta IP según desde dónde ejecutes la app.
//  - Emulador Android:   10.0.2.2  (redirige al localhost del PC)
//  - Simulador iOS:      localhost
//  - Dispositivo físico: tu IP local (ej. 192.168.1.X)
//  Puedes verla con: ipconfig (Windows) → "IPv4 Address"
const BASE_URL = 'http://192.168.1.139:3000/api';

// Clave con la que guardamos el token JWT en AsyncStorage (almacenamiento local del móvil)
const TOKEN_KEY = '@granada_token';

// Esta función devuelve el header Authorization con el token guardado.
// Se añade a las peticiones que requieren estar autenticado (crear, editar, borrar).
async function authHeader(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── AUTH ────────────────────────────────────────────────

// Envía usuario y contraseña al servidor. Si son correctos, la API devuelve
// un token JWT que guardamos en AsyncStorage para futuras peticiones.
export async function apiLogin(usuario: string, password: string): Promise<string | null> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  await AsyncStorage.setItem(TOKEN_KEY, data.token);
  return data.token;
}

// Elimina el token guardado. Al no tener token, el usuario pasa a ser visitante.
export async function apiLogout(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// Comprueba si ya hay un token guardado del inicio de sesión anterior.
// Se usa al arrancar la app para restaurar la sesión automáticamente.
export async function tokenGuardado(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

// ── EVENTOS ─────────────────────────────────────────────

// Obtiene todos los eventos de la base de datos. No requiere autenticación.
export async function getEventos(): Promise<Evento[]> {
  const res = await fetch(`${BASE_URL}/eventos`);
  if (!res.ok) throw new Error('Error al cargar eventos');
  return res.json();
}

// Crea un nuevo evento en la base de datos. Requiere token de admin.
export async function crearEventoApi(evento: EventoInput): Promise<Evento> {
  const headers = await authHeader();
  const res = await fetch(`${BASE_URL}/eventos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(evento),
  });
  if (!res.ok) throw new Error('Error al crear evento');
  return res.json();
}

// Actualiza los datos de un evento ya existente. Requiere token de admin.
// Usamos PUT y mandamos solo los campos que cambiaron (Partial<EventoInput>).
export async function editarEventoApi(id: string, datos: Partial<EventoInput>): Promise<Evento> {
  const headers = await authHeader();
  const res = await fetch(`${BASE_URL}/eventos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error('Error al editar evento');
  return res.json();
}

// Elimina un evento de la base de datos por su id. Requiere token de admin.
export async function eliminarEventoApi(id: string): Promise<void> {
  const headers = await authHeader();
  const res = await fetch(`${BASE_URL}/eventos/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Error al eliminar evento');
}

// ── BARES ────────────────────────────────────────────────

// Obtiene la lista de bares y restaurantes de la base de datos. Sin autenticación.
export async function getBares(): Promise<Bar[]> {
  const res = await fetch(`${BASE_URL}/bares`);
  if (!res.ok) throw new Error('Error al cargar bares');
  return res.json();
}

// ── TIPOS ────────────────────────────────────────────────

// Estructura de un comentario tal como lo devuelve la API.
export interface Comentario {
  id: number;
  evento_id: number;
  autor: string;
  texto: string;
  created_at: string; // fecha ISO que devuelve SQLite
}

// Respuesta de la API para las valoraciones: lista de votos + media calculada + total.
export interface ResumenValoraciones {
  valoraciones: { id: number; evento_id: number; puntuacion: number; created_at: string }[];
  media: number;
  total: number;
}

// ── COMENTARIOS ──────────────────────────────────────────

// Devuelve los comentarios de un evento concreto filtrando por evento_id.
export async function getComentarios(eventoId: string): Promise<Comentario[]> {
  const res = await fetch(`${BASE_URL}/comentarios?evento_id=${eventoId}`);
  if (!res.ok) throw new Error('Error al cargar comentarios');
  return res.json();
}

// Manda un nuevo comentario al servidor. Cualquier visitante puede comentar, no hace falta login.
export async function crearComentario(eventoId: string, texto: string, autor: string): Promise<Comentario> {
  const res = await fetch(`${BASE_URL}/comentarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evento_id: Number(eventoId), texto, autor }),
  });
  if (!res.ok) throw new Error('Error al enviar comentario');
  return res.json();
}

// ── VALORACIONES ─────────────────────────────────────────

// Obtiene la media de valoraciones y el número total de votos de un evento.
export async function getValoraciones(eventoId: string): Promise<ResumenValoraciones> {
  const res = await fetch(`${BASE_URL}/valoraciones?evento_id=${eventoId}`);
  if (!res.ok) throw new Error('Error al cargar valoraciones');
  return res.json();
}

// Guarda una valoración de 1 a 5 estrellas para un evento. Sin autenticación.
export async function crearValoracion(eventoId: string, puntuacion: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/valoraciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evento_id: Number(eventoId), puntuacion }),
  });
  if (!res.ok) throw new Error('Error al enviar valoración');
}
