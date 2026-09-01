import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FitnessTabScreenProp } from '../../types';
import ScanlineBackground from '../../components/system/ScanlineBackground';
import SystemWindow from '../../components/system/SystemWindow';
import TerminalText from '../../components/system/TerminalText';
import { SystemTheme } from '../../theme/SystemTheme';
import { wp, hp } from '../../utils/responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { EXERCISES } from '../../data/exercises';
import { MuscleGroup } from '../../types';

type Props = {
  navigation: FitnessTabScreenProp<'ExerciseLibrary'>;
};

const MUSCLE_GROUPS: MuscleGroup[] = [
  'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Mobility', 'Full Body'
];

export default function ExerciseLibrary({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<MuscleGroup | 'All'>('All');

  const filteredExercises = useMemo(() => {
    return EXERCISES.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || ex.muscleGroup === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <View style={styles.root}>
      <ScanlineBackground />
      <SafeAreaView style={styles.safeArea}>
        

        {/* Search & Filters */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <TerminalText style={styles.searchIcon}>{'>'}</TerminalText>
            <TextInput
              style={styles.searchInput}
              placeholder="SEARCH_EXERCISE"
              placeholderTextColor={SystemTheme.colors.onSurfaceVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity 
              style={[styles.filterChip, activeFilter === 'All' && styles.filterChipActive]}
              onPress={() => setActiveFilter('All')}
            >
              <Text style={[styles.filterText, activeFilter === 'All' && styles.filterTextActive]}>ALL</Text>
            </TouchableOpacity>
            
            {MUSCLE_GROUPS.map(group => (
              <TouchableOpacity 
                key={group}
                style={[styles.filterChip, activeFilter === group && styles.filterChipActive]}
                onPress={() => setActiveFilter(group)}
              >
                <Text style={[styles.filterText, activeFilter === group && styles.filterTextActive]}>{group.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Exercise List */}
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {filteredExercises.map((ex, index) => (
            <Animated.View key={ex.id} entering={FadeInDown.delay(index * 50).springify()}>
              <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: ex.id })}
              >
                <SystemWindow style={styles.exerciseCard}>
                  <View style={styles.cardHeader}>
                    <TerminalText style={styles.exName}>{ex.name}</TerminalText>
                    <Text style={styles.exDifficulty}>
                      {ex.difficulty === 'Beginner' ? 'E-RANK' : ex.difficulty === 'Intermediate' ? 'C-RANK' : 'A-RANK'}
                    </Text>
                  </View>
                  
                  <View style={styles.tagRow}>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{ex.muscleGroup}</Text>
                    </View>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{ex.equipment}</Text>
                    </View>
                  </View>

                  <View style={styles.statRow}>
                    {Object.entries(ex.statWeighting).map(([stat, weight]) => (
                      <View key={stat} style={styles.statBadge}>
                        <Text style={[styles.statText, { color: SystemTheme.colors.primary }]}>{stat} {(weight * 100)}%</Text>
                      </View>
                    ))}
                  </View>
                </SystemWindow>
              </TouchableOpacity>
            </Animated.View>
          ))}
          
          {filteredExercises.length === 0 && (
            <View style={styles.emptyState}>
              <TerminalText style={styles.emptyText}>NO EXERCISES MATCHING CRITERIA.</TerminalText>
            </View>
          )}
        </ScrollView>

        {/* Bottom Header Bar */}
        <View style={styles.bottomHeaderBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <TerminalText style={styles.backBtn}>{'< FITNESS'}</TerminalText>
          </TouchableOpacity>
          <TerminalText style={styles.screenTitle} glow>[ EXERCISE LIBRARY ]</TerminalText>
          <View style={{ width: 60 }} />
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
  screenTitle: {
    color: SystemTheme.colors.primary,
    fontSize: 14,
  },
  searchSection: {
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 242, 255, 0.05)',
    borderWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
    marginHorizontal: wp(5),
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  searchIcon: {
    color: SystemTheme.colors.primary,
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    color: SystemTheme.colors.onBackground,
    fontSize: 14,
  },
  filterScroll: {
    paddingHorizontal: wp(5),
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
    backgroundColor: 'rgba(3, 8, 12, 0.8)',
  },
  filterChipActive: {
    backgroundColor: SystemTheme.colors.primaryDim,
    borderColor: SystemTheme.colors.primary,
  },
  filterText: {
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    fontSize: 10,
    color: SystemTheme.colors.onSurfaceVariant,
  },
  filterTextActive: {
    color: SystemTheme.colors.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    gap: 16,
  },
  exerciseCard: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exName: {
    fontSize: 14,
    color: SystemTheme.colors.onBackground,
    flex: 1,
  },
  exDifficulty: {
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    fontSize: 10,
    color: SystemTheme.colors.onSurfaceVariant,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  tagText: {
    fontFamily: SystemTheme.typography.body.fontFamily,
    fontSize: 10,
    color: SystemTheme.colors.onSurfaceVariant,
  },
  statRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    borderWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statText: {
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    fontSize: 10,
  },
  emptyState: {
    paddingVertical: hp(5),
    alignItems: 'center',
  },
  emptyText: {
    color: SystemTheme.colors.onSurfaceVariant,
    fontSize: 12,
  },
});
