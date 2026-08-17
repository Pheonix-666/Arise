import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SetLog } from '../../types';
import ScanlineBackground from '../../components/system/ScanlineBackground';
import SystemWindow from '../../components/system/SystemWindow';
import TerminalText from '../../components/system/TerminalText';
import { SystemTheme } from '../../theme/SystemTheme';
import { wp, hp } from '../../utils/responsive';
import { useStore } from '../../store/useStore';
import { EXERCISE_BY_ID } from '../../data/exercises';
import { PROGRAMS } from '../../data/programs';

type Props = NativeStackScreenProps<RootStackParamList, 'SessionDetail'>;

export default function SessionDetail({ route, navigation }: Props) {
  const { sessionId } = route.params;
  const store = useStore();
  const session = store.sessions.find(s => s.id === sessionId);

  if (!session) return null;

  const program = session.programId ? PROGRAMS.find(p => p.id === session.programId) : null;
  
  // Group sets by exercise
  const groupedSets: Record<string, SetLog[]> = {};
  session.sets.forEach(set => {
    if (!groupedSets[set.exerciseId]) {
      groupedSets[set.exerciseId] = [];
    }
    groupedSets[set.exerciseId].push(set);
  });

  return (
    <View style={styles.root}>
      <ScanlineBackground />
      <SafeAreaView style={styles.safeArea}>
        

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <SystemWindow style={styles.headerCard}>
            <Text style={styles.dateText}>{new Date(session.date).toLocaleString()}</Text>
            <Text style={styles.programText}>
              {program ? program.name : 'Custom Protocol'}
              {session.programDayName ? ` — ${session.programDayName}` : ''}
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.metaBadge}>
                <Text style={styles.metaLabel}>DURATION</Text>
                <TerminalText style={styles.metaVal}>{Math.floor(session.durationSeconds / 60)}m {session.durationSeconds % 60}s</TerminalText>
              </View>
              <View style={styles.metaBadge}>
                <Text style={styles.metaLabel}>TOTAL XP</Text>
                <TerminalText style={styles.metaVal}>+{session.totalXp}</TerminalText>
              </View>
            </View>

            {session.prsHit.length > 0 && (
              <View style={styles.prBox}>
                <TerminalText style={styles.prLabel} glow>BOSS KILLS CONFIRMED</TerminalText>
                {session.prsHit.map(id => (
                  <Text key={id} style={styles.prExName}>• {EXERCISE_BY_ID[id]?.name}</Text>
                ))}
              </View>
            )}
          </SystemWindow>

          <View style={styles.setLogsArea}>
            <TerminalText style={styles.sectionTitle}>EXECUTION RECORD</TerminalText>
            
            {Object.entries(groupedSets).map(([exId, sets]) => {
              const ex = EXERCISE_BY_ID[exId];
              if (!ex) return null;
              return (
                <SystemWindow key={exId} style={styles.exCard}>
                  <Text style={styles.exName}>{ex.name}</Text>
                  
                  <View style={styles.tableHeader}>
                    <Text style={[styles.colHead, { flex: 0.5 }]}>SET</Text>
                    <Text style={[styles.colHead, { flex: 1 }]}>KG</Text>
                    <Text style={[styles.colHead, { flex: 1 }]}>REPS</Text>
                  </View>

                  {sets.map((s, i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={[styles.cellText, { flex: 0.5 }]}>{i + 1}</Text>
                      <Text style={[styles.cellText, { flex: 1 }]}>{s.weight || '-'}</Text>
                      <Text style={[styles.cellText, { flex: 1 }]}>{s.reps || '-'}</Text>
                    </View>
                  ))}
                </SystemWindow>
              );
            })}
          </View>
          
        </ScrollView>
        {/* Bottom Header Bar */}
        <View style={styles.bottomHeaderBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <TerminalText style={styles.backBtn}>{'< HISTORY'}</TerminalText>
          </TouchableOpacity>
          <TerminalText style={styles.screenTitle} glow>[ LOG_DETAILS ]</TerminalText>
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
  
  scrollContent: { paddingHorizontal: wp(5), paddingVertical: hp(2), gap: hp(3) },
  
  headerCard: { padding: 20 },
  dateText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 12, color: SystemTheme.colors.onSurfaceVariant, marginBottom: 8 },
  programText: { fontFamily: SystemTheme.typography.headline.fontFamily, fontSize: 18, color: SystemTheme.colors.onBackground, marginBottom: 20 },
  
  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  metaBadge: { flex: 1, borderWidth: 1, borderColor: SystemTheme.colors.primaryDim, padding: 12, alignItems: 'center' },
  metaLabel: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.onSurfaceVariant, marginBottom: 4 },
  metaVal: { fontSize: 16, color: SystemTheme.colors.primary },
  
  prBox: { borderWidth: 1, borderColor: SystemTheme.colors.error, backgroundColor: 'rgba(255,0,0,0.05)', padding: 16 },
  prLabel: { fontSize: 12, color: SystemTheme.colors.error, marginBottom: 8 },
  prExName: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 12, color: SystemTheme.colors.onBackground, marginBottom: 4 },

  setLogsArea: { gap: 16 },
  sectionTitle: { fontSize: 14, color: SystemTheme.colors.primary, marginBottom: 8 },
  
  exCard: { padding: 16 },
  exName: { fontFamily: SystemTheme.typography.headline.fontFamily, fontSize: 16, color: SystemTheme.colors.primary, marginBottom: 16 },
  
  tableHeader: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderColor: SystemTheme.colors.primaryDim, marginBottom: 8 },
  colHead: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.onSurfaceVariant, textAlign: 'center' },
  
  tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cellText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 14, color: SystemTheme.colors.onBackground, textAlign: 'center' },
});
