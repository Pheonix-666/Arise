import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { RootStackParamList } from '../../types';
import ScanlineBackground from '../../components/system/ScanlineBackground';
import SystemWindow from '../../components/system/SystemWindow';
import TerminalText from '../../components/system/TerminalText';
import { SystemTheme } from '../../theme/SystemTheme';
import { wp, hp } from '../../utils/responsive';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MonarchHome'>;
};

const LOCKED_FEATURES = [
  { label: 'Shadow Army', desc: 'Extract and command fallen warriors.' },
  { label: 'Monarch Stats', desc: 'Advanced stat progression tree.' },
  { label: 'Arise Protocol', desc: 'Activate your dormant power.' },
  { label: 'Extraction Log', desc: 'History of absorbed souls.' },
];

export default function MonarchHome({ navigation }: Props) {
  const pulseOpacity = useSharedValue(0.4);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    glowScale.value = withRepeat(
      withTiming(1.08, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <View style={styles.root}>
      <ScanlineBackground />

      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <TerminalText style={styles.backText}>← BACK</TerminalText>
          </TouchableOpacity>
          <TerminalText style={styles.headerLabel}>ACCESS RESTRICTED</TerminalText>
        </View>

        <View style={styles.centerArea}>

          {/* Pulsing Lock Emblem */}
          <Animated.View style={[styles.lockEmblem, glowStyle]}>
            <Animated.View style={[styles.lockRing, pulseStyle]} />
            <Text style={styles.lockIcon}>◆</Text>
          </Animated.View>

          {/* Rank text */}
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.rankBlock}>
            <Text style={styles.rankLabel}>SHADOW MONARCH</Text>
            <TerminalText style={styles.rankSub} glow>
              [ PREMIUM CLASS — LOCKED ]
            </TerminalText>
          </Animated.View>

          {/* Main panel */}
          <Animated.View entering={FadeInDown.delay(400).springify()} style={{ width: '100%' }}>
            <SystemWindow style={styles.window}>

              <TerminalText style={styles.windowTitle}>SYSTEM MESSAGE</TerminalText>

              <Text style={styles.windowBody}>
                The Shadow Monarch class grants access to exclusive progression systems
                beyond the reach of standard Hunters. Unlock this tier to command the void.
              </Text>

              <View style={styles.divider} />

              <Text style={styles.featuresLabel}>LOCKED FEATURES</Text>
              {LOCKED_FEATURES.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <TerminalText style={styles.featureLock}>🔒</TerminalText>
                  <View style={styles.featureInfo}>
                    <TerminalText style={styles.featureName}>{f.label}</TerminalText>
                    <Text style={styles.featureDesc}>{f.desc}</Text>
                  </View>
                </View>
              ))}

              <View style={styles.divider} />

              {/* CTA */}
              <TouchableOpacity style={styles.unlockBtn} activeOpacity={0.8}>
                <Animated.View style={pulseStyle}>
                  <TerminalText style={styles.unlockBtnText} glow>
                    ▸ UNLOCK PREMIUM ACCESS
                  </TerminalText>
                </Animated.View>
                <TerminalText style={styles.comingSoonText}>
                  [ COMING SOON ]
                </TerminalText>
              </TouchableOpacity>

            </SystemWindow>
          </Animated.View>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SystemTheme.colors.background },
  safeArea: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderColor: 'rgba(255,0,0,0.15)',
  },
  backBtn: { padding: 4 },
  backText: { color: SystemTheme.colors.onSurfaceVariant, fontSize: 12 },
  headerLabel: { color: SystemTheme.colors.error, fontSize: 11, letterSpacing: 2 },

  centerArea: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
    alignItems: 'center',
    gap: hp(3),
  },

  // Lock emblem
  lockEmblem: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  lockIcon: {
    color: '#ef4444',
    fontSize: 36,
    textShadowColor: 'rgba(239,68,68,0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  rankBlock: { alignItems: 'center', gap: 6 },
  rankLabel: {
    fontFamily: SystemTheme.typography.rank.fontFamily,
    color: '#ef4444',
    fontSize: 22,
    letterSpacing: 3,
    textShadowColor: 'rgba(239,68,68,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  rankSub: { color: SystemTheme.colors.onSurfaceVariant, fontSize: 11 },

  window: { padding: wp(5), width: '100%' },
  windowTitle: {
    color: SystemTheme.colors.primary,
    fontSize: 13,
    marginBottom: 12,
    letterSpacing: 2,
  },
  windowBody: {
    fontFamily: SystemTheme.typography.body.fontFamily,
    color: SystemTheme.colors.onSurfaceVariant,
    fontSize: 13,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: SystemTheme.colors.primaryDim,
    marginVertical: 16,
  },

  featuresLabel: {
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    color: SystemTheme.colors.onSurfaceVariant,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: 'rgba(239,68,68,0.1)',
  },
  featureLock: { fontSize: 14 },
  featureInfo: { gap: 2 },
  featureName: { color: SystemTheme.colors.onBackground, fontSize: 13, opacity: 0.6 },
  featureDesc: { fontFamily: SystemTheme.typography.body.fontFamily, color: SystemTheme.colors.onSurfaceVariant, fontSize: 11 },

  unlockBtn: {
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
    backgroundColor: 'rgba(239,68,68,0.05)',
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  unlockBtnText: {
    color: '#ef4444',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  comingSoonText: {
    color: SystemTheme.colors.onSurfaceVariant,
    fontSize: 10,
    letterSpacing: 2,
  },
});
