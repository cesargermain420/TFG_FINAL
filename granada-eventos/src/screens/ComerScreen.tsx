import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { ZONAS_INFO } from '../data/bares';
import { colors, radius } from '../theme';
import type { Bar } from '../types/bar';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Comer'>;

const fotosPorBar: Record<string, string[]> = {};

const ZONA_IMAGENES: Record<string, ReturnType<typeof require>> = {
  Albaicin:   require('../../assets/bar1.jpg'),
  Centro:     require('../../assets/bar2.jpg'),
  Realejo:    require('../../assets/bar3.jpg'),
  Chana:      require('../../assets/bar4.jpg'),
  Zaidin:     require('../../assets/bar5.jpg'),
  Sacromonte: require('../../assets/bar6.jpg'),
  Beiro:      require('../../assets/bar7.jpg'),
  Norte:      require('../../assets/bar10.jpg'),
};

export default function ComerScreen(_props: Props) {
  const { toggleFavoritoBar, esFavoritoBar, bares } = useApp();
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>(null);
  const [barExpandido, setBarExpandido] = useState<string | null>(null);
  const [fotosBar, setFotosBar] = useState<Record<string, string[]>>(fotosPorBar);

  const boresDeZona = zonaSeleccionada
    ? bares.filter((b) => b.zona === zonaSeleccionada)
    : [];

  function abrirMapa(bar: Bar) {
    const query = encodeURIComponent(`${bar.nombre}, ${bar.direccion ?? bar.zona}, Granada`);
    const url =
      Platform.OS === 'ios'
        ? `maps://maps.apple.com/?q=${query}`
        : `https://maps.google.com/?q=${query}`;
    Linking.openURL(url);
  }

  async function añadirFoto(barId: string) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setFotosBar((prev) => ({
        ...prev,
        [barId]: [...(prev[barId] ?? []), result.assets[0].uri],
      }));
    }
  }

  function eliminarFoto(barId: string, index: number) {
    setFotosBar((prev) => ({
      ...prev,
      [barId]: (prev[barId] ?? []).filter((_, i) => i !== index),
    }));
  }

  if (zonaSeleccionada) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.subHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => { setZonaSeleccionada(null); setBarExpandido(null); }}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.subHeaderTitle}>{zonaSeleccionada}</Text>
            <Text style={styles.subHeaderSub}>
              {boresDeZona.length} {boresDeZona.length === 1 ? 'local' : 'locales'}
            </Text>
          </View>
        </View>

        {boresDeZona.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Sin locales aún</Text>
            <Text style={styles.emptySubtitle}>
              Edita <Text style={{ fontWeight: '700' }}>src/data/bares.ts</Text> para añadir bares de {zonaSeleccionada}
            </Text>
          </View>
        ) : (
          <FlatList
            data={boresDeZona}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const expandido = barExpandido === item.id;
              const favorito = esFavoritoBar(item.id);
              const fotos = fotosBar[item.id] ?? [];

              return (
                <View style={styles.barCard}>
                  {item.imagen ? (
                    <Image source={{ uri: item.imagen }} style={styles.barImage} resizeMode="cover" />
                  ) : (
                    <View style={styles.barImagePlaceholder}>
                      <Ionicons name="restaurant-outline" size={28} color={colors.textMuted} />
                    </View>
                  )}

                  <View style={styles.barContent}>
                    <View style={styles.barHeaderRow}>
                      <Text style={styles.barNombre}>{item.nombre}</Text>
                      <TouchableOpacity
                        style={[styles.favBtn, favorito && styles.favBtnActivo]}
                        onPress={() => toggleFavoritoBar(item.id)}
                      >
                        <Ionicons
                          name={favorito ? 'heart' : 'heart-outline'}
                          size={18}
                          color={favorito ? '#dc2626' : colors.textMuted}
                        />
                      </TouchableOpacity>
                    </View>

                    {item.descripcion ? (
                      <Text style={styles.barDesc}>{item.descripcion}</Text>
                    ) : null}

                    <View style={styles.barAcciones}>
                      <TouchableOpacity style={styles.accionBtn} onPress={() => abrirMapa(item)}>
                        <Ionicons name="navigate-outline" size={16} color={colors.brand} />
                        <Text style={styles.accionText}>Ver en Maps</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.accionBtn}
                        onPress={() => setBarExpandido(expandido ? null : item.id)}
                      >
                        <Ionicons name="chevron-down-outline" size={16} color={colors.brand} />
                        <Text style={styles.accionText}>{expandido ? 'Menos' : 'Más info'}</Text>
                      </TouchableOpacity>
                    </View>

                    {expandido && (
                      <View style={styles.expandido}>
                        {item.horarios ? (
                          <View style={styles.infoFila}>
                            <Ionicons name="time-outline" size={15} color={colors.textMuted} />
                            <Text style={styles.infoTexto}>{item.horarios}</Text>
                          </View>
                        ) : (
                          <View style={styles.infoFila}>
                            <Ionicons name="time-outline" size={15} color={colors.textMuted} />
                            <Text style={[styles.infoTexto, { color: colors.textMuted }]}>Horarios no disponibles</Text>
                          </View>
                        )}

                        {item.direccion ? (
                          <View style={styles.infoFila}>
                            <Ionicons name="location-outline" size={15} color={colors.textMuted} />
                            <Text style={styles.infoTexto}>{item.direccion}</Text>
                          </View>
                        ) : null}

                        {item.telefono ? (
                          <View style={styles.infoFila}>
                            <Ionicons name="call-outline" size={15} color={colors.textMuted} />
                            <Text style={styles.infoTexto}>{item.telefono}</Text>
                          </View>
                        ) : null}

                        <View style={styles.fotosSeccion}>
                          <Text style={styles.fotosLabel}>Fotos del local y platos</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fotosScroll}>
                            {fotos.map((uri, idx) => (
                              <TouchableOpacity
                                key={idx}
                                onLongPress={() =>
                                  Alert.alert('Eliminar foto', '¿Quieres eliminar esta foto?', [
                                    { text: 'Cancelar', style: 'cancel' },
                                    { text: 'Eliminar', style: 'destructive', onPress: () => eliminarFoto(item.id, idx) },
                                  ])
                                }
                              >
                                <Image source={{ uri }} style={styles.fotoThumb} resizeMode="cover" />
                              </TouchableOpacity>
                            ))}
                            <TouchableOpacity style={styles.addFotoBtn} onPress={() => añadirFoto(item.id)}>
                              <Ionicons name="camera-outline" size={22} color={colors.brand} />
                              <Text style={styles.addFotoText}>Añadir{'\n'}foto</Text>
                            </TouchableOpacity>
                          </ScrollView>
                          {fotos.length === 0 && (
                            <Text style={styles.sinFotosText}>Mantén pulsada una foto para eliminarla</Text>
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comer en Granada</Text>
        <Text style={styles.headerSub}>Bares y restaurantes por zonas</Text>
      </View>

      <FlatList
        data={ZONAS_INFO}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const numBares = bares.filter((b) => b.zona === item.id).length;
          return (
            <TouchableOpacity
              style={styles.zonaCard}
              activeOpacity={0.85}
              onPress={() => setZonaSeleccionada(item.id)}
            >
              {ZONA_IMAGENES[item.id] ? (
                <Image source={ZONA_IMAGENES[item.id]} style={styles.zonaImg} resizeMode="cover" />
              ) : (
                <View style={styles.zonaIconBox}>
                  <Ionicons name="restaurant" size={24} color={colors.brand} />
                </View>
              )}
              <View style={styles.zonaInfo}>
                <Text style={styles.zonaNombre}>{item.id}</Text>
                <Text style={styles.zonaDesc} numberOfLines={2}>{item.descripcion}</Text>
                <Text style={styles.zonaBadge}>
                  {numBares > 0 ? `${numBares} local${numBares !== 1 ? 'es' : ''}` : 'Próximamente'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },

  header: {
    backgroundColor: colors.bgCard,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: colors.textPrimary, marginBottom: 4, marginTop: 18 },
  headerSub: { fontSize: 14, color: colors.textMuted },

  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.bgCard,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginTop: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0e9dc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeaderTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  subHeaderSub: { fontSize: 12, color: colors.textMuted, marginTop: 1 },

  listContent: { padding: 16, paddingBottom: 32 },

  zonaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    gap: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  zonaImg: { width: 52, height: 52, borderRadius: radius.md },
  zonaIconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.azulSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zonaInfo: { flex: 1 },
  zonaNombre: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 3 },
  zonaDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginBottom: 5 },
  zonaBadge: { fontSize: 11, fontWeight: '700', color: colors.brand },

  barCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  barImage: { width: '100%', height: 140 },
  barImagePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barContent: { padding: 14 },
  barHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  barNombre: { flex: 1, fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  favBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favBtnActivo: { backgroundColor: '#fee2e2' },
  barDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 10 },

  barAcciones: { flexDirection: 'row', gap: 10 },
  accionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.azulSuave,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  accionText: { fontSize: 12, fontWeight: '600', color: colors.brand },

  expandido: { marginTop: 12 },
  infoFila: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  infoTexto: { fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 18 },

  fotosSeccion: { marginTop: 12 },
  fotosLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  fotosScroll: { marginBottom: 6 },
  fotoThumb: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    marginRight: 8,
    backgroundColor: colors.bgPrimary,
  },
  addFotoBtn: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.azulSuave,
    borderWidth: 1.5,
    borderColor: colors.azulBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  addFotoText: { fontSize: 10, color: colors.brand, textAlign: 'center', fontWeight: '600' },
  sinFotosText: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  emptySubtitle: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
});
