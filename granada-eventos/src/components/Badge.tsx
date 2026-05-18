// Componente Badge: muestra la categoría de un evento como una etiqueta de colores.
// El color de fondo y texto se saca de CATEGORIA_COLORES según la categoría recibida.
// Se usa en EventoCard y en DetalleEventoScreen.
import { StyleSheet, Text, View } from 'react-native';
import { CATEGORIA_COLORES } from '../data/eventos';

// Props del componente: solo necesita saber la categoría del evento.
interface BadgeProps {
  categoria: string;
}

export default function Badge({ categoria }: BadgeProps) {
  // Si la categoría no existe en el mapa de colores usamos un gris por defecto.
  const estilo = CATEGORIA_COLORES[categoria] || { bg: '#f3f4f6', text: '#374151' };

  return (
    <View style={[styles.badge, { backgroundColor: estilo.bg }]}>
      <Text style={[styles.texto, { color: estilo.text }]}>{categoria.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
  texto: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
});
