import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SystemTheme } from '../../theme/SystemTheme';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function SystemWindow({ children, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {/* Corner Accents */}
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />
      
      {children}
    </View>
  );
}

const CORNER_SIZE = 4;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(3, 8, 12, 0.85)',
    borderWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
    // Cyber-Brutalism requires 0px border radius
    borderRadius: 0,
    shadowColor: SystemTheme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden', // To keep children inside
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: SystemTheme.colors.primaryGlow,
    zIndex: 10,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 1,
    borderRightWidth: 1,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
});
