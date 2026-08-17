import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { SystemTheme } from '../../theme/SystemTheme';
import TerminalText from '../system/TerminalText';
import SystemButton from '../system/SystemButton';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  totalSeconds: number;
  onComplete: () => void;
  onSkip: () => void;
  onAddTimer: (sec: number) => void;
}

export default function RestTimer({ totalSeconds, onComplete, onSkip, onAddTimer }: Props) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const progress = useSharedValue(1);

  // Restart animation and timer when totalSeconds changes
  useEffect(() => {
    setTimeLeft(totalSeconds);
    progress.value = 1;
    progress.value = withTiming(0, { duration: totalSeconds * 1000, easing: Easing.linear });
  }, [totalSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const radius = 60;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerRing}>
        <Svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth} style={styles.svg}>
          {/* Background circle */}
          <Circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke={SystemTheme.colors.primaryDim}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke={SystemTheme.colors.primary}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
            fill="none"
            rotation="-90"
            origin={`${radius + strokeWidth / 2}, ${radius + strokeWidth / 2}`}
          />
        </Svg>
        <View style={styles.timeTextContainer}>
          <TerminalText style={styles.timeText} glow>{formatTime(timeLeft)}</TerminalText>
          <Text style={styles.restText}>REST</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.miniBtn} onPress={() => onAddTimer(30)}>
          <Text style={styles.miniBtnText}>+30s</Text>
        </TouchableOpacity>
        
        <SystemButton 
          title="> SKIP_" 
          onPress={onSkip} 
          style={styles.skipBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  timerRing: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  timeTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 28,
    fontWeight: '700',
    color: SystemTheme.colors.primary,
  },
  restText: {
    fontFamily: SystemTheme.typography.body.fontFamily,
    fontSize: 10,
    color: SystemTheme.colors.onSurfaceVariant,
    letterSpacing: 2,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  miniBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
    backgroundColor: 'rgba(0, 242, 255, 0.05)',
  },
  miniBtnText: {
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    color: SystemTheme.colors.primary,
    fontSize: 12,
  },
  skipBtn: {
    minWidth: 120,
  }
});
