import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FitnessTabScreenProp } from '../../types';
import ScanlineBackground from '../../components/system/ScanlineBackground';
import SystemWindow from '../../components/system/SystemWindow';
import TerminalText from '../../components/system/TerminalText';
import SystemButton from '../../components/system/SystemButton';
import StatBar from '../../components/fitness/StatBar';
import { SystemTheme } from '../../theme/SystemTheme';
import { wp, hp } from '../../utils/responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useStore } from '../../store/useStore';
import { PROGRAM_BY_ID } from '../../data/programs';

type Props = {
  navigation: FitnessTabScreenProp<'FitnessHome'>;
};

export default function FitnessHome({ navigation }: Props) {
  const { user, fitnessProfile } = useStore();

  const activeProgram = fitnessProfile.activeProgramId 
    ? PROGRAM_BY_ID[fitnessProfile.activeProgramId] 
    : null;

  const currentDay = activeProgram 
    ? activeProgram.days[fitnessProfile.currentProgramDayIndex % activeProgram.days.length] 
    : null;

  return (
    <View style={styles.root}>
      <ScanlineBackground />
      <SafeAreaView style={styles.safeArea}>
        


        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* STATS SECTION */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <SystemWindow style={styles.window}>
              <TerminalText style={styles.sectionTitle} glow>HUNTER STATUS</TerminalText>
              
              <View style={styles.levelRow}>
                <Text style={styles.levelNumber}>Lv.{user.level}</Text>
                <Text style={styles.hunterName}>{user.displayName}</Text>
              </View>

              <View style={styles.statsContainer}>
                <StatBar stat="STR" level={fitnessProfile.stats.STR} currentXp={fitnessProfile.statXpProgress.STR} />
                <StatBar stat="VIT" level={fitnessProfile.stats.VIT} currentXp={fitnessProfile.statXpProgress.VIT} />
                <StatBar stat="AGI" level={fitnessProfile.stats.AGI} currentXp={fitnessProfile.statXpProgress.AGI} />
                <StatBar stat="SENSE" level={fitnessProfile.stats.SENSE} currentXp={fitnessProfile.statXpProgress.SENSE} />
              </View>

              <View style={styles.quickStatsRow}>
                <View style={styles.quickStat}>
                  <Text style={styles.qsValue}>{fitnessProfile.currentStreak}</Text>
                  <Text style={styles.qsLabel}>DAY STREAK</Text>
                </View>
                <View style={styles.quickStat}>
                  <Text style={styles.qsValue}>{fitnessProfile.totalSessionsLogged}</Text>
                  <Text style={styles.qsLabel}>SESSIONS</Text>
                </View>
                <View style={styles.quickStat}>
                  <Text style={styles.qsValue}>{Math.floor(fitnessProfile.lifetimeFitnessXp)}</Text>
                  <Text style={styles.qsLabel}>TOTAL XP</Text>
                </View>
              </View>
            </SystemWindow>
          </Animated.View>

          {/* TODAY'S SESSION */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <SystemWindow style={[styles.window, { marginTop: hp(2) }]}>
              <TerminalText style={styles.sectionTitle} glow>DAILY PROTOCOL</TerminalText>
              
              {activeProgram && currentDay ? (
                <View style={styles.sessionCard}>
                  <Text style={styles.programName}>{activeProgram.name}</Text>
                  <Text style={styles.dayName}>Week {fitnessProfile.currentProgramWeek} • {currentDay.name}</Text>
                  
                  {currentDay.isRestDay ? (
                    <Text style={styles.restText}>Recovery protocol active. Rest is required for stat consolidation.</Text>
                  ) : (
                    <Text style={styles.exerciseCount}>{currentDay.exercises.length} Exercises Scheduled</Text>
                  )}

                  <SystemButton 
                    title={currentDay.isRestDay ? "> SKIP REST DAY_" : "> START PROTOCOL_"}
                    onPress={() => {
                      if (currentDay.isRestDay) {
                        useStore.getState().advanceProgramDay();
                      } else {
                        navigation.navigate('WorkoutSession', { programId: activeProgram.id, dayIndex: fitnessProfile.currentProgramDayIndex });
                      }
                    }}
                    style={styles.startBtn}
                  />
                </View>
              ) : (
                <View style={styles.noProgramCard}>
                  <Text style={styles.noProgramText}>No active training protocol detected.</Text>
                  <SystemButton 
                    title="> BROWSE PROGRAMS_"
                    onPress={() => navigation.navigate('Programs')}
                    style={styles.startBtn}
                  />
                </View>
              )}
            </SystemWindow>
          </Animated.View>



        </ScrollView>
        
        {/* Bottom Header Bar */}
        <View style={styles.bottomHeaderBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <TerminalText style={styles.backBtn}>{'< SYSTEM'}</TerminalText>
          </TouchableOpacity>
          <View style={styles.rankBadge}>
            <TerminalText style={styles.rankText} glow>[ {user.rank}-RANK ]</TerminalText>
          </View>
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
  bottomHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
    borderTopWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
  },
  backBtn: {
    color: SystemTheme.colors.onSurfaceVariant,
    fontSize: 12,
  },
  rankBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: SystemTheme.colors.primary,
    backgroundColor: 'rgba(0, 242, 255, 0.15)',
  },
  rankText: {
    fontSize: 14,
    color: SystemTheme.colors.primary,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(10),
    paddingTop: hp(2),
  },
  window: {
    padding: wp(5),
  },
  sectionTitle: {
    fontSize: 14,
    color: SystemTheme.colors.primary,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
    paddingBottom: 4,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 20,
  },
  levelNumber: {
    fontFamily: SystemTheme.typography.rank.fontFamily,
    fontSize: 32,
    color: SystemTheme.colors.onBackground,
  },
  hunterName: {
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    fontSize: 16,
    color: SystemTheme.colors.onSurfaceVariant,
  },
  statsContainer: {
    marginBottom: 20,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
    paddingTop: 16,
  },
  quickStat: {
    alignItems: 'center',
  },
  qsValue: {
    fontFamily: SystemTheme.typography.rank.fontFamily,
    fontSize: 20,
    color: SystemTheme.colors.primary,
  },
  qsLabel: {
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    fontSize: 10,
    color: SystemTheme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  sessionCard: {
    alignItems: 'center',
  },
  programName: {
    fontFamily: SystemTheme.typography.headline.fontFamily,
    fontSize: 18,
    color: SystemTheme.colors.onBackground,
    marginBottom: 4,
  },
  dayName: {
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    fontSize: 12,
    color: SystemTheme.colors.onSurfaceVariant,
    marginBottom: 16,
  },
  exerciseCount: {
    fontFamily: SystemTheme.typography.body.fontFamily,
    fontSize: 14,
    color: SystemTheme.colors.onBackground,
    marginBottom: 24,
  },
  restText: {
    fontFamily: SystemTheme.typography.body.fontFamily,
    fontSize: 14,
    color: SystemTheme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  startBtn: {
    width: '100%',
  },
  noProgramCard: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  noProgramText: {
    fontFamily: SystemTheme.typography.body.fontFamily,
    color: SystemTheme.colors.onSurfaceVariant,
    marginBottom: 20,
    textAlign: 'center',
  },

});
