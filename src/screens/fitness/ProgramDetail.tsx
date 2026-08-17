import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import ScanlineBackground from '../../components/system/ScanlineBackground';
import SystemWindow from '../../components/system/SystemWindow';
import TerminalText from '../../components/system/TerminalText';
import SystemButton from '../../components/system/SystemButton';
import { SystemTheme } from '../../theme/SystemTheme';
import { wp, hp } from '../../utils/responsive';
import { PROGRAMS } from '../../data/programs';
import { EXERCISE_BY_ID } from '../../data/exercises';
import { useStore } from '../../store/useStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'ProgramDetail'>;

export default function ProgramDetail({ route, navigation }: Props) {
  const { programId } = route.params;
  const program = PROGRAMS.find(p => p.id === programId);
  const setActiveProgram = useStore(s => s.setActiveProgram);

  if (!program) return null;

  const handleStartProgram = () => {
    setActiveProgram(program.id);
    navigation.reset({
      index: 0,
      routes: [{ name: 'FitnessTabs', params: { screen: 'FitnessHome' } as any }],
    });
  };

  return (
    <View style={styles.root}>
      <ScanlineBackground />
      <SafeAreaView style={styles.safeArea}>
        

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <SystemWindow style={styles.headerCard}>
              <TerminalText style={styles.programName} glow>{program.name}</TerminalText>
              <Text style={styles.programDesc}>{program.description}</Text>
              
              <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>TIER</Text>
                  <Text style={styles.metaValue}>{program.tier}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>FREQUENCY</Text>
                  <Text style={styles.metaValue}>{program.daysPerWeek}x / week</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>FOCUS</Text>
                  <Text style={[styles.metaValue, { color: SystemTheme.colors.primary }]}>{program.primaryStats.join(', ')}</Text>
                </View>
              </View>

              <SystemButton 
                title="> SET AS ACTIVE PROTOCOL_" 
                onPress={handleStartProgram}
                style={styles.startBtn}
              />
            </SystemWindow>
          </Animated.View>

          <View style={styles.daysList}>
            <TerminalText style={styles.sectionTitle}>PROTOCOL SCHEDULE</TerminalText>
            
            {program.days.map((day, dIdx) => (
              <Animated.View key={dIdx} entering={FadeInDown.delay(150 + dIdx * 50).springify()}>
                <SystemWindow style={styles.dayCard}>
                  <TerminalText style={styles.dayName}>{day.name}</TerminalText>
                  
                  {day.isRestDay ? (
                    <Text style={styles.restText}>Active Recovery / Rest Day</Text>
                  ) : (
                    <View style={styles.exerciseList}>
                      {day.exercises.map((ex, eIdx) => {
                        const exerciseDef = EXERCISE_BY_ID[ex.exerciseId];
                        if (!exerciseDef) return null;
                        return (
                          <View key={eIdx} style={styles.exerciseRow}>
                            <Text style={styles.exBullet}>•</Text>
                            <View style={styles.exInfo}>
                              <Text style={styles.exName}>{exerciseDef.name}</Text>
                              <Text style={styles.exSetsReps}>{ex.sets} sets × {ex.reps}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </SystemWindow>
              </Animated.View>
            ))}
          </View>

        </ScrollView>
        {/* Bottom Header Bar */}
        <View style={styles.bottomHeaderBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <TerminalText style={styles.backBtn}>{'< PROGRAMS'}</TerminalText>
          </TouchableOpacity>
          <TerminalText style={styles.screenTitle} glow>[ PROTOCOL_DETAILS ]</TerminalText>
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
  programName: { fontSize: 20, color: SystemTheme.colors.primary, marginBottom: 12 },
  programDesc: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 14, color: SystemTheme.colors.onBackground, lineHeight: 22, marginBottom: 20 },
  
  metaGrid: { flexDirection: 'row', gap: 16, marginBottom: 24, paddingTop: 16, borderTopWidth: 1, borderColor: SystemTheme.colors.primaryDim },
  metaItem: { flex: 1 },
  metaLabel: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.onSurfaceVariant, marginBottom: 4 },
  metaValue: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 12, color: SystemTheme.colors.onBackground },
  
  startBtn: { width: '100%' },

  daysList: { gap: 16 },
  sectionTitle: { fontSize: 14, color: SystemTheme.colors.primary, marginBottom: 8 },
  
  dayCard: { padding: 16 },
  dayName: { fontSize: 14, color: SystemTheme.colors.onBackground, marginBottom: 12 },
  restText: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 12, color: SystemTheme.colors.onSurfaceVariant, fontStyle: 'italic' },
  
  exerciseList: { gap: 12 },
  exerciseRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  exBullet: { color: SystemTheme.colors.primary, fontSize: 16, lineHeight: 18 },
  exInfo: { flex: 1 },
  exName: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 14, color: SystemTheme.colors.onBackground, marginBottom: 2 },
  exSetsReps: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 12, color: SystemTheme.colors.onSurfaceVariant },
});
