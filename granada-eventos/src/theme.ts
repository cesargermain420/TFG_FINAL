export const colors = {
  bgPrimary: '#f0ede8',
  bgCard: '#ffffff',
  bgDark: '#0d3b7a',
  bgDarkMid: '#1a5dad',
  brand: '#2563eb',
  brandDark: '#0d3b7a',
  verde: '#16a34a',
  verdeOscuro: '#14532d',
  verdePale: '#dcfce7',
  verdeBorder: '#86efac',
  azulPale: '#dbeafe',
  azulBorder: '#93c5fd',
  azulSuave: '#eff6ff',
  textPrimary: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',
  textLight: 'rgba(255,255,255,0.65)',
  border: '#cbd5e1',
  borderInput: '#94a3b8',
  borderLight: '#e2e8f0',
  success: '#14532d',
  successBg: '#dcfce7',
  successBorder: '#86efac',
  warning: '#7c2d12',
  warningBg: '#fff7ed',
  warningBorder: '#fdba74',
  error: '#991b1b',
  errorBg: '#fee2e2',
  adminBg: '#eff6ff',
  adminBorder: '#2563eb',
  adminText: '#1e40af',
  adminDot: '#2563eb',
} as const; 

//PALETA COLORES PARA APP

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const shadow = {
  card: {
    shadowColor: '#0d3b7a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  fab: {
    shadowColor: '#0d3b7a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
} as const;
