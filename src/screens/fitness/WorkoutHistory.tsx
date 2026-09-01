import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FitnessTabScreenProp } from '../../types';
import ScanlineBackground from '../../components/system/ScanlineBackground';
import SystemWindow from '../../components/system/SystemWindow';
import TerminalText from '../../components/system/TerminalText';
import { SystemTheme } from '../../theme/SystemTheme';
import { wp, hp } from '../../utils/responsive';
import { useStore } from '../../store/useStore';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PROGRAMS } from '../../data/programs';

type Props = {
  navigation: FitnessTabScreenProp<'WorkoutHistory'>;
};

export default function WorkoutHistory({ navigation }: Props) {
  const { sessions } = useStore();

  return (
    <View style={styles.root}>
      <ScanlineBackground />
      <SafeAreaView style={styles.safeArea}>
        

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerArea}>
            <TerminalText style={styles.trailHeaderTitle} glow>
              [ DUNGEON CLEAR TRAIL ]
            </TerminalText>
            <Text style={styles.headerDesc}>
              Trail of Cleared Gates. Each node represents a conquered dungeon level.
            </Text>
          </View>

          {sessions.length === 0 ? (
            <View style={styles.emptyState}>
              <TerminalText style={styles.emptyText}>NO GATES CLEARED YET.</TerminalText>
              <Text style={styles.emptySub}>Enter a gate and complete a protocol to forge your trail.</Text>
            </View>
          ) : (
            <View style={styles.trailContainer}>
              {sessions.map((session, index) => {
                const program = session.programId ? PROGRAMS.find(p => p.id === session.programId) : null;
                const gateTier = program ? program.tier : 'Goblin';
                const isLast = index === sessions.length - 1;

                return (
                  <View key={session.id} style={styles.trailNodeRow}>
                    {/* Vertical Connector Line & Node Dot */}
                    <View style={styles.nodeColumn}>
                      <View style={styles.nodeDot}>
                        <Text style={styles.nodeDotIcon}>◆</Text>
                      </View>
                      {!isLast && <View style={styles.verticalLine} />}
                    </View>

                    {/* Card Content */}
                    <Animated.View 
                      entering={FadeInDown.delay(index * 60).springify()}
                      style={{ flex: 1, marginBottom: 20 }}
                    >
                      <TouchableOpacity 
                        activeOpacity={0.7} 
                        onPress={() => navigation.navigate('SessionDetail', { sessionId: session.id })}
                      >
                        <SystemWindow style={styles.logCard}>
                          <View style={styles.logHeader}>
                            <View style={styles.gateBadge}>
                              <TerminalText style={styles.gateBadgeText} glow>
                                GATE #{sessions.length - index} [{gateTier.toUpperCase()}]
                              </TerminalText>
                            </View>

                            <View style={styles.xpBadge}>
                              <TerminalText style={styles.xpText}>+{session.totalXp} XP</TerminalText>
                            </View>
                          </View>
                          
                          <Text style={styles.programText}>
                            {program ? program.name : 'Custom Protocol'}
                            {session.programDayName ? ` — ${session.programDayName}` : ''}
                          </Text>

                          <View style={styles.logFooter}>
                            <Text style={styles.footerText}>{new Date(session.date).toLocaleDateString()}</Text>
                            <Text style={styles.footerText}>•</Text>
                            <Text style={styles.footerText}>
                              {Math.floor(session.durationSeconds / 60)} min
                            </Text>
                            <Text style={styles.footerText}>•</Text>
                            <Text style={styles.footerText}>
                              {session.sets.length} Sets
                            </Text>
                          </View>

                          {session.prsHit.length > 0 && (
                            <View style={styles.prIndicators}>
                              <Text style={styles.prStar}>★</Text>
                              <Text style={styles.prCountText}>{session.prsHit.length} PRs / Bosses Slain</Text>
                            </View>
                          )}
                        </SystemWindow>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                );
              })}
            </View>
          )}
          
        </ScrollView>
        {/* Bottom Header Bar */}
        <View style={styles.bottomHeaderBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <TerminalText style={styles.backBtn}>{'< FITNESS'}</TerminalText>
          </TouchableOpacity>
          <TerminalText style={styles.screenTitle} glow>[ DUNGEON TRAIL ]</TerminalText>
          <View style={{ width: 60 }} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SystemTheme.colors.background },
  safeArea: { flex: 1 },
  bottomHeaderBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: wp(5), paddingVertical: hp(1.5),
    borderTopWidth: 1, borderColor: SystemTheme.colors.primaryDim,
  },
  backBtn: { color: SystemTheme.colors.onSurfaceVariant, fontSize: 12 },
  screenTitle: { color: SystemTheme.colors.primary, fontSize: 14 },
  
  scrollContent: { paddingHorizontal: wp(5), paddingVertical: hp(2), gap: hp(2) },
  
  headerArea: { paddingVertical: 10, marginBottom: 10, alignItems: 'center' },
  trailHeaderTitle: { fontSize: 13, color: SystemTheme.colors.primary, marginBottom: 6, letterSpacing: 1 },
  headerDesc: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 13, color: SystemTheme.colors.onSurfaceVariant, textAlign: 'center', lineHeight: 18 },
  
  emptyState: { paddingVertical: hp(10), alignItems: 'center' },
  emptyText: { color: SystemTheme.colors.onSurfaceVariant, fontSize: 14, marginBottom: 12 },
  emptySub: { fontFamily: SystemTheme.typography.body.fontFamily, color: SystemTheme.colors.onSurfaceVariant, fontSize: 12, textAlign: 'center' },

  trailContainer: {
    paddingLeft: 4,
  },
  trailNodeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  nodeColumn: {
    alignItems: 'center',
    width: 24,
  },
  nodeDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SystemTheme.colors.primary,
    backgroundColor: 'rgba(0, 242, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeDotIcon: {
    color: SystemTheme.colors.primary,
    fontSize: 10,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: SystemTheme.colors.primaryDim,
    marginVertical: 4,
    minHeight: 40,
  },

  logCard: { padding: 16 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  gateBadge: { backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: SystemTheme.colors.primaryDim },
  gateBadgeText: { fontSize: 10, color: SystemTheme.colors.primary },
  xpBadge: { backgroundColor: 'rgba(0,242,255,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: SystemTheme.colors.primaryDim },
  xpText: { fontSize: 12, color: SystemTheme.colors.primary },
  
  programText: { fontFamily: SystemTheme.typography.headline.fontFamily, fontSize: 16, color: SystemTheme.colors.onBackground, marginBottom: 16 },
  
  logFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  footerText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.onSurfaceVariant },
  
  prIndicators: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: SystemTheme.colors.primaryDim },
  prStar: { color: SystemTheme.colors.error, fontSize: 10 },
  prCountText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.error },
});

