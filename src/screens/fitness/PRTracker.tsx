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
import { EXERCISE_BY_ID } from '../../data/exercises';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = {
  navigation: FitnessTabScreenProp<'PRTracker'>;
};

export default function PRTracker({ navigation }: Props) {
  const { personalRecords } = useStore();
  
  // Sort PRs by achievedDate (most recent first)
  const prsList = Object.values(personalRecords).sort((a, b) => 
    new Date(b.achievedDate).getTime() - new Date(a.achievedDate).getTime()
  );

  return (
    <View style={styles.root}>
      <ScanlineBackground />
      <SafeAreaView style={styles.safeArea}>
        

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerArea}>
            <Text style={styles.headerDesc}>
              Records of maximum output. Each boss kill represents a new limit surpassed.
            </Text>
          </View>

          {prsList.length === 0 ? (
            <View style={styles.emptyState}>
              <TerminalText style={styles.emptyText}>NO BOSSES KILLED YET.</TerminalText>
              <Text style={styles.emptySub}>Log workouts to establish your baseline strength.</Text>
            </View>
          ) : (
            prsList.map((pr, index) => {
              const ex = EXERCISE_BY_ID[pr.exerciseId];
              if (!ex) return null;
              
              return (
                <Animated.View key={pr.exerciseId} entering={FadeInDown.delay(index * 100).springify()}>
                  <SystemWindow style={styles.prCard}>
                    <View style={styles.prHeaderRow}>
                      <Text style={styles.exName}>{ex.name}</Text>
                      <View style={styles.muscleBadge}>
                        <Text style={styles.muscleText}>{ex.muscleGroup.toUpperCase()}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.prContent}>
                      <TerminalText style={styles.scoreText} glow>{pr.bestWeight}kg × {pr.bestReps}</TerminalText>
                      
                      <View style={styles.metaCol}>
                        <Text style={styles.dateLabel}>ACHIEVED</Text>
                        <Text style={styles.dateValue}>{new Date(pr.achievedDate).toLocaleDateString()}</Text>
                        
                        {pr.oneRepMax && (
                          <Text style={styles.oneRmText}>EST 1RM: {pr.oneRepMax}kg</Text>
                        )}
                      </View>
                    </View>
                  </SystemWindow>
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
          <TerminalText style={styles.screenTitle} glow>[ BOSS KILLS (PRs) ]</TerminalText>
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
  screenTitle: { color: SystemTheme.colors.error, fontSize: 14 },
  
  scrollContent: { paddingHorizontal: wp(5), paddingVertical: hp(2), gap: hp(2) },
  
  headerArea: { paddingVertical: 10, marginBottom: 10 },
  headerDesc: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 14, color: SystemTheme.colors.onSurfaceVariant, textAlign: 'center', lineHeight: 20 },
  
  emptyState: { paddingVertical: hp(10), alignItems: 'center' },
  emptyText: { color: SystemTheme.colors.onSurfaceVariant, fontSize: 14, marginBottom: 12 },
  emptySub: { fontFamily: SystemTheme.typography.body.fontFamily, color: SystemTheme.colors.onSurfaceVariant, fontSize: 12, textAlign: 'center' },

  prCard: { padding: 16, borderColor: 'rgba(255,0,0,0.3)' }, // Slightly red tint for Boss Kill vibe
  prHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  exName: { fontFamily: SystemTheme.typography.headline.fontFamily, fontSize: 16, color: SystemTheme.colors.onBackground, flex: 1 },
  muscleBadge: { paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: SystemTheme.colors.primaryDim },
  muscleText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.primary },
  
  prContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  scoreText: { fontSize: 24, color: SystemTheme.colors.error }, // Boss kill red
  
  metaCol: { alignItems: 'flex-end' },
  dateLabel: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.onSurfaceVariant },
  dateValue: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 12, color: SystemTheme.colors.onBackground, marginBottom: 4 },
  oneRmText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.primary },
});
