import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SetLog } from '../../types';
import ScanlineBackground from '../../components/system/ScanlineBackground';
import SystemWindow from '../../components/system/SystemWindow';
import TerminalText from '../../components/system/TerminalText';
import SystemButton from '../../components/system/SystemButton';
import RestTimer from '../../components/fitness/RestTimer';
import { SystemTheme } from '../../theme/SystemTheme';
import { wp, hp } from '../../utils/responsive';
import { PROGRAMS } from '../../data/programs';
import { EXERCISE_BY_ID } from '../../data/exercises';
import SystemToast from '../../components/system/SystemToast';
import { useStore } from '../../store/useStore';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutSession'>;

export default function WorkoutSession({ route, navigation }: Props) {
  const { programId, dayIndex } = route.params;
  const store = useStore();

  // Program Context
  const program = programId ? PROGRAMS.find(p => p.id === programId) : null;
  const dayPlan = program && dayIndex !== undefined ? program.days[dayIndex] : null;
  const plannedExercises = dayPlan ? dayPlan.exercises : [];

  // Internal State
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);

  // System Feed Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Combo & Momentum State (Local component state)
  const [comboCount, setComboCount] = useState(0);

  // Awakening Dialog for First Session
  const isFirstSession = store.fitnessProfile.totalSessionsLogged === 0;
  const [showAwakeningModal, setShowAwakeningModal] = useState(isFirstSession);

  // Initialize active session on mount
  useEffect(() => {
    store.startWorkout(programId, dayPlan?.name);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const currentPlannedEx = plannedExercises[currentExIndex];
  const exerciseDef = currentPlannedEx ? EXERCISE_BY_ID[currentPlannedEx.exerciseId] : null;

  // Filter logged sets for the current exercise
  const loggedSets = store.activeSession.sets.filter(
    (s: SetLog) => s.exerciseId === currentPlannedEx?.exerciseId
  );

  // Get Ghost values from PRs (as a simple heuristic for last session)
  const pr = exerciseDef ? store.personalRecords[exerciseDef.id] : null;
  const ghostWeight = pr?.bestWeight?.toString() ?? '';
  const ghostReps = pr?.bestReps?.toString() ?? currentPlannedEx?.reps ?? '';

  const handleLogSet = () => {
    if (!exerciseDef) return;
    const w = parseFloat(weightInput);
    const r = parseInt(repsInput, 10);
    
    if (isNaN(w) && isNaN(r)) return; // need at least something

    const currentScore = (w || 0) * (r || 0);
    const prevBestScore = (pr?.bestWeight || 0) * (pr?.bestReps || 0);

    // Check if PR hit mid-set
    const isPrHit = currentScore > prevBestScore && prevBestScore > 0;

    store.logSet({
      exerciseId: exerciseDef.id,
      weight: isNaN(w) ? undefined : w,
      reps: isNaN(r) ? undefined : r,
    });

    const newCombo = comboCount + 1;
    setComboCount(newCombo);

    // Calculate approximate XP gained for set
    const primaryStat = Object.keys(exerciseDef.statWeighting)[0] || 'STR';
    const estimatedXp = Math.round(10 * (1 + Math.min(newCombo * 0.1, 0.5)));

    if (isPrHit) {
      triggerToast(`BOSS KILL DETECTED — NEW PR: ${w}kg × ${r}!`);
    } else if (newCombo > 2) {
      triggerToast(`COMBO x${(1 + Math.min(newCombo * 0.1, 0.5)).toFixed(1)}! +${estimatedXp} ${primaryStat} XP Gained`);
    } else {
      triggerToast(`+${estimatedXp} ${primaryStat} XP Gained (${primaryStat} progress updated)`);
    }

    setWeightInput('');
    setRepsInput('');

    // Trigger Rest Timer
    const rest = currentPlannedEx?.restSeconds ?? exerciseDef.restSeconds ?? 60;
    setRestSeconds(rest);
    setShowRestTimer(true);
  };

  const handleNextExercise = () => {
    if (currentExIndex < plannedExercises.length - 1) {
      setCurrentExIndex(prev => prev + 1);
      setShowRestTimer(false);
    } else {
      Alert.alert(
        'Complete Protocol?',
        'You have finished all scheduled exercises for today.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Finish Workout', onPress: handleFinish }
        ]
      );
    }
  };

  const handlePrevExercise = () => {
    if (currentExIndex > 0) {
      setCurrentExIndex(prev => prev - 1);
      setShowRestTimer(false);
    }
  };

  const handleFinish = () => {
    const sessionId = store.finishWorkout();
    if (sessionId) {
      navigation.replace('SessionSummary', { sessionId });
    } else {
      navigation.goBack();
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Abort Protocol?',
      'All progress for this session will be lost.',
      [
        { text: 'Resume', style: 'cancel' },
        { text: 'Abort', style: 'destructive', onPress: () => {
          store.cancelWorkout();
          navigation.goBack();
        }}
      ]
    );
  };

  if (!exerciseDef) return <View style={styles.root} />;

  return (
    <KeyboardAvoidingView 
      style={styles.root} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScanlineBackground />
      <SystemToast
        message={toastMessage}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />

      <SafeAreaView style={styles.safeArea}>
        
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          <SystemWindow style={styles.exHeaderCard}>
            <View style={styles.headerTopRow}>
              <Text style={styles.muscleGroupText}>{exerciseDef.muscleGroup.toUpperCase()}</Text>
              {comboCount > 1 && (
                <View style={styles.comboBadge}>
                  <TerminalText style={styles.comboText} glow>
                    🔥 COMBO x{(1 + Math.min(comboCount * 0.1, 0.5)).toFixed(1)}
                  </TerminalText>
                </View>
              )}
            </View>

            <TerminalText style={styles.exNameTitle} glow>{exerciseDef.name}</TerminalText>
            
            <View style={styles.exNavRow}>
              <TouchableOpacity onPress={handlePrevExercise} disabled={currentExIndex === 0}>
                <TerminalText style={[styles.navArrow, currentExIndex === 0 && { opacity: 0.3 }]}>{'< PREV'}</TerminalText>
              </TouchableOpacity>
              <Text style={styles.exCountText}>{currentExIndex + 1} / {plannedExercises.length}</Text>
              <TouchableOpacity onPress={handleNextExercise}>
                <TerminalText style={styles.navArrow}>{currentExIndex === plannedExercises.length - 1 ? 'DONE >' : 'NEXT >'}</TerminalText>
              </TouchableOpacity>
            </View>
          </SystemWindow>

          {showRestTimer ? (
            <SystemWindow style={styles.timerCard}>
              <RestTimer 
                totalSeconds={restSeconds}
                onComplete={() => setShowRestTimer(false)}
                onSkip={() => setShowRestTimer(false)}
                onAddTimer={(sec) => setRestSeconds(prev => prev + sec)}
              />
            </SystemWindow>
          ) : (
            <View style={styles.loggingSection}>
              
              {/* Logged Sets Header */}
              <View style={styles.rowHeader}>
                <Text style={[styles.colHead, { flex: 0.5 }]}>SET</Text>
                <Text style={[styles.colHead, { flex: 1 }]}>KG</Text>
                <Text style={[styles.colHead, { flex: 1 }]}>REPS</Text>
                <Text style={[styles.colHead, { flex: 0.5 }]}></Text>
              </View>

              {/* Previously Logged Sets (this session) */}
              {loggedSets.map((s: SetLog, idx: number) => (
                <View key={idx} style={styles.loggedRow}>
                  <Text style={[styles.loggedText, { flex: 0.5 }]}>{idx + 1}</Text>
                  <Text style={[styles.loggedText, { flex: 1 }]}>{s.weight || '-'}</Text>
                  <Text style={[styles.loggedText, { flex: 1 }]}>{s.reps || '-'}</Text>
                  <View style={[{ flex: 0.5, alignItems: 'center' }]}>
                    <Text style={{ color: SystemTheme.colors.primary }}>✓</Text>
                  </View>
                </View>
              ))}

              {/* Current Input Row */}
              <View style={styles.inputRow}>
                <Text style={[styles.setCurrentText, { flex: 0.5 }]}>{loggedSets.length + 1}</Text>
                
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput 
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder={ghostWeight}
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={weightInput}
                    onChangeText={setWeightInput}
                  />
                </View>

                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput 
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder={ghostReps}
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={repsInput}
                    onChangeText={setRepsInput}
                  />
                </View>

                <TouchableOpacity style={[styles.checkBtn, { flex: 0.5 }]} onPress={handleLogSet}>
                  <Text style={styles.checkIcon}>✓</Text>
                </TouchableOpacity>
              </View>

              {/* Target info */}
              {currentPlannedEx && (
                <Text style={styles.targetText}>
                  Target: {currentPlannedEx.sets} sets × {currentPlannedEx.reps}
                </Text>
              )}

            </View>
          )}

        </ScrollView>

        {/* Bottom Header Bar */}
        <View style={styles.bottomHeaderBar}>
          <TouchableOpacity onPress={handleCancel}>
            <TerminalText style={styles.abortBtn}>[ ABORT ]</TerminalText>
          </TouchableOpacity>
          <View style={styles.progressPills}>
            {plannedExercises.map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.pill, 
                  i === currentExIndex && styles.pillActive,
                  i < currentExIndex && styles.pillCompleted
                ]} 
              />
            ))}
          </View>
          <TouchableOpacity onPress={handleFinish}>
            <TerminalText style={styles.finishBtn} glow>[ FINISH ]</TerminalText>
          </TouchableOpacity>
        </View>

        {/* Awakening Modal Overlay for first session */}
        {showAwakeningModal && (
          <View style={styles.awakeningOverlay}>
            <SystemWindow style={styles.awakeningWindow}>
              <TerminalText style={styles.awakeningTitle} glow>[ SYSTEM INITIALIZED — AWAKENING ]</TerminalText>
              <Text style={styles.awakeningBody}>
                Welcome, Hunter. The System has selected you to undergo physical re-awakening. 
                Your workouts will directly convert into Stat Points and rank progression. 
                Execute your first protocol to forge your path.
              </Text>
              <SystemButton
                title="> ACKNOWLEDGE & BEGIN PROTOCOL_"
                onPress={() => setShowAwakeningModal(false)}
                style={{ marginTop: 16 }}
              />
            </SystemWindow>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SystemTheme.colors.background },
  safeArea: { flex: 1 },

  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  comboBadge: {
    borderWidth: 1,
    borderColor: SystemTheme.colors.primary,
    backgroundColor: 'rgba(0, 242, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  comboText: {
    fontSize: 11,
    color: SystemTheme.colors.primary,
    fontWeight: 'bold',
  },

  awakeningOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(6),
    zIndex: 9999,
  },
  awakeningWindow: {
    padding: wp(6),
    width: '100%',
  },
  awakeningTitle: {
    fontSize: 13,
    color: SystemTheme.colors.primary,
    marginBottom: 12,
    letterSpacing: 1,
  },
  awakeningBody: {
    fontFamily: SystemTheme.typography.body.fontFamily,
    color: SystemTheme.colors.onBackground,
    fontSize: 13,
    lineHeight: 20,
  },
  
  bottomHeaderBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: wp(5), paddingVertical: hp(2),
    borderTopWidth: 1, borderColor: SystemTheme.colors.primaryDim,
  },
  abortBtn: { color: SystemTheme.colors.error, fontSize: 12 },
  finishBtn: { color: SystemTheme.colors.primary, fontSize: 12 },
  
  progressPills: { flexDirection: 'row', gap: 4, flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  pill: { height: 4, flex: 1, maxWidth: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
  pillActive: { backgroundColor: SystemTheme.colors.primary, shadowColor: SystemTheme.colors.primary, shadowOpacity: 0.8, shadowRadius: 4 },
  pillCompleted: { backgroundColor: 'rgba(0, 242, 255, 0.4)' },

  scrollContent: { paddingHorizontal: wp(5), paddingBottom: hp(10), gap: 16 },
  
  exHeaderCard: { padding: 20, alignItems: 'center' },
  muscleGroupText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.onSurfaceVariant, letterSpacing: 2, marginBottom: 8 },
  exNameTitle: { fontSize: 24, color: SystemTheme.colors.primary, textAlign: 'center', marginBottom: 24 },
  
  exNavRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: SystemTheme.colors.primaryDim, paddingTop: 16 },
  navArrow: { color: SystemTheme.colors.onBackground, fontSize: 14 },
  exCountText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 12, color: SystemTheme.colors.primary },

  timerCard: { padding: 20, marginTop: 16 },

  loggingSection: { marginTop: 16 },
  rowHeader: { flexDirection: 'row', marginBottom: 12, paddingHorizontal: 8 },
  colHead: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 12, color: SystemTheme.colors.onSurfaceVariant, textAlign: 'center' },
  
  loggedRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,242,255,0.05)', paddingVertical: 12, paddingHorizontal: 8, marginBottom: 8, borderWidth: 1, borderColor: SystemTheme.colors.primaryDim },
  loggedText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 16, color: SystemTheme.colors.onBackground, textAlign: 'center' },
  
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, marginBottom: 16, gap: 8 },
  setCurrentText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 16, color: SystemTheme.colors.onSurfaceVariant, textAlign: 'center' },
  inputWrapper: { backgroundColor: 'rgba(3,8,12,0.8)', borderWidth: 1, borderColor: SystemTheme.colors.onSurfaceVariant, height: 48, justifyContent: 'center' },
  input: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 20, color: SystemTheme.colors.onBackground, textAlign: 'center', height: '100%' },
  
  checkBtn: { height: 48, backgroundColor: SystemTheme.colors.primaryDim, borderWidth: 1, borderColor: SystemTheme.colors.primary, alignItems: 'center', justifyContent: 'center' },
  checkIcon: { color: SystemTheme.colors.primary, fontSize: 20, fontWeight: '700' },

  targetText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 12, color: SystemTheme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 16 },
});
