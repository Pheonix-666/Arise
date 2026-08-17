import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SystemTheme } from '../../theme/SystemTheme';
import { Stat, STAT_COLORS, STAT_XP_PER_POINT } from '../../types';
import TerminalText from '../system/TerminalText';

interface Props {
  stat: Stat;
  level: number;
  currentXp: number;
}

export default function StatBar({ stat, level, currentXp }: Props) {
  const color = STAT_COLORS[stat];
  const progressPercent = Math.min(100, Math.max(0, (currentXp / STAT_XP_PER_POINT) * 100));

  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(`${progressPercent}%`, {
      damping: 15,
      stiffness: 100,
    }),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <TerminalText style={[styles.statName, { color }]} glow>
            {stat}
          </TerminalText>
          <Text style={styles.levelText}>Lv.{level}</Text>
        </View>
        <Text style={styles.xpText}>{Math.floor(currentXp)} / {STAT_XP_PER_POINT} XP</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { backgroundColor: color }, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  statName: {
    fontSize: 14,
    fontWeight: '700',
  },
  levelText: {
    fontFamily: SystemTheme.typography.stat.fontFamily,
    color: SystemTheme.colors.onBackground,
    fontSize: 12,
  },
  xpText: {
    fontFamily: SystemTheme.typography.body.fontFamily,
    color: SystemTheme.colors.onSurfaceVariant,
    fontSize: 10,
  },
  track: {
    height: 4,
    backgroundColor: SystemTheme.colors.primaryDim,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
});
