// Pantalla de detalle de un evento.
// Muestra toda la información del evento, permite valorarlo con estrellas,
// leer y escribir comentarios (ambos guardados en la base de datos via API),
// compartirlo, abrirlo en mapas y marcarlo como favorito.
// Si el usuario es admin aparecen botones para editar y eliminar el evento.
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Badge from '../components/Badge';
import PrecioTag from '../components/PrecioTag';
import { useApp } from '../context/AppContext';
import { CATEGORIA_COLORES } from '../data/eventos';
import * as api from '../services/api';
import type { Comentario } from '../services/api';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalleEvento'>;

// Convierte '2026-05-15' en 'jueves, 15 de mayo de 2026' usando el locale español.
function formatFecha(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

// Convierte una fecha ISO completa (de created_at de la BD) en formato legible corto.
function formatHora(isoStr: string) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// Componente interno reutilizable para cada fila de la cuadrícula de información
// (Fecha, Hora, Lugar, Zona, Precio, Aforo). Recibe icono, etiqueta y valor.
interface InfoRowProps {
  icono: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  valor: string;
}
function InfoRow({ icono, label, valor }: InfoRowProps) {
  return (
    <View style={styles.infoBox}>
      <View style={styles.infoLabelRow}>
        <Ionicons name={icono} size={12} color={colors.textMuted} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  );
}

export default function DetalleEventoScreen({ route, navigation }: Props) {
  const { esAdmin, eliminarEvento, toggleFavorito, esFavorito, eventos } = useApp();

  // Siempre usamos el evento del estado global (puede haber sido editado),
  // con el evento de los params como fallback si aún no se ha cargado.
  const evento = eventos.find((e) => e.id === route.params.evento.id) ?? route.params.evento;
  const favorito = esFavorito(evento.id);

  // ── Estado de valoraciones ─────────────────────────────
  const [media, setMedia]               = useState(0);
  const [totalVal, setTotalVal]         = useState(0);
  const [miPuntuacion, setMiPuntuacion] = useState(0);   // estrellas seleccionadas (0 = ninguna)
  const [yaVotado, setYaVotado]         = useState(false); // true después de publicar
  const [enviandoVal, setEnviandoVal]   = useState(false);

  // ── Estado de comentarios ──────────────────────────────
  const [comentarios, setComentarios]   = useState<Comentario[]>([]);
  const [cargandoComs, setCargandoComs] = useState(true);    // spinner mientras carga la lista
  const [nuevoTexto, setNuevoTexto]     = useState('');
  const [nuevoAutor, setNuevoAutor]     = useState('');

  // Al montar la pantalla cargamos en paralelo los comentarios y las valoraciones
  // del evento desde la API. Si falla la red las secciones quedan vacías sin romper la app.
  useEffect(() => {
    setMiPuntuacion(0);
    setYaVotado(false);
    setMedia(0);
    setTotalVal(0);
    setComentarios([]);
    setCargandoComs(true);

    async function cargar() {
      try {
        const [comsData, valData] = await Promise.all([
          api.getComentarios(evento.id),
          api.getValoraciones(evento.id),
        ]);
        setComentarios(comsData);
        setMedia(valData.media ?? 0);
        setTotalVal(valData.total ?? 0);
      } catch {
        // sin conexión — secciones quedan vacías pero la pantalla funciona
      } finally {
        setCargandoComs(false);
      }
    }
    cargar();
  }, [evento.id]);

  function handleValorar(puntuacion: number) {
    if (yaVotado || enviandoVal) return;
    setMiPuntuacion(puntuacion);
  }

  // Envía valoración (obligatoria) y comentario (opcional) juntos en un solo paso.
  async function handlePublicar() {
    if (yaVotado || enviandoVal || miPuntuacion === 0) return;
    setEnviandoVal(true);
    try {
      await api.crearValoracion(evento.id, miPuntuacion);
      const valData = await api.getValoraciones(evento.id);
      setMedia(valData.media ?? 0);
      setTotalVal(valData.total ?? 0);
      setYaVotado(true);
      if (nuevoTexto.trim()) {
        const com = await api.crearComentario(
          evento.id,
          nuevoTexto.trim(),
          nuevoAutor.trim() || 'Visitante',
        );
        setComentarios((prev) => [com, ...prev]);
        setNuevoTexto('');
        setNuevoAutor('');
      }
    } catch {
      Alert.alert('Error', 'No se pudo publicar. Comprueba la conexión.');
    } finally {
      setEnviandoVal(false);
    }
  }

  // Muestra un Alert de confirmación antes de borrar el evento de la BD.
  function handleEliminar() {
    Alert.alert('Eliminar evento', `Seguro que quieres eliminar "${evento.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminarEvento(evento.id); // DELETE en la API + actualiza estado global
            navigation.goBack();
          } catch {
            Alert.alert('Error', 'No se pudo eliminar el evento. Comprueba la conexion con el servidor.');
          }
        },
      },
    ]);
  }

  // Abre el diálogo nativo de compartir con la información del evento formateada.
  async function handleCompartir() {
    try {
      await Share.share({
        title: evento.titulo,
        message:
          `¡Echa un vistazo a este evento en Granada! ${evento.titulo}\n` +
          ` ${evento.ubicacion} (${evento.zona})\n` +
          ` ${formatFecha(evento.fecha)} — ${evento.hora}\n` +
          ` ${evento.precio}\n\n${evento.descripcion}\n\nOrganiza: ${evento.organizador}`,
      });
    } catch { /* usuario canceló el diálogo */ }
  }

  // Abre la ubicación del evento en Google Maps (Android) o Apple Maps (iOS).
  function handleAbrirMapa() {
    const query = encodeURIComponent(`${evento.ubicacion}, Granada, España`);
    const url = Platform.OS === 'ios'
      ? `maps://maps.apple.com/?q=${query}`
      : `https://maps.google.com/?q=${query}`;
    Linking.openURL(url);
  }

  const estrellasActivas = miPuntuacion;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Barra de navegación superior con botones de volver y acciones */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.navActions}>
          {/* Botón compartir */}
          <TouchableOpacity style={styles.actionBtn} onPress={handleCompartir}>
            <Ionicons name="share-outline" size={18} color={colors.textMuted} />
          </TouchableOpacity>
          {/* Botón abrir en mapas */}
          <TouchableOpacity style={styles.actionBtn} onPress={handleAbrirMapa}>
            <Ionicons name="navigate-outline" size={18} color={colors.textMuted} />
          </TouchableOpacity>
          {/* Botón favorito — se pone rojo al activarse */}
          <TouchableOpacity
            style={[styles.actionBtn, favorito && { backgroundColor: '#fee2e2' }]}
            onPress={() => toggleFavorito(evento.id)}
          >
            <Ionicons
              name={favorito ? 'heart' : 'heart-outline'}
              size={18}
              color={favorito ? '#dc2626' : colors.textMuted}
            />
          </TouchableOpacity>
          {/* Botones de editar y eliminar solo para administradores */}
          {esAdmin && (
            <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('CrearEvento', { evento })}>
              <Ionicons name="pencil-outline" size={18} color={colors.brand} />
            </TouchableOpacity>
          )}
          {esAdmin && (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleEliminar}>
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* KeyboardAvoidingView sube el contenido cuando aparece el teclado en iOS */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Imagen del evento si tiene una URL o ruta local */}
          {evento.imagen ? (
            <Image source={{ uri: evento.imagen }} style={styles.eventImage} resizeMode="cover" />
          ) : null}

          {/* Badges de categoría y precio */}
          <View style={styles.cabecera}>
            <Badge categoria={evento.categoria} />
            <PrecioTag precio={evento.precio} />
          </View>

          <Text style={styles.titulo}>{evento.titulo}</Text>

          {/* Cuadrícula 2 columnas con los datos principales del evento */}
          <View style={styles.infoGrid}>
            <InfoRow icono="calendar-outline" label="Fecha"  valor={formatFecha(evento.fecha)} />
            <InfoRow icono="time-outline"     label="Hora"   valor={evento.hora} />
            <InfoRow icono="location-outline" label="Lugar"  valor={evento.ubicacion} />
            <InfoRow icono="map-outline"      label="Zona"   valor={evento.zona} />
            <InfoRow icono="cash-outline"     label="Precio" valor={evento.precio} />
            <InfoRow icono="people-outline"   label="Aforo"  valor={evento.aforo} />
          </View>

          {/* ── Descripción completa ── */}
          <View style={styles.seccion}>
            <Text style={styles.seccionTitle}>Descripcion</Text>
            <Text style={styles.descripcion}>{evento.descripcion}</Text>
          </View>

          {/* ── Sección de opiniones (valoración + comentario) ── */}
          <View style={styles.seccion}>
            <Text style={styles.seccionTitle}>
              Opiniones{comentarios.length > 0 ? ` (${comentarios.length})` : ''}
            </Text>

            {cargandoComs ? (
              <ActivityIndicator color={colors.brand} style={{ marginVertical: 12 }} />
            ) : comentarios.length === 0 ? (
              <Text style={styles.sinComentarios}>Aún no hay opiniones · sé el primero</Text>
            ) : (
              comentarios.map((c) => (
                <View key={c.id} style={styles.comentarioCard}>
                  <View style={styles.comentarioHeader}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarLetra}>{c.autor.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.comentarioAutor}>{c.autor}</Text>
                      <Text style={styles.comentarioFecha}>{formatHora(c.created_at)}</Text>
                    </View>
                  </View>
                  <Text style={styles.comentarioTexto}>{c.texto}</Text>
                </View>
              ))
            )}

            {/* Formulario unificado: valoración + comentario opcional */}
            {!yaVotado ? (
              <View style={styles.formComentario}>
                <View style={styles.estrellasRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <TouchableOpacity key={n} onPress={() => handleValorar(n)} activeOpacity={0.7}>
                      <Ionicons
                        name={n <= estrellasActivas ? 'star' : 'star-outline'}
                        size={28}
                        color="#f59e0b"
                      />
                    </TouchableOpacity>
                  ))}
                  {totalVal > 0 && (
                    <Text style={[styles.mediaTexto, { marginLeft: 8 }]}>{media}/5 ({totalVal})</Text>
                  )}
                </View>
                <TextInput
                  style={styles.inputNombre}
                  placeholder="Tu nombre (opcional)"
                  placeholderTextColor={colors.textMuted}
                  value={nuevoAutor}
                  onChangeText={setNuevoAutor}
                  editable={!enviandoVal}
                />
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.inputTexto}
                    placeholder="Comentario opcional..."
                    placeholderTextColor={colors.textMuted}
                    value={nuevoTexto}
                    onChangeText={setNuevoTexto}
                    multiline
                    editable={!enviandoVal}
                  />
                  <TouchableOpacity
                    style={[styles.btnEnviar, (miPuntuacion === 0 || enviandoVal) && styles.btnEnviarDisabled]}
                    onPress={handlePublicar}
                    disabled={miPuntuacion === 0 || enviandoVal}
                  >
                    {enviandoVal
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <Ionicons name="send" size={18} color="#fff" />}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.formComentario}>
                <Text style={styles.tuVotoTexto}>Has votado {miPuntuacion} ★ · {media}/5 ({totalVal} {totalVal === 1 ? 'valoración' : 'valoraciones'})</Text>
              </View>
            )}
          </View>

          {/* Pie de página con el nombre del organizador */}
          <View style={styles.organizadorBox}>
            <Ionicons name="business-outline" size={14} color={colors.textMuted} />
            <Text style={styles.organizadorLabel}>Organiza: </Text>
            <Text style={styles.organizadorNombre}>{evento.organizador}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#fffdf7' },
  scroll:  { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: 20,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#f0e9dc',
    alignItems: 'center', justifyContent: 'center',
  },
  navActions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.bgPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
  editBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.adminBg,
    alignItems: 'center', justifyContent: 'center',
  },
  deleteBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.errorBg,
    alignItems: 'center', justifyContent: 'center',
  },

  eventImage: { width: '100%', height: 220, borderRadius: radius.lg, marginBottom: 18 },
  cabecera: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  titulo: {
    fontSize: 22, fontWeight: '800', color: colors.textPrimary,
    lineHeight: 30, marginBottom: 20,
  },

  infoGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  infoBox:     { width: '47%', backgroundColor: '#f7f2ea', borderRadius: radius.md, padding: 12 },
  infoLabelRow:{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  infoLabel:   { fontSize: 10, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 },
  infoValor:   { fontSize: 13, fontWeight: '700', color: '#2d1e0a' },

  seccion:      { marginBottom: 24 },
  seccionTitle: {
    fontSize: 11, fontWeight: '700', color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
  },
  descripcion:  { fontSize: 15, color: '#4a3520', lineHeight: 24 },

  estrellasRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  mediaTexto:   { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  tuVotoTexto:  { fontSize: 12, color: colors.brand, fontWeight: '600', marginTop: 4 },

  sinComentarios: { fontSize: 13, color: colors.textMuted, fontStyle: 'italic', marginBottom: 12 },

  comentarioCard: {
    backgroundColor: '#f7f2ea',
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 10,
  },
  comentarioHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  avatarCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLetra:      { color: '#fff', fontWeight: '800', fontSize: 14 },
  comentarioAutor:  { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  comentarioFecha:  { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  comentarioTexto:  { fontSize: 14, color: '#4a3520', lineHeight: 20 },

  formComentario: { marginTop: 12, gap: 8 },
  inputNombre: {
    backgroundColor: colors.bgPrimary,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: colors.textPrimary,
  },
  inputRow:  { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  inputTexto: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderInput,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: colors.textPrimary,
    minHeight: 44,
    maxHeight: 100,
  },
  btnEnviar: {
    width: 44, height: 44, borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  btnEnviarDisabled: { backgroundColor: '#d6cfc4' },

  organizadorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border,
  },
  organizadorLabel:  { fontSize: 13, color: colors.textMuted },
  organizadorNombre: { fontSize: 13, color: colors.textSecondary, fontWeight: '600', flex: 1 },
});
