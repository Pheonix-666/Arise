import React from 'react';
import { Text, StyleSheet, TextProps, Platform } from 'react-native';
import { SystemTheme } from '../../theme/SystemTheme';

interface Props extends TextProps {
  children: React.ReactNode;
  glow?: boolean;
}

export default function TerminalText({ children, style, glow = false, ...props }: Props) {
  return (
    <Text 
      style={[
        styles.text, 
        glow && styles.glow,
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    color: SystemTheme.colors.onBackground,
    letterSpacing: SystemTheme.typography.terminal.letterSpacing,
  },
  glow: {
    ...Platform.select({
      web: {
        textShadow: '0 0 8px rgba(0, 219, 231, 0.4)',
      },
      default: {
        textShadowColor: SystemTheme.colors.primaryGlow,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
      },
    }),
  }
});
