import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import EventoCard from '../components/EventoCard';
import { useApp } from '../context/AppContext';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Favoritos'>;

export default function FavoritosScreen({ navigation }: Props) {
  const { eventos, favoritos } = useApp();

  const eventosFavoritos = eventos.filter((ev) => favoritos.includes(ev.id));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Favoritos</Text>
        <Text style={styles.headerSub}>
          {eventosFavoritos.length > 0
            ? `${eventosFavoritos.length} evento${eventosFavoritos.length !== 1 ? 's' : ''} guardado${eventosFavoritos.length !== 1 ? 's' : ''}`
            : 'Guarda eventos para verlos aquí'}
        </Text>
      </View>

      <FlatList
        data={eventosFavoritos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventoCard
            evento={item}
            onPress={(ev) => navigation.navigate('DetalleEvento', { evento: ev })}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="heart-outline" size={32} color={colors.brand} />
            </View>
            <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
            <Text style={styles.emptySubtitle}>
              Pulsa el corazón en cualquier evento para guardarlo aquí
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: colors.textPrimary, marginBottom: 4, marginTop: 18 },
  headerSub: { fontSize: 14, color: colors.textMuted },
  listContent: { padding: 14, paddingBottom: 100, flexGrow: 1 },
  emptyContainer: { alignItems: 'center', paddingVertical: 80 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.azulPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 40 },
});
