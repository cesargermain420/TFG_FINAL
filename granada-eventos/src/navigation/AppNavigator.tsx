// AppNavigator define toda la navegación de la aplicación.
// Usamos un Tab Navigator (barra de pestañas inferior) como estructura principal.
// Las pantallas de detalle, login y crear evento están ocultas en la barra
// pero accesibles mediante navigation.navigate().
import React from 'react';
import { View, PanResponder } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../types/navigation';

import CrearEventoScreen from '../screens/CrearEventoScreen';
import DetalleEventoScreen from '../screens/DetalleEventoScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import HomeScreen from '../screens/HomeScreen';
import InfoScreen from '../screens/InfoScreen';
import LoginScreen from '../screens/LoginScreen';
import BlogScreen from '../screens/BlogScreen';
import ComerScreen from '../screens/ComerScreen';
import { colors } from '../theme';

// Creamos el Tab Navigator tipado con nuestras rutas definidas en RootStackParamList.
const Tab = createBottomTabNavigator<RootStackParamList>();

// Opciones para ocultar una pestaña de la barra inferior.
// tabBarButton: () => null hace que el botón no se renderice.
const HIDDEN: React.ComponentProps<typeof Tab.Screen>['options'] = {
  tabBarButton: () => null,
  tabBarItemStyle: { width: 0, flex: 0, overflow: 'hidden', padding: 0, margin: 0 },
};

// Pestañas que sí aparecen visibles en la barra, en el orden en que se muestran.
const VISIBLE_TABS: Array<keyof RootStackParamList> = ['Home', 'Blog', 'Favoritos', 'Comer', 'Info'];

// HOC (Higher Order Component) que envuelve cada pantalla visible añadiéndole
// detección de gestos de deslizamiento horizontal para cambiar de pestaña.
// Recibe el componente original y el nombre de su pestaña para saber la posición.
function withSwipeNavigation<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  tabName: keyof RootStackParamList,
) {
  return function SwipeableScreen(props: P) {
    const navigation = useNavigation();
    const currentIndex = VISIBLE_TABS.indexOf(tabName);

    // PanResponder detecta los gestos táctiles. Lo creamos con useRef para que
    // no se recree en cada render y evitar problemas de rendimiento.
    const panResponder = React.useRef(
      PanResponder.create({
        // Solo reclamamos el gesto si el movimiento es claramente horizontal
        // (más de 20px horizontales y el doble que los verticales).
        onMoveShouldSetPanResponder: (_, { dx, dy }) =>
          Math.abs(dx) > 20 && Math.abs(dx) > Math.abs(dy) * 2,

        onPanResponderRelease: (_, { dx }) => {
          // Deslizar izquierda → pestaña siguiente
          if (dx < -60 && currentIndex < VISIBLE_TABS.length - 1) {
            navigation.navigate(VISIBLE_TABS[currentIndex + 1] as never);
          }
          // Deslizar derecha → pestaña anterior
          else if (dx > 60 && currentIndex > 0) {
            navigation.navigate(VISIBLE_TABS[currentIndex - 1] as never);
          }
        },
      }),
    ).current;

    // Envuelve la pantalla original en un View que escucha los gestos.
    return (
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <WrappedComponent {...props} />
      </View>
    );
  };
}

// Componente principal de navegación que se monta en App.tsx.
// NavigationContainer es el contenedor raíz obligatorio de React Navigation.
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // ocultamos la cabecera por defecto, cada pantalla tiene la suya
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 82,
            paddingBottom: 12,
            paddingTop: 8,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
          },
          tabBarItemStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 2,
          },
          // Icono de cada pestaña: versión rellena cuando está activa, contorno cuando no.
          tabBarIcon: ({ focused, color }) => {
            let iconName: keyof typeof Ionicons.glyphMap;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Blog') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Favoritos') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Comer') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'Info') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            } else {
              iconName = 'ellipse';
            }
            return <Ionicons name={iconName} size={24} color={color} />;
          },
          tabBarActiveTintColor: colors.brand,     // azul cuando está seleccionada
          tabBarInactiveTintColor: colors.textMuted, // gris cuando no lo está
        })}
      >
        {/* PESTAÑAS VISIBLES — cada una envuelta con el HOC de deslizamiento */}
        <Tab.Screen name="Home"      component={withSwipeNavigation(HomeScreen,      'Home')}      options={{ tabBarLabel: 'Inicio' }} />
        <Tab.Screen name="Blog"      component={withSwipeNavigation(BlogScreen,      'Blog')}      options={{ tabBarLabel: 'Blog' }} />
        <Tab.Screen name="Favoritos" component={withSwipeNavigation(FavoritosScreen, 'Favoritos')} options={{ tabBarLabel: 'Favoritos' }} />
        <Tab.Screen name="Comer"     component={withSwipeNavigation(ComerScreen,     'Comer')}     options={{ tabBarLabel: 'Comer' }} />
        <Tab.Screen name="Info"      component={withSwipeNavigation(InfoScreen,      'Info')}      options={{ tabBarLabel: 'Ayuda' }} />

        {/* PANTALLAS SIN PESTAÑA — se navega a ellas con navigation.navigate() */}
        <Tab.Screen name="Login"         component={LoginScreen}         options={HIDDEN} />
        <Tab.Screen name="DetalleEvento" component={DetalleEventoScreen} options={HIDDEN} />
        <Tab.Screen name="CrearEvento"   component={CrearEventoScreen}   options={HIDDEN} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
