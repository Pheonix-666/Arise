import React from 'react';
import { TouchableOpacity, StyleSheet, Text, TouchableOpacityProps } from 'react-native';
import { SystemTheme } from '../../theme/SystemTheme';
import TerminalText from './TerminalText';

interface Props extends TouchableOpacityProps {
  title: string;
}

export default function SystemButton({ title, style, ...props }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.button, style]}
      {...props}
    >
      <TerminalText style={styles.text}>{title}</TerminalText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
    backgroundColor: 'rgba(0, 242, 255, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  text: {
    color: SystemTheme.colors.primary,
    fontSize: 14,
  },
});
