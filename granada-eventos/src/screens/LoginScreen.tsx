// Pantalla de inicio de sesión del panel de administración.
// El usuario introduce sus credenciales y la app las envía a la API.
// Si son correctas, el servidor devuelve un token JWT que se guarda en
// AsyncStorage y activa el modo admin en toda la aplicación.
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  // login y loginError vienen del contexto global; login llama a la API.
  const { login, loginError, setLoginError } = useApp();

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  // mostrarPass alterna entre ocultar y mostrar la contraseña.
  const [mostrarPass, setMostrarPass] = useState(false);

  // Valida que los campos no estén vacíos y llama al login del contexto.
  // Si tiene éxito, vuelve a la pantalla anterior (Home).
  async function handleLogin() {
    if (!usuario.trim() || !password.trim()) {
      Alert.alert('Campos vacios', 'Por favor, rellena usuario y contraseña.');
      return;
    }
    const ok = await login(usuario.trim(), password);
    if (ok) {
      navigation.goBack();
    }
    // Si falla, loginError se actualiza en el contexto y se muestra el mensaje de error.
  }

  return (
    // KeyboardAvoidingView sube el formulario para que el teclado no lo tape.
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* keyboardShouldPersistTaps="handled" permite pulsar botones sin cerrar el teclado antes */}
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Logo y nombre de la app */}
        <View style={styles.logoArea}>
          <View style={styles.logoBox}>
            <Ionicons name="star" size={30} color="#fff" />
          </View>
          <Text style={styles.appName}>Granada Eventos</Text>
          <Text style={styles.subtitle}>Panel de administracion</Text>
        </View>

        {/* Formulario de login */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Iniciar sesion</Text>

          {/* Campo usuario */}
          <View style={styles.campo}>
            <Text style={styles.label}>USUARIO</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={16}
                color={colors.textMuted}
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.input}
                value={usuario}
                onChangeText={(t) => {
                  setUsuario(t);
                  setLoginError(''); // limpia el error al empezar a escribir
                }}
                placeholder="Nombre de usuario"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Campo contraseña con toggle para mostrar/ocultar */}
          <View style={styles.campo}>
            <Text style={styles.label}>CONTRASENA</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color={colors.textMuted}
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setLoginError('');
                }}
                placeholder="........"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!mostrarPass}
                autoCapitalize="none"
                onSubmitEditing={handleLogin} // permite enviar con el botón del teclado
              />
              <TouchableOpacity onPress={() => setMostrarPass((v) => !v)}>
                <Ionicons
                  name={mostrarPass ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Mensaje de error que aparece si el login falla (credenciales incorrectas) */}
          {Boolean(loginError) && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
              <Text style={styles.errorText}>{loginError}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
            <Text style={styles.btnLoginText}>Iniciar sesion</Text>
          </TouchableOpacity>

          {/* Volver a la app sin autenticarse como visitante */}
          <TouchableOpacity style={styles.btnVolver} onPress={() => navigation.goBack()}>
            <Text style={styles.btnVolverText}>Volver como visitante</Text>
          </TouchableOpacity>

          {/* Cuadro informativo con las credenciales de prueba para la demo */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Credenciales de demo</Text>
            <Text style={styles.demoText}>Usuario: admin  -  Contrasena: granada2025</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bgDark },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logoArea: { alignItems: 'center', marginBottom: 32 },
  logoBox: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  appName: { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.3 },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4, letterSpacing: 1 },
  form: { backgroundColor: '#fff', borderRadius: radius.xl, padding: 24, width: '100%', maxWidth: 380 },
  formTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 20 },
  campo: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: colors.brand, letterSpacing: 0.6, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgPrimary,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  input: { flex: 1, paddingVertical: 11, fontSize: 14, color: colors.textPrimary },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.errorBg,
    borderRadius: radius.sm,
    padding: 10,
    marginBottom: 14,
  },
  errorText: { fontSize: 13, color: colors.error, fontWeight: '500', flex: 1 },
  btnLogin: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnLoginText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  btnVolver: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 11,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnVolverText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  demoBox: { backgroundColor: colors.azulSuave, borderRadius: radius.sm, padding: 12 },
  demoTitle: { fontSize: 12, fontWeight: '700', color: colors.brandDark, marginBottom: 4 },
  demoText: { fontSize: 12, color: colors.brandDark, lineHeight: 18 },
});
