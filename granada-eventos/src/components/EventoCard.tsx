// Componente EventoCard: tarjeta reutilizable que representa un evento en la lista.
// Se divide en dos paneles: el izquierdo con el color de la categoría muestra fecha/hora/icono,
// y el derecho blanco muestra título, badges, ubicación y descripción corta.
// Se usa en HomeScreen y BlogScreen para listar eventos.
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Evento } from '../types/evento';
import { CATEGORIA_COLORES } from '../data/eventos';
import { colors, radius, shadow } from '../theme';
import Badge from './Badge';
import PrecioTag from './PrecioTag';

// Abreviaturas de los meses para mostrar en el panel de fecha.
const MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

// Mapa que asocia cada categoría con su icono de Ionicons.
const CATEGORIA_ICONOS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  Musica: 'musical-notes',
  Cultura: 'book',
  Mercado: 'bag-handle',
  Arte: 'color-palette',
  Talleres: 'construct',
  Gastronomia: 'restaurant',
  Cine: 'film',
};

// Convierte la fecha en formato 'AAAA-MM-DD' al número de día y abreviatura de mes.
// Añadimos T00:00:00 para que no se desplace por zonas horarias.
function parseDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return { day: d.getDate(), month: MESES[d.getMonth()] };
}

// Props del componente: recibe el objeto evento y un callback que se llama al pulsarlo.
interface EventoCardProps {
  evento: Evento;
  onPress: (evento: Evento) => void;
}

export default function EventoCard({ evento, onPress }: EventoCardProps) {
  // Color de acento del panel izquierdo según la categoría del evento.
  const acento = CATEGORIA_COLORES[evento.categoria]?.acento || colors.brand;
  const iconName = CATEGORIA_ICONOS[evento.categoria] || 'calendar';
  const { day, month } = parseDate(evento.fecha);

  return (
    <TouchableOpacity
      style={[styles.card, shadow.card]}
      onPress={() => onPress(evento)}
      activeOpacity={0.85}
    >
      {/* Panel izquierdo coloreado ~25% — muestra fecha, hora e icono de categoría */}
      <View style={[styles.accentPanel, { backgroundColor: acento }]}>
        <Ionicons name={iconName} size={20} color="rgba(255,255,255,0.9)" />
        <Text style={styles.accentDay}>{day}</Text>
        <Text style={styles.accentMonth}>{month}</Text>
        <Text style={styles.accentHour}>{evento.hora}</Text>
      </View>

      {/* Panel derecho blanco ~75% — muestra el resto de información */}
      <View style={styles.body}>
        {/* Fila superior: badge de categoría a la izquierda, precio a la derecha */}
        <View style={styles.rowTop}>
          <Badge categoria={evento.categoria} />
          <PrecioTag precio={evento.precio} />
        </View>

        <Text style={styles.titulo} numberOfLines={2}>
          {evento.titulo}
        </Text>

        {/* Metadatos: ubicación y zona */}
        <View style={styles.meta}>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={12} color={colors.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {evento.ubicacion}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="map-outline" size={12} color={acento} />
            <Text style={[styles.metaText, { color: acento, fontWeight: '600' }]}>{evento.zona}</Text>
          </View>
        </View>

        <Text style={styles.descripcion} numberOfLines={2}>
          {evento.descripcion}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
  },
  accentPanel: {
    width: 78,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 3,
  },
  accentDay: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 24,
  },
  accentMonth: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1,
  },
  accentHour: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  body: {
    flex: 1,
    padding: 13,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  titulo: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 7,
    lineHeight: 20,
  },
  meta: { gap: 4, marginBottom: 7 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 11, color: colors.textMuted, flex: 1 },
  descripcion: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },
});
