export const SystemTheme = {
  colors: {
    background: '#030508',
    surface: '#0a0e14',
    primary: '#00f2ff', // Electric Cyan
    primaryDim: 'rgba(0, 242, 255, 0.15)',
    primaryGlow: 'rgba(0, 242, 255, 0.4)',
    secondary: '#8b5cf6', // Vivid Violet
    accent: '#ff0000', // Critical Red
    onBackground: '#e5e1e4',
    onSurfaceVariant: '#5a6b8c',
    error: '#ff0000',
  },
  typography: {
    rank: {
      fontFamily: 'Sora_800ExtraBold',
      letterSpacing: -1,
    },
    headline: {
      fontFamily: 'Sora_700Bold',
      letterSpacing: 0.5,
    },
    terminal: {
      fontFamily: 'JetBrainsMono_400Regular',
      letterSpacing: 1.2,
    },
    stat: {
      fontFamily: 'JetBrainsMono_700Bold',
      letterSpacing: 0.5,
    },
    body: {
      // Fallback for Geist until properly linked, or just use system sans
      fontFamily: 'System', 
      letterSpacing: 0,
    },
  },
  layout: {
    borderWidth: 1,
    cornerAccentSize: 4,
  },
};
