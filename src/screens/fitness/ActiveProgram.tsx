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
import { useStore } from '../../store/useStore';
import { PROGRAMS } from '../../data/programs';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveProgram'>;

export default function ActiveProgram({ navigation }: Props) {
  const store = useStore();
  const { fitnessProfile } = store;
  const program = fitnessProfile.activeProgramId ? PROGRAMS.find(p => p.id === fitnessProfile.activeProgramId) : null;

  if (!program) {
    return (
      <View style={styles.root}>
        <ScanlineBackground />
        <SafeAreaView style={styles.safeArea}>

          <View style={styles.emptyState}>
            <TerminalText style={{ color: SystemTheme.colors.onSurfaceVariant }}>NO ACTIVE PROTOCOL.</TerminalText>
          </View>
          <View style={styles.bottomHeaderBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <TerminalText style={styles.backBtn}>{'< FITNESS'}</TerminalText>
            </TouchableOpacity>
            <TerminalText style={styles.screenTitle} glow>[ ACTIVE PROTOCOL ]</TerminalText>
            <View style={{ width: 60 }} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScanlineBackground />
      <SafeAreaView style={styles.safeArea}>
        

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.springify()}>
            <SystemWindow style={styles.headerCard}>
              <TerminalText style={styles.programName} glow>{program.name}</TerminalText>
              <Text style={styles.weekText}>WEEK {fitnessProfile.currentProgramWeek}</Text>
            </SystemWindow>
          </Animated.View>

          <View style={styles.daysList}>
            {program.days.map((day, index) => {
              const isToday = index === fitnessProfile.currentProgramDayIndex;
              const isPast = index < fitnessProfile.currentProgramDayIndex;
              
              return (
                <Animated.View key={index} entering={FadeInDown.delay(index * 50).springify()}>
                  <SystemWindow style={[
                    styles.dayCard, 
                    isToday && styles.dayCardToday,
                    isPast && styles.dayCardPast
                  ]}>
                    <View style={styles.dayHeader}>
                      <TerminalText style={[
                        styles.dayName,
                        isToday && { color: SystemTheme.colors.primary },
                        isPast && { color: SystemTheme.colors.onSurfaceVariant }
                      ]}>{day.name}</TerminalText>
                      {isPast && <Text style={styles.statusText}>COMPLETED</Text>}
                      {isToday && <Text style={[styles.statusText, { color: SystemTheme.colors.primary }]}>TODAY</Text>}
                    </View>

                    {day.isRestDay ? (
                      <Text style={[styles.restText, isPast && { color: SystemTheme.colors.onSurfaceVariant }]}>Rest Day</Text>
                    ) : (
                      <Text style={[styles.exCount, isPast && { color: SystemTheme.colors.onSurfaceVariant }]}>{day.exercises.length} Exercises</Text>
                    )}

                    {isToday && (
                      <SystemButton 
                        title={day.isRestDay ? "> SKIP REST DAY_" : "> START PROTOCOL_"} 
                        onPress={() => {
                          if (day.isRestDay) {
                            store.advanceProgramDay();
                          } else {
                            navigation.navigate('WorkoutSession', { programId: program.id, dayIndex: index });
                          }
                        }}
                        style={styles.startBtn}
                      />
                    )}
                  </SystemWindow>
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.bottomHeaderBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <TerminalText style={styles.backBtn}>{'< FITNESS'}</TerminalText>
          </TouchableOpacity>
          <TerminalText style={styles.screenTitle} glow>[ ACTIVE PROTOCOL ]</TerminalText>
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
  
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  headerCard: { padding: 20, alignItems: 'center' },
  programName: { fontSize: 18, color: SystemTheme.colors.primary, marginBottom: 8 },
  weekText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 14, color: SystemTheme.colors.onBackground },
  
  daysList: { gap: 12 },
  dayCard: { padding: 16 },
  dayCardToday: { borderColor: SystemTheme.colors.primary, borderWidth: 1, backgroundColor: 'rgba(0, 242, 255, 0.05)' },
  dayCardPast: { opacity: 0.6 },
  
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dayName: { fontSize: 14, color: SystemTheme.colors.onBackground },
  statusText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.onSurfaceVariant },
  
  restText: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 12, color: SystemTheme.colors.onSurfaceVariant, fontStyle: 'italic' },
  exCount: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 12, color: SystemTheme.colors.onBackground },
  
  startBtn: { marginTop: 16, width: '100%' },
});
