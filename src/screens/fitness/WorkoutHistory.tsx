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
            <Text style={styles.headerDesc}>
              Past protocol execution logs. Consistency is the only path to leveling up.
            </Text>
          </View>

          {sessions.length === 0 ? (
            <View style={styles.emptyState}>
              <TerminalText style={styles.emptyText}>NO SESSION DATA FOUND.</TerminalText>
              <Text style={styles.emptySub}>Initialize a protocol to begin logging.</Text>
            </View>
          ) : (
            sessions.map((session, index) => {
              const program = session.programId ? PROGRAMS.find(p => p.id === session.programId) : null;
              
              return (
                <Animated.View key={session.id} entering={FadeInDown.delay(index * 50).springify()}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('SessionDetail', { sessionId: session.id })}>
                    <SystemWindow style={styles.logCard}>
                      <View style={styles.logHeader}>
                        <Text style={styles.dateText}>{new Date(session.date).toLocaleDateString()}</Text>
                        <View style={styles.xpBadge}>
                          <TerminalText style={styles.xpText}>+{session.totalXp} XP</TerminalText>
                        </View>
                      </View>
                      
                      <Text style={styles.programText}>
                        {program ? program.name : 'Custom Protocol'}
                        {session.programDayName ? ` — ${session.programDayName}` : ''}
                      </Text>

                      <View style={styles.logFooter}>
                        <Text style={styles.footerText}>
                          {Math.floor(session.durationSeconds / 60)} min
                        </Text>
                        <Text style={styles.footerText}>•</Text>
                        <Text style={styles.footerText}>
                          {new Set(session.sets.map(s => s.exerciseId)).size} Exercises
                        </Text>
                        <Text style={styles.footerText}>•</Text>
                        <Text style={styles.footerText}>
                          {session.sets.length} Sets
                        </Text>
                      </View>

                      {session.prsHit.length > 0 && (
                        <View style={styles.prIndicators}>
                          <Text style={styles.prStar}>★</Text>
                          <Text style={styles.prCountText}>{session.prsHit.length} PRs Hit</Text>
                        </View>
                      )}
                    </SystemWindow>
                  </TouchableOpacity>
                </Animated.View>
              );
            })
          )}
          
        </ScrollView>
        {/* Bottom Header Bar */}
        <View style={styles.bottomHeaderBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <TerminalText style={styles.backBtn}>{'< FITNESS'}</TerminalText>
          </TouchableOpacity>
          <TerminalText style={styles.screenTitle} glow>[ SESSION LOGS ]</TerminalText>
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
  
  headerArea: { paddingVertical: 10, marginBottom: 10 },
  headerDesc: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 14, color: SystemTheme.colors.onSurfaceVariant, textAlign: 'center', lineHeight: 20 },
  
  emptyState: { paddingVertical: hp(10), alignItems: 'center' },
  emptyText: { color: SystemTheme.colors.onSurfaceVariant, fontSize: 14, marginBottom: 12 },
  emptySub: { fontFamily: SystemTheme.typography.body.fontFamily, color: SystemTheme.colors.onSurfaceVariant, fontSize: 12, textAlign: 'center' },

  logCard: { padding: 16 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dateText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 14, color: SystemTheme.colors.onBackground },
  xpBadge: { backgroundColor: 'rgba(0,242,255,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: SystemTheme.colors.primaryDim },
  xpText: { fontSize: 12, color: SystemTheme.colors.primary },
  
  programText: { fontFamily: SystemTheme.typography.headline.fontFamily, fontSize: 16, color: SystemTheme.colors.onBackground, marginBottom: 16 },
  
  logFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  footerText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.onSurfaceVariant },
  
  prIndicators: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: SystemTheme.colors.primaryDim },
  prStar: { color: SystemTheme.colors.error, fontSize: 10 },
  prCountText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.error },
});
