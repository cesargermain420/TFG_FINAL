import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import EventoCard from '../components/EventoCard';
import { useApp } from '../context/AppContext';
import { ZONAS } from '../data/eventos';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Blog'>;

interface BarrioInfo {
  id: string;
  nombre: string;
  subtitulo: string;
  descripcion: string;
  historia: string;
  atracciones: string[];
  consejo: string;
  imagen?: ImageSourcePropType;
}

//LLENAR CADA BARRIO MANUAL DESDE AQUI

const BARRIOS_INFO: BarrioInfo[] = [
  {
    id: '1',
    nombre: 'Albaicín',
    subtitulo: 'Patrimonio de la Humanidad · UNESCO 1994',
    descripcion:
      'El Albaicín es el barrio árabe más antiguo de Granada, encaramado en una colina frente a la Alhambra. Sus callejuelas empedradas, casas encaladas y cármenes (jardines privados) conservan la esencia de la ciudad medieval.',
    historia:
      'Fue el corazón urbano de la Granada zirí y nazarí durante siglos. Tras la Reconquista en 1492, los musulmanes se concentraron aquí antes de la expulsión de los moriscos en 1609. Hoy conviven vecinos tradicionales, artistas y turistas en perfecta armonía.',
    atracciones: [
      'Mirador de San Nicolás (vistas a la Alhambra)',
      'Baños Árabes El Bañuelo (s. XI)',
      'Iglesia de San Salvador (antigua mezquita)',
      'Placeta de San Miguel Bajo',
      'Callejería Morisca',
    ],
    consejo: 'Visita al atardecer para contemplar la Alhambra iluminada. Sube desde Plaza Nueva por la Carrera del Darro.',
    imagen: require('../../assets/albaicin.jpg'),
  },
  {
    id: '2',
    nombre: 'Sacromonte',
    subtitulo: 'El barrio del flamenco gitano',
    descripcion:
      'Sacromonte es el barrio más bohemio de Granada, famoso por sus cuevas excavadas en la roca donde viven familias gitanas desde el siglo XV. Es la cuna del flamenco granadino y escenario de zambras y espectáculos únicos.',
    historia:
      'La comunidad gitana llegó a Granada tras la Reconquista y se asentó en estas cuevas por su frescor en verano y calor en invierno. La tradición del flamenco-zambra nació aquí y hoy se conserva en las tablaos auténticos de la ladera.',
    atracciones: [
      'Cuevas del Sacromonte (viviendas trogloditas)',
      'Museo Cuevas del Sacromonte',
      'Abadía del Sacromonte (s. XVII)',
      'Camino del Sacromonte (vistas panorámicas)',
      'Zambra en vivo (espectáculos nocturnos)',
    ],
    consejo: 'Reserva con antelación una zambra flamenca auténtica. El museo es gratuito los martes.',
    imagen: require('../../assets/sacromonte.jpg'),
  },
  {
    id: '3',
    nombre: 'Centro',
    subtitulo: 'El corazón comercial y cultural',
    descripcion:
      'El centro de Granada concentra los grandes monumentos históricos junto a una vibrante vida comercial y universitaria. La Catedral, la Capilla Real y la Alcaicería conviven con cafeterías y tiendas de toda la vida.',
    historia:
      'Sobre la antigua medina árabe, los Reyes Católicos levantaron la Catedral y la Capilla Real donde reposan sus restos. La universidad, fundada en 1531, convirtió a Granada en referente cultural del sur de España durante siglos.',
    atracciones: [
      'Catedral de Granada (s. XVI)',
      'Capilla Real (sepulcro de los Reyes Católicos)',
      'Alcaicería (antiguo zoco árabe)',
      'Corral del Carbón (s. XIV, único nazarí conservado)',
      'Calle Reyes Católicos y Gran Vía',
    ],
    consejo: 'La entrada combinada Catedral + Capilla Real + Monasterio San Jerónimo ahorra dinero. Visita entre semana para evitar colas.',
    imagen: require('../../assets/centro.jpg'),
  },
  {
    id: '4',
    nombre: 'Realejo',
    subtitulo: 'El antiguo barrio judío',
    descripcion:
      'El Realejo fue la judería de Granada en época nazarí. Hoy es uno de los barrios con más vida nocturna y cultural, con terrazas animadas, galerías de arte y el Campo del Príncipe como plaza central.',
    historia:
      'Antes de 1492, era el barrio judío (aljama). Tras la expulsión de los judíos, fue repoblado por castellanos. El siglo XX lo transformó en un barrio universitario y bohemio que conserva callejuelas medievales.',
    atracciones: [
      'Campo del Príncipe (plaza histórica)',
      'Palacio de los Córdova',
      'Casa de los Tiros (museo granadino)',
      'Calle Molinos y cuevas de artesanos',
      'Muralla zirí y restos árabes',
    ],
    consejo: 'Perfecto para tapas y copas por la noche. El Campo del Príncipe tiene las terrazas más animadas del centro.',
    imagen: require('../../assets/realejo.jpg'),
  },
  {
    id: '5',
    nombre: 'Zaidín',
    subtitulo: 'El barrio residencial más grande',
    descripcion:
      'El Zaidín es el barrio más poblado de Granada, un área residencial moderna con una gran vida de barrio, mercados locales y una gran variedad de restaurantes y bares para tapear',
    historia:
      'Creció principalmente en los años 60-70 del siglo XX con la expansión urbana. Su nombre árabe significa "jardín de olivos".',
    atracciones: [
      'Huerta de San Vicente (casa natal del poeta)',
      'Mercado del Zaidín',
      'Avenida de Dílar (ruta de tapas)',
      'Iglesia de San Matías',
    ],
    consejo: 'La Huerta de San Vicente tiene visitas guiadas muy interesantes. El parque es ideal para familias los fines de semana.',
    imagen: require('../../assets/zaidin.jpg'),
  },
  {
    id: '6',
    nombre: 'Beiro',
    subtitulo: 'Naturaleza y vistas al norte',
    descripcion:
      'Beiro es un barrio residencial tranquilo al norte de Granada, conocido por sus vistas a Sierra Nevada y sus amplias zonas verdes. Cuenta con el Parque de las Palomas, uno de los parques más frecuentados por familias granadinas.',
    historia:
      'Zona de expansión urbana de finales del siglo XX, integra barriadas como Cartuja y Almanjáyar. Destaca por la cercanía al Monasterio de la Cartuja, joya del barroco español.',
    atracciones: [
      'Monasterio de la Cartuja (sacristía barroca única)',
      'Hospital Real (Universidad de Granada)',
      'Parque de las Palomas',
      'Campus Universitario de Cartuja',
      'Vistas panorámicas a Sierra Nevada',
    ],
    consejo: 'El Monasterio de la Cartuja tiene una sacristía considerada el barroco más elaborado de España. Entrada libre algunos días.',
    imagen: require('../../assets/beiro.jpg'),
  },
];

