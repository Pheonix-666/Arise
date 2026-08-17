import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import ScanlineBackground from '../components/system/ScanlineBackground';
import SystemWindow from '../components/system/SystemWindow';
import TerminalText from '../components/system/TerminalText';
import { SystemTheme } from '../theme/SystemTheme';
import { wp, hp } from '../utils/responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ModeSelect'>;
};

import { Alert } from 'react-native';

const MODES = [
  {
    id: 'fitness',
    title: '[ PROTOCOL: FITNESS ]',
    subtitle: 'Physical Conditioning Module',
    route: 'FitnessTabs' as const,
    accent: SystemTheme.colors.primary,
  },
  {
    id: 'task',
    title: '[ PROTOCOL: TASKS ]',
    subtitle: 'Daily Quest Operations',
    route: 'TaskHome' as const,
    accent: SystemTheme.colors.secondary,
  },
  {
    id: 'competition',
    title: '[ PVP: COMPETITION ]',
    subtitle: 'Multiplayer Arena (In Dev)',
    route: null,
    accent: '#fbbf24',
    isLocked: false,
  },
  {
    id: 'monarch',
    title: '[ SHADOW MONARCH ]',
    subtitle: 'Status & Extraction',
    route: 'MonarchHome' as const,
    accent: SystemTheme.colors.error,
    isLocked: false,
  },
];

export default function ModeSelect({ navigation }: Props) {
  const handleModePress = (mode: typeof MODES[number]) => {
    if (mode.isLocked) {
      Alert.alert('SYSTEM MESSAGE', 'This feature is currently under development and requires PREMIUM access.');
      return;
    }
    if (mode.route) {
      navigation.navigate(mode.route as any);
    }
  };

  return (
    <View style={styles.root}>
      <ScanlineBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <SystemWindow style={styles.window}>
              
              <View style={styles.header}>
                <Text style={styles.headline}>SYSTEM.INITIALIZED</Text>
                <TerminalText style={styles.subHeader}>
                  Awaiting User Input_
                </TerminalText>
              </View>

              <View style={styles.modeList}>
                {MODES.map((mode, index) => (
                  <TouchableOpacity
                    key={mode.id}
                    activeOpacity={0.7}
                    style={[styles.modeBtn, mode.isLocked && styles.modeBtnLocked]}
                    onPress={() => handleModePress(mode)}
                  >
                    <View style={styles.modeBtnInner}>
                      <TerminalText 
                        style={[styles.modeTitle, { color: mode.accent }, mode.isLocked && { opacity: 0.6 }]} 
                        glow={!mode.isLocked}
                      >
                        {mode.title}
                      </TerminalText>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.modeSubtitle, mode.isLocked && { opacity: 0.5 }]}>
                          {mode.subtitle}
                        </Text>
                        {mode.isLocked && (
                          <View style={styles.premiumBadge}>
                            <Text style={styles.premiumText}>PREMIUM</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <TerminalText style={[styles.arrow, { color: mode.accent }, mode.isLocked && { opacity: 0.6 }]} glow={!mode.isLocked}>
                      {mode.isLocked ? '🔒' : '›'}
                    </TerminalText>
                  </TouchableOpacity>
                ))}
              </View>
              
            </SystemWindow>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SystemTheme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(6),
  },
  window: {
    padding: hp(3),
    backgroundColor: 'rgba(3, 8, 12, 0.90)',
  },
  header: {
    borderBottomWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
    paddingBottom: hp(2),
    marginBottom: hp(3),
    alignItems: 'center',
  },
  headline: {
    fontFamily: SystemTheme.typography.rank.fontFamily,
    fontSize: 24,
    color: SystemTheme.colors.primary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  subHeader: {
    color: SystemTheme.colors.onSurfaceVariant,
    fontSize: 12,
  },
  modeList: {
    gap: hp(2),
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: hp(2),
    borderWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
    backgroundColor: 'rgba(0, 242, 255, 0.02)',
  },
  modeBtnLocked: {
    borderColor: 'rgba(251, 191, 36, 0.2)',
    backgroundColor: 'rgba(251, 191, 36, 0.02)',
  },
  modeBtnInner: {
    gap: 4,
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  modeSubtitle: {
    fontFamily: SystemTheme.typography.body.fontFamily,
    color: SystemTheme.colors.onSurfaceVariant,
    fontSize: 12,
  },
  premiumBadge: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  premiumText: {
    color: '#000',
    fontSize: 8,
    fontFamily: SystemTheme.typography.stat.fontFamily,
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 20,
  }
});
