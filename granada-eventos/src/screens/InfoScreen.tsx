import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '../theme';
import { useState } from 'react';

//PESTAÑA CON LA INFO 
//MODIFICAR NUMEROS EN LABEL

interface Seccion {
  id: string;
  titulo: string;
  icono: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  items: { label: string; valor: string }[];
}

const SECCIONES: Seccion[] = [
  {
    id: 'emergencias',
    titulo: 'Emergencias',
    icono: 'alert-circle',
    color: '#dc2626',
    items: [
      { label: 'Emergencias generales', valor: '112' },
      { label: 'Policía Nacional', valor: '091' },
      { label: 'Policía Local Granada', valor: '092' },
      { label: 'Guardia Civil', valor: '062' },
      { label: 'Bomberos', valor: '080' },
      { label: 'Cruz Roja', valor: '902 22 22 92' },
    ],
  },
  {
    id: 'turismo',
    titulo: 'Turismo y Monumentos',
    icono: 'camera',
    color: '#7c3aed',
    items: [
      { label: 'Oficina de Turismo', valor: 'C/ Cárcel Baja, 3 · 958 24 71 28' },
      { label: 'Alhambra (entradas)', valor: 'www.alhambra.org · 958 02 79 71' },
      { label: 'Catedral de Granada', valor: 'C/ Gran Vía, 5 · 958 22 29 59' },
      { label: 'Capilla Real', valor: 'C/ Oficios, s/n · 958 22 78 48' },
      { label: 'Museo de la Alhambra', valor: 'Palacio de Carlos V · Entrada libre' },
      { label: 'Parque de las Ciencias', valor: 'Av. de la Ciencia, s/n · 958 13 19 00' },
    ],
  },
  {
    id: 'transporte',
    titulo: 'Transporte',
    icono: 'bus',
    color: '#0284c7',
    items: [
      { label: 'LAC (bus urbano)', valor: 'Líneas por toda la ciudad · 0,90€' },
      { label: 'Bus al aeropuerto', valor: 'Línea 245 · Cada hora desde Gran Vía' },
      { label: 'Estación de tren (RENFE)', valor: 'Av. Andaluces, s/n · 912 32 03 20' },
      { label: 'Estación de autobuses', valor: 'C/ Juan Pablo II, 25 · 958 18 54 80' },
      { label: 'Taxi Granada', valor: '958 28 06 54 / 958 13 23 23' },
      { label: 'Bicing (bicicletas)', valor: 'App GraBici · Red de carriles bici' },
    ],
  },
  {
    id: 'alojamiento',
    titulo: 'Información Práctica',
    icono: 'information-circle',
    color: '#16a34a',
    items: [
      { label: 'Mejor época para visitar', valor: 'Primavera (abr-jun) y otoño (sep-oct)' },
      { label: 'Clima en verano', valor: 'Hasta 40°C · Lleva agua y protección solar' },
      { label: 'Tapas gratuitas', valor: 'Con cada bebida en bares tradicionales' },
      { label: 'Compras', valor: 'Alcaicería, C/ Reyes Católicos, Centro Comercial Neptuno' },
      { label: 'Idioma', valor: 'Español · Inglés en zonas turísticas' },
      { label: 'Moneda', valor: 'Euro (€)' },
    ],
  },
  {
    id: 'salud',
    titulo: 'Salud',
    icono: 'medical',
    color: '#ea580c',
    items: [
      { label: 'Hospital Universitario San Cecilio', valor: 'Av. del Conocimiento, s/n · 958 02 30 00' },
      { label: 'Hospital Virgen de las Nieves', valor: 'Av. de las Fuerzas Armadas, 2 · 958 02 00 00' },
      { label: 'Urgencias de guardia', valor: 'Centro de Salud Zaidín · 958 02 40 00' },
      { label: 'Farmacia de guardia', valor: 'Busca en www.cofgranada.com' },
    ],
  },
];

export default function InfoScreen() {
  const [abierto, setAbierto] = useState<string | null>('emergencias');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guía Práctica</Text>
        <Text style={styles.headerSub}>Todo lo que necesitas para tu visita a Granada</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {SECCIONES.map((seccion) => {
          const isOpen = abierto === seccion.id;
          return (
            <View key={seccion.id} style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => setAbierto(isOpen ? null : seccion.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconBadge, { backgroundColor: seccion.color + '20' }]}>
                  <Ionicons name={seccion.icono} size={20} color={seccion.color} />
                </View>
                <Text style={styles.cardTitle}>{seccion.titulo}</Text>
                <Ionicons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.cardBody}>
                  {seccion.items.map((item, i) => (
                    <View key={i} style={[styles.infoRow, i < seccion.items.length - 1 && styles.infoRowBorder]}>
                      <Text style={styles.infoLabel}>{item.label}</Text>
                      <Text style={[styles.infoValor, { color: seccion.color }]}>{item.valor}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.footer}>
          <Ionicons name="heart" size={14} color={colors.brand} />
          <Text style={styles.footerText}>Hecho con cariño para disfrutar Granada</Text>
        </View>
      </ScrollView>
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
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardBody: { paddingHorizontal: 16, paddingBottom: 12 },
  infoRow: { paddingVertical: 10 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  infoLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 3 },
  infoValor: { fontSize: 13, fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 20,
  },
  footerText: { fontSize: 13, color: colors.textMuted },
});