// LLENAR PESTAÑA EVENTOS RECIENTES USANDO HOMESCREEN

export default function BlogScreen({ navigation }: Props) {
  const { eventos } = useApp();
  const [zonaSeleccionada, setZonaSeleccionada] = useState('Todas');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarBarrios, setMostrarBarrios] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);

  const hoy = new Date().toISOString().split('T')[0];

  const eventosRecientes = useMemo(
    () =>
      eventos
        .filter((ev) => ev.fecha < hoy)
        .filter((ev) => {
          const matchZona = zonaSeleccionada === 'Todas' || ev.zona === zonaSeleccionada;
          const matchCategoria = categoriaSeleccionada === 'Todas' || ev.categoria === categoriaSeleccionada;
          const q = busqueda.toLowerCase();
          const matchBusqueda =
            !busqueda ||
            [ev.titulo, ev.zona, ev.categoria, ev.descripcion].some((c) =>
              c.toLowerCase().includes(q)
            );
          return matchZona && matchCategoria && matchBusqueda;
        })
        .sort((a, b) => (a.fecha > b.fecha ? -1 : 1)), // más recientes primero
    [eventos, zonaSeleccionada, categoriaSeleccionada, busqueda, hoy]
  );

  const barriosFiltrados = useMemo(
    () =>
      BARRIOS_INFO.filter((barrio) => {
        const matchZona = zonaSeleccionada === 'Todas' || barrio.nombre === zonaSeleccionada;
        const q = busqueda.toLowerCase();
        const matchBusqueda =
          !busqueda ||
          [barrio.nombre, barrio.descripcion, barrio.historia, ...barrio.atracciones].some(
            (c) => c.toLowerCase().includes(q)
          );
        return matchZona && matchBusqueda;
      }),
    [zonaSeleccionada, busqueda]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blog de Granada</Text>
        <Text style={styles.headerSub}>Descubre barrios y eventos pasados</Text>

        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, mostrarBarrios && styles.toggleBtnActivo]}
            onPress={() => setMostrarBarrios(true)}
          >
            <Ionicons
              name="map"
              size={14}
              color={mostrarBarrios ? '#fff' : colors.textMuted}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.toggleText, mostrarBarrios && styles.toggleTextActivo]}>Barrios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !mostrarBarrios && styles.toggleBtnActivo]}
            onPress={() => setMostrarBarrios(false)}
          >
            <Ionicons
              name="time"
              size={14}
              color={!mostrarBarrios ? '#fff' : colors.textMuted}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.toggleText, !mostrarBarrios && styles.toggleTextActivo]}>Eventos Pasados</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar..."
            placeholderTextColor={colors.textMuted}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {!mostrarBarrios && (
          <>
            <Text style={styles.filterLabel}>Zona:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.zonaScroll}
              style={styles.zonaScrollContainer}
            >
              {ZONAS.map((zona) => (
                <TouchableOpacity
                  key={zona}
                  style={[styles.zonaBtn, zonaSeleccionada === zona && styles.zonaBtnActivo]}
                  onPress={() => setZonaSeleccionada(zona)}
                >
                  <Text style={[styles.zonaBtnText, zonaSeleccionada === zona && styles.zonaBtnTextActivo]}>
                    {zona}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.filterLabel}>Categoría:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.zonaScroll}
              style={styles.zonaScrollContainer}
            >
              {['Todas', 'Musica', 'Cultura', 'Mercado', 'Arte', 'Talleres', 'Gastronomia', 'Cine'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.zonaBtn, categoriaSeleccionada === cat && styles.zonaBtnActivo]}
                  onPress={() => setCategoriaSeleccionada(cat)}
                >
                  <Text style={[styles.zonaBtnText, categoriaSeleccionada === cat && styles.zonaBtnTextActivo]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </View>

      {mostrarBarrios ? (
        <FlatList
          style={styles.flatList}
          data={barriosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const abierto = expandido === item.id;
            return (
              <TouchableOpacity
                style={styles.barrioCard}
                activeOpacity={0.9}
                onPress={() => setExpandido(abierto ? null : item.id)}
              >
                {item.imagen ? (
                  <Image source={item.imagen} style={styles.barrioImage} resizeMode="cover" />
                ) : (
                  <View style={styles.barrioImagePlaceholder}>
                    <Ionicons name="map-outline" size={32} color={colors.textMuted} />
                  </View>
                )}
                <View style={styles.barrioContent}>
                  <View style={styles.barrioHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.barrioTitle}>{item.nombre}</Text>
                      <Text style={styles.barrioSubtitle}>{item.subtitulo}</Text>
                    </View>
                    <Ionicons
                      name={abierto ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={colors.textMuted}
                    />
                  </View>

                  <Text style={styles.barrioDesc}>{item.descripcion}</Text>

                  {abierto && (
                    <>
                      <View style={styles.divider} />
                      <Text style={styles.seccionLabel}>Historia</Text>
                      <Text style={styles.barrioHistoria}>{item.historia}</Text>

                      <Text style={styles.seccionLabel}>Qué ver y hacer</Text>
                      {item.atracciones.map((a, i) => (
                        <View key={i} style={styles.atraccionRow}>
                          <Ionicons name="checkmark-circle" size={14} color={colors.brand} />
                          <Text style={styles.atraccionText}>{a}</Text>
                        </View>
                      ))}

                      <View style={styles.consejoBox}>
                        <Ionicons name="bulb-outline" size={14} color='#ca8a04' />
                        <Text style={styles.consejoText}>{item.consejo}</Text>
                      </View>
                    </>
                  )}

                  <Text style={styles.verMas}>{abierto ? 'Ver menos' : 'Ver más'}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="map-outline" size={28} color={colors.brand} />
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptySubtitle}>Prueba a cambiar los filtros</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          style={styles.flatList}
          data={eventosRecientes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventoCard
              evento={item}
              onPress={(ev) => navigation.navigate('DetalleEvento', { evento: ev })}
            />
          )}
          ListHeaderComponent={() => (
            <Text style={styles.counter}>
              <Text style={{ color: colors.brand, fontWeight: '700' }}>{eventosRecientes.length}</Text>{' '}
              evento{eventosRecientes.length !== 1 ? 's' : ''} ya celebrado
              {eventosRecientes.length !== 1 ? 's' : ''}
            </Text>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="time-outline" size={28} color={colors.brand} />
              <Text style={styles.emptyTitle}>Sin eventos pasados</Text>
              <Text style={styles.emptySubtitle}>Los eventos celebrados aparecerán aquí</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
//STYLES

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  header: { backgroundColor: colors.bgCard, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: colors.textPrimary, marginBottom: 4 , marginTop: 18},
  headerSub: { fontSize: 14, color: colors.textMuted, marginBottom: 16 },
  toggleRow: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.bgPrimary,
  },
  toggleBtnActivo: { backgroundColor: colors.brand },
  toggleText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  toggleTextActivo: { color: '#fff' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgPrimary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary },
  filterLabel: { fontSize: 12, fontWeight: '700', color: colors.textMuted, marginBottom: 6, marginTop: 4 },
  zonaScroll: { paddingHorizontal: 0, gap: 6 },
  zonaScrollContainer: { marginBottom: 8 },
  zonaBtn: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  zonaBtnActivo: { backgroundColor: colors.brand, borderColor: colors.brand },
  zonaBtnText: { fontSize: 12, color: colors.textMuted },
  zonaBtnTextActivo: { color: '#fff' },
  flatList: { flex: 1 },
  listContent: { padding: 16 },
  barrioCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  barrioImage: { width: '100%', height: 160 },
  barrioImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barrioContent: { padding: 16 },
  barrioHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  barrioTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  barrioSubtitle: { fontSize: 11, color: colors.brand, fontWeight: '600', marginTop: 2 },
  barrioDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: 12 },
  seccionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  barrioHistoria: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: 14 },
  atraccionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  atraccionText: { fontSize: 13, color: colors.textSecondary, flex: 1 },
  consejoBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#fef9c3',
    borderRadius: radius.md,
    padding: 10,
    marginTop: 12,
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  consejoText: { fontSize: 12, color: '#713f12', flex: 1, lineHeight: 18 },
  verMas: { fontSize: 12, color: colors.brand, fontWeight: '700', marginTop: 10, textAlign: 'right' },
  counter: { fontSize: 14, color: colors.textMuted, marginBottom: 16, textAlign: 'center' },
  emptyContainer: { alignItems: 'center', paddingVertical: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 4, marginTop: 12 },
  emptySubtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
});
