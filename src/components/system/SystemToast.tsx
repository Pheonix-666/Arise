import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import SystemWindow from './SystemWindow';
import TerminalText from './TerminalText';
import { SystemTheme } from '../../theme/SystemTheme';
import { wp, hp } from '../../utils/responsive';

export interface SystemToastProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  duration?: number;
}

export default function SystemToast({
  message,
  visible,
  onDismiss,
  duration = 2500,
}: SystemToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        if (onDismiss) onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, message, duration, onDismiss]);

  if (!visible || !message) return null;

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(15)}
      exiting={FadeOutUp.duration(200)}
      style={styles.toastContainer}
      pointerEvents="none"
    >
      <SystemWindow style={styles.toastWindow}>
        <View style={styles.innerRow}>
          <TerminalText style={styles.toastPrefix} glow>
            ▸ SYSTEM FEED:
          </TerminalText>
          <TerminalText style={styles.toastMessage} glow>
            {message}
          </TerminalText>
        </View>
      </SystemWindow>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: hp(2),
    left: wp(5),
    right: wp(5),
    zIndex: 9999,
    alignItems: 'center',
  },
  toastWindow: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    backgroundColor: 'rgba(3, 8, 12, 0.95)',
    borderColor: SystemTheme.colors.primary,
    borderWidth: 1,
    shadowColor: SystemTheme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toastPrefix: {
    fontSize: 11,
    color: SystemTheme.colors.primary,
    fontWeight: '700',
  },
  toastMessage: {
    fontSize: 12,
    color: SystemTheme.colors.onBackground,
    flexShrink: 1,
  },
});
