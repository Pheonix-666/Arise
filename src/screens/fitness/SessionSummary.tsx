import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import ScanlineBackground from '../../components/system/ScanlineBackground';
import SystemWindow from '../../components/system/SystemWindow';
import TerminalText from '../../components/system/TerminalText';
import SystemButton from '../../components/system/SystemButton';
import { SystemTheme } from '../../theme/SystemTheme';
import { wp, hp } from '../../utils/responsive';
import { useStore } from '../../store/useStore';
import { EXERCISE_BY_ID } from '../../data/exercises';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'SessionSummary'>;

export default function SessionSummary({ route, navigation }: Props) {
  const { sessionId } = route.params;
  const store = useStore();
  const session = store.sessions.find(s => s.id === sessionId);

  if (!session) return null;

  return (
    <View style={styles.root}>
      <ScanlineBackground />
      <SafeAreaView style={styles.safeArea}>
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={ZoomIn.duration(800)}>
            <View style={styles.header}>
              <TerminalText style={styles.questCompleteTitle} glow>
                [ QUEST COMPLETE ]
              </TerminalText>
              <Text style={styles.subtitle}>Fitness Protocol Logged Successfully</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <SystemWindow style={styles.xpCard}>
              <TerminalText style={styles.cardTitle}>XP EARNED</TerminalText>
              
              <View style={styles.xpGrid}>
                {Object.entries(session.xpEarned).map(([stat, xp]) => (
                  <View key={stat} style={styles.xpRow}>
                    <Text style={[styles.statName, { color: SystemTheme.colors.primary }]}>{stat}</Text>
                    <Text style={styles.statXp}>+{xp}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.totalXpRow}>
                <Text style={styles.totalXpLabel}>TOTAL XP</Text>
                <TerminalText style={styles.totalXpValue} glow>+{session.totalXp}</TerminalText>
              </View>
            </SystemWindow>
          </Animated.View>

          {session.prsHit.length > 0 && (
            <Animated.View entering={FadeInDown.delay(800).springify()}>
              <SystemWindow style={styles.prCard}>
                <TerminalText style={[styles.cardTitle, { color: SystemTheme.colors.error }]} glow>
                  [ BOSS KILL: PERSONAL RECORDS ]
                </TerminalText>
                
                {session.prsHit.map(exId => {
                  const ex = EXERCISE_BY_ID[exId];
                  const pr = store.personalRecords[exId];
                  if (!ex || !pr) return null;
                  return (
                    <View key={exId} style={styles.prRow}>
                      <Text style={styles.prExName}>{ex.name}</Text>
                      <TerminalText style={styles.prScore} glow>{pr.bestWeight}kg × {pr.bestReps}</TerminalText>
                    </View>
                  );
                })}
              </SystemWindow>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(1200).springify()}>
            <SystemButton 
              title="> RETURN TO SYSTEM_" 
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'FitnessTabs', params: { screen: 'FitnessHome' } as any }] })}
              style={styles.doneBtn}
            />
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SystemTheme.colors.background },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: wp(5), paddingVertical: hp(4), gap: hp(3) },
  
  header: { alignItems: 'center', marginBottom: hp(2) },
  questCompleteTitle: { fontSize: 24, color: SystemTheme.colors.primary, letterSpacing: 2, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontFamily: SystemTheme.typography.body.fontFamily, color: SystemTheme.colors.onSurfaceVariant, fontSize: 14, textAlign: 'center' },
  
  xpCard: { padding: 24 },
  cardTitle: { fontSize: 16, color: SystemTheme.colors.primary, marginBottom: 20, textAlign: 'center' },
  
  xpGrid: { gap: 12, marginBottom: 20 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)', paddingBottom: 8 },
  statName: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 16 },
  statXp: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 16, color: SystemTheme.colors.onBackground },
  
  totalXpRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderColor: SystemTheme.colors.primaryDim },
  totalXpLabel: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 14, color: SystemTheme.colors.onSurfaceVariant },
  totalXpValue: { fontSize: 24, color: SystemTheme.colors.primary },

  prCard: { padding: 24, borderColor: SystemTheme.colors.error },
  prRow: { marginBottom: 12 },
  prExName: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 14, color: SystemTheme.colors.onBackground, marginBottom: 4 },
  prScore: { fontSize: 20, color: SystemTheme.colors.error },

  doneBtn: { marginTop: hp(2) },
});
