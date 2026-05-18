// AppContext es el contexto global de la aplicación.
// Guarda el estado compartido (eventos, sesión, favoritos...) y lo pone disponible
// en cualquier pantalla sin tener que pasar props de componente en componente.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Evento, EventoInput, Sesion } from '../types/evento';
import type { Bar } from '../types/bar';
import * as api from '../services/api';

// Todo lo que el contexto expone hacia fuera.
// Cada pantalla que llame a useApp() tendrá acceso a estas propiedades y funciones.
interface AppContextValue {
  sesion: Sesion;                                                    // null = visitante, 'admin' = logueado
  loginError: string;                                                // mensaje de error del último intento de login
  setLoginError: (value: string) => void;
  login: (usuario: string, password: string) => Promise<boolean>;   // llama a la API y guarda el token
  logout: () => Promise<void>;                                       // borra el token y vuelve a visitante
  eventos: Evento[];                                                 // lista de eventos cargados desde la BD
  bares: Bar[];                                                      // lista de bares cargados desde la BD
  cargando: boolean;                                                 // true mientras se cargan los datos al iniciar
  crearEvento: (nuevoEvento: EventoInput) => Promise<Evento>;        // POST a la API + actualiza el estado local
  eliminarEvento: (id: string) => Promise<void>;                     // DELETE en la API + quita del estado local
  editarEvento: (id: string, datos: Partial<EventoInput>) => Promise<void>; // PUT en la API + actualiza el estado local
  esAdmin: boolean;                                                  // true si sesion === 'admin'
  favoritos: string[];                                               // ids de eventos marcados como favoritos
  toggleFavorito: (id: string) => void;                              // añade o quita un favorito y lo persiste
  esFavorito: (id: string) => boolean;                               // comprueba si un evento está en favoritos
  favoritosBares: string[];                                          // ids de bares marcados como favoritos
  toggleFavoritoBar: (id: string) => void;
  esFavoritoBar: (id: string) => boolean;
}

// Claves con las que guardamos los favoritos en AsyncStorage (almacenamiento persistente del dispositivo).
const FAVORITOS_STORAGE_KEY  = '@granada_favoritos';
const FAVORITOS_BARES_KEY    = '@granada_favoritos_bares';

// Creamos el contexto. El valor inicial es undefined; si alguien llama a useApp() fuera
// del Provider lanzará un error explicativo.
const AppContext = createContext<AppContextValue | undefined>(undefined);

// AppProvider es el componente que envuelve toda la app en App.tsx.
// Todos los useState y las funciones viven aquí y se pasan como value al Provider.
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sesion,        setSesion]        = useState<Sesion>(null);
  const [loginError,    setLoginError]    = useState('');
  const [eventos,       setEventos]       = useState<Evento[]>([]);
  const [bares,         setBares]         = useState<Bar[]>([]);
  const [favoritos,     setFavoritos]     = useState<string[]>([]);
  const [favoritosBares,setFavoritosBares]= useState<string[]>([]);
  const [cargando,      setCargando]      = useState(true);

  // Al montar el Provider (inicio de la app) cargamos en paralelo:
  //  - Los eventos y bares desde la API/BD
  //  - Los favoritos que el usuario había guardado localmente
  //  - El token JWT para saber si la sesión anterior sigue activa
  useEffect(() => {
    async function cargarDatos() {
      try {
        const [eventosApi, baresApi, favAlmacenados, favBaresAlmacenados, token] = await Promise.all([
          api.getEventos().catch(() => [] as Evento[]),       // si falla la red devuelve array vacío
          api.getBares().catch(() => [] as Bar[]),
          AsyncStorage.getItem(FAVORITOS_STORAGE_KEY),
          AsyncStorage.getItem(FAVORITOS_BARES_KEY),
          api.tokenGuardado(),                               // comprueba si hay sesión guardada
        ]);

        setEventos(eventosApi);
        setBares(baresApi);
        if (favAlmacenados)      setFavoritos(JSON.parse(favAlmacenados));
        if (favBaresAlmacenados) setFavoritosBares(JSON.parse(favBaresAlmacenados));
        if (token)               setSesion('admin');         // restaura la sesión si el token existe
      } catch (error) {
        console.warn('Error al cargar datos de la API', error);
      } finally {
        setCargando(false); // independientemente del resultado, ya no estamos cargando
      }
    }
    cargarDatos();
  }, []);

  // Llama al endpoint de login. Si la API devuelve token, actualiza la sesión.
  async function login(usuario: string, password: string): Promise<boolean> {
    const token = await api.apiLogin(usuario, password);
    if (token) {
      setSesion('admin');
      setLoginError('');
      return true;
    }
    setLoginError('Usuario o contraseña incorrectos.');
    return false;
  }

  // Borra el token del dispositivo y resetea la sesión a visitante.
  async function logout(): Promise<void> {
    await api.apiLogout();
    setSesion(null);
    setLoginError('');
  }

  // Crea el evento en la BD via API y lo añade al principio de la lista local
  // para que aparezca inmediatamente sin tener que recargar toda la lista.
  async function crearEvento(nuevoEvento: EventoInput): Promise<Evento> {
    const evento = await api.crearEventoApi(nuevoEvento);
    setEventos((prev) => [evento, ...prev]);
    return evento;
  }

  // Elimina el evento de la BD y lo quita del array local filtrando por id.
  async function eliminarEvento(id: string): Promise<void> {
    await api.eliminarEventoApi(id);
    setEventos((prev) => prev.filter((e) => e.id !== id));
  }

  // Edita el evento en la BD y reemplaza en el array local el objeto antiguo
  // por el actualizado que devuelve la API.
  async function editarEvento(id: string, datos: Partial<EventoInput>): Promise<void> {
    const actualizado = await api.editarEventoApi(id, datos);
    setEventos((prev) => prev.map((e) => (e.id === id ? actualizado : e)));
  }

  // Añade o quita un evento de favoritos y guarda la lista actualizada en AsyncStorage
  // para que persista aunque el usuario cierre la app.
  const toggleFavorito = useCallback((id: string) => {
    setFavoritos((prev) => {
      const actualizados = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      AsyncStorage.setItem(FAVORITOS_STORAGE_KEY, JSON.stringify(actualizados));
      return actualizados;
    });
  }, []);

  // Devuelve true si el id está en la lista de favoritos. useCallback evita recrear la función en cada render.
  const esFavorito = useCallback((id: string) => favoritos.includes(id), [favoritos]);

  // Igual que toggleFavorito pero para bares.
  const toggleFavoritoBar = useCallback((id: string) => {
    setFavoritosBares((prev) => {
      const actualizados = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      AsyncStorage.setItem(FAVORITOS_BARES_KEY, JSON.stringify(actualizados));
      return actualizados;
    });
  }, []);

  const esFavoritoBar = useCallback((id: string) => favoritosBares.includes(id), [favoritosBares]);

  // El Provider pasa todo el estado y las funciones a los componentes hijos.
  return (
    <AppContext.Provider
      value={{
        sesion,
        loginError,
        setLoginError,
        login,
        logout,
        eventos,
        bares,
        cargando,
        crearEvento,
        eliminarEvento,
        editarEvento,
        esAdmin: sesion === 'admin',
        favoritos,
        toggleFavorito,
        esFavorito,
        favoritosBares,
        toggleFavoritoBar,
        esFavoritoBar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado para consumir el contexto.
// Cualquier pantalla que necesite datos globales importa este hook: const { eventos } = useApp();
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}
