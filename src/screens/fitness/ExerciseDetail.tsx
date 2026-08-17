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
import { EXERCISE_BY_ID } from '../../data/exercises';
import { useStore } from '../../store/useStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseDetail'>;

export default function ExerciseDetail({ route, navigation }: Props) {
  const { exerciseId } = route.params;
  const exercise = EXERCISE_BY_ID[exerciseId];
  const pr = useStore(s => s.personalRecords[exerciseId]);

  if (!exercise) return null;

  return (
    <View style={styles.root}>
      <ScanlineBackground />
      <SafeAreaView style={styles.safeArea}>
        

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <SystemWindow style={styles.headerCard}>
              <TerminalText style={styles.exName} glow>{exercise.name}</TerminalText>
              
              <View style={styles.tagRow}>
                <View style={styles.tag}><Text style={styles.tagText}>{exercise.muscleGroup}</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>{exercise.equipment}</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>{exercise.difficulty}</Text></View>
              </View>

              <View style={styles.statGrid}>
                {Object.entries(exercise.statWeighting).map(([stat, weight]) => (
                  <View key={stat} style={styles.statBadge}>
                    <Text style={[styles.statText, { color: SystemTheme.colors.primary }]}>{stat}</Text>
                    <Text style={styles.statVal}>{(weight as number) * 100}%</Text>
                  </View>
                ))}
              </View>
            </SystemWindow>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <SystemWindow style={styles.sectionCard}>
              <TerminalText style={styles.sectionTitle}>EXECUTION PROTOCOL</TerminalText>
              <View style={styles.instructions}>
                {exercise.instructions.map((step, index) => (
                  <View key={index} style={styles.stepRow}>
                    <TerminalText style={styles.stepNum}>0{index + 1}.</TerminalText>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </SystemWindow>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <SystemWindow style={styles.sectionCard}>
              <TerminalText style={styles.sectionTitle}>YOUR HISTORY</TerminalText>
              {pr ? (
                <View style={styles.prBox}>
                  <Text style={styles.prLabel}>PERSONAL RECORD (BOSS KILL)</Text>
                  <TerminalText style={styles.prValue} glow>{pr.bestWeight}kg × {pr.bestReps}</TerminalText>
                  <Text style={styles.prDate}>Achieved: {new Date(pr.achievedDate).toLocaleDateString()}</Text>
                  {pr.oneRepMax && (
                    <Text style={styles.pr1RM}>Est. 1RM: {pr.oneRepMax}kg</Text>
                  )}
                </View>
              ) : (
                <View style={styles.noHistory}>
                  <Text style={styles.noHistoryText}>No data recorded for this exercise yet.</Text>
                </View>
              )}
            </SystemWindow>
          </Animated.View>

          {/* Add to Custom Program - v1.5 feature placeholder */}
          {/* <SystemButton title="> ADD TO CUSTOM PROGRAM_" onPress={() => {}} style={styles.addBtn} /> */}

        </ScrollView>
        {/* Bottom Header Bar */}
        <View style={styles.bottomHeaderBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <TerminalText style={styles.backBtn}>{'< LIBRARY'}</TerminalText>
          </TouchableOpacity>
          <TerminalText style={styles.screenTitle} glow>[ EXERCISE_DATA ]</TerminalText>
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
  
  headerCard: { padding: 20 },
  exName: { fontSize: 20, color: SystemTheme.colors.primary, marginBottom: 16 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: { backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 12, color: SystemTheme.colors.onBackground },
  statGrid: { flexDirection: 'row', gap: 12 },
  statBadge: { flex: 1, borderWidth: 1, borderColor: SystemTheme.colors.primaryDim, padding: 8, alignItems: 'center' },
  statText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 12, marginBottom: 4 },
  statVal: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 12, color: SystemTheme.colors.onSurfaceVariant },

  sectionCard: { padding: 20 },
  sectionTitle: { fontSize: 14, color: SystemTheme.colors.primary, marginBottom: 16, borderBottomWidth: 1, borderColor: SystemTheme.colors.primaryDim, paddingBottom: 8 },
  
  instructions: { gap: 16 },
  stepRow: { flexDirection: 'row', gap: 12 },
  stepNum: { color: SystemTheme.colors.primaryDim, fontSize: 14 },
  stepText: { flex: 1, fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 14, color: SystemTheme.colors.onBackground, lineHeight: 22 },

  prBox: { alignItems: 'center', backgroundColor: 'rgba(0, 242, 255, 0.02)', padding: 16, borderWidth: 1, borderColor: SystemTheme.colors.primaryDim },
  prLabel: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 10, color: SystemTheme.colors.onSurfaceVariant, letterSpacing: 1, marginBottom: 8 },
  prValue: { fontSize: 24, color: SystemTheme.colors.primary, marginBottom: 8 },
  prDate: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.onSurfaceVariant },
  pr1RM: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.secondary, marginTop: 8 },
  
  noHistory: { paddingVertical: 20, alignItems: 'center' },
  noHistoryText: { fontFamily: SystemTheme.typography.body.fontFamily, color: SystemTheme.colors.onSurfaceVariant, fontSize: 14 },

  addBtn: { marginTop: hp(2) },
});
