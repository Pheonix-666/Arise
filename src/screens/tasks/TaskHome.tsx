import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../../types';
import { Quest, TaskDifficulty } from '../../types';
import { useStore } from '../../store/useStore';
import ScanlineBackground from '../../components/system/ScanlineBackground';
import SystemWindow from '../../components/system/SystemWindow';
import TerminalText from '../../components/system/TerminalText';
import SystemButton from '../../components/system/SystemButton';
import { SystemTheme } from '../../theme/SystemTheme';
import { wp, hp } from '../../utils/responsive';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TaskHome'>;
};

const DIFFICULTY_COLORS: Record<TaskDifficulty, string> = {
  E: '#6b7280',
  D: '#22c55e',
  C: '#4dd8ff',
  B: '#f59e0b',
  A: '#a855f7',
  S: '#ef4444',
};

const DIFFICULTY_XP: Record<TaskDifficulty, number> = {
  E: 50,
  D: 100,
  C: 200,
  B: 400,
  A: 750,
  S: 1500,
};

const SEED_QUESTS: Quest[] = [
  { id: 'q1', title: 'Complete 100 Push-ups', description: 'Full range of motion required.', difficulty: 'D', xpReward: 100, completed: false, createdAt: Date.now() },
  { id: 'q2', title: 'Read for 30 minutes', description: 'Expand your knowledge, Hunter.', difficulty: 'E', xpReward: 50, completed: false, createdAt: Date.now() },
  { id: 'q3', title: 'Cold shower protocol', description: 'Build mental fortitude.', difficulty: 'C', xpReward: 200, completed: false, createdAt: Date.now() },
];

export default function TaskHome({ navigation }: Props) {
  const { quests: storedQuests, addQuest, completeQuest, removeQuest, user } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<TaskDifficulty>('E');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('active');

  // Use seed quests if store is empty
  const allQuests = storedQuests.length === 0 ? SEED_QUESTS : storedQuests;

  const visibleQuests = allQuests.filter(q => {
    if (filter === 'active') return !q.completed;
    if (filter === 'done') return q.completed;
    return true;
  });

  const activeCount = allQuests.filter(q => !q.completed).length;
  const doneCount = allQuests.filter(q => q.completed).length;

  const handleAddQuest = () => {
    if (!newTitle.trim()) {
      Alert.alert('ERROR', 'Quest title cannot be empty.');
      return;
    }
    const quest: Quest = {
      id: `q_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      difficulty: newDifficulty,
      xpReward: DIFFICULTY_XP[newDifficulty],
      completed: false,
      createdAt: Date.now(),
    };
    addQuest(quest);
    setNewTitle('');
    setNewDesc('');
    setNewDifficulty('E');
    setModalVisible(false);
  };

  const handleComplete = (id: string) => {
    completeQuest(id);
  };

  return (
    <View style={styles.root}>
      <ScanlineBackground />
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <TerminalText style={styles.backText}>← BACK</TerminalText>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>DAILY QUESTS</Text>
          <TerminalText style={styles.xpLabel}>LVL {user.level}</TerminalText>
        </View>

        {/* Stats bar */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <SystemWindow style={styles.statsRow}>
            <View style={styles.statItem}>
              <TerminalText style={[styles.statNum, { color: SystemTheme.colors.primary }]}>
                {activeCount}
              </TerminalText>
              <Text style={styles.statLabel}>ACTIVE</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <TerminalText style={[styles.statNum, { color: '#22c55e' }]}>
                {doneCount}
              </TerminalText>
              <Text style={styles.statLabel}>CLEARED</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <TerminalText style={[styles.statNum, { color: '#f59e0b' }]}>
                {user.xp}
              </TerminalText>
              <Text style={styles.statLabel}>TOTAL XP</Text>
            </View>
          </SystemWindow>
        </Animated.View>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {(['active', 'done', 'all'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <TerminalText style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.toUpperCase()}
              </TerminalText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quest List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {visibleQuests.length === 0 ? (
            <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.emptyState}>
              <TerminalText style={styles.emptyText} glow>
                [ NO QUESTS DETECTED ]
              </TerminalText>
              <Text style={styles.emptySubText}>Issue new quest to begin protocol.</Text>
            </Animated.View>
          ) : (
            visibleQuests.map((quest, i) => (
              <Animated.View
                key={quest.id}
                entering={FadeInDown.delay(i * 80).springify()}
              >
                <TouchableOpacity
                  style={[
                    styles.questCard,
                    quest.completed && styles.questCardDone,
                    { borderLeftColor: DIFFICULTY_COLORS[quest.difficulty] },
                  ]}
                  activeOpacity={0.8}
                  onLongPress={() => removeQuest(quest.id)}
                >
                  {/* Difficulty badge */}
                  <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[quest.difficulty] + '22', borderColor: DIFFICULTY_COLORS[quest.difficulty] + '55' }]}>
                    <TerminalText style={[styles.diffText, { color: DIFFICULTY_COLORS[quest.difficulty] }]}>
                      {quest.difficulty}
                    </TerminalText>
                  </View>

                  <View style={styles.questInfo}>
                    <TerminalText style={[styles.questTitle, quest.completed && styles.questTitleDone]}>
                      {quest.title}
                    </TerminalText>
                    {!!quest.description && (
                      <Text style={styles.questDesc}>{quest.description}</Text>
                    )}
                  </View>

                  <View style={styles.questRight}>
                    <TerminalText style={[styles.xpReward, { color: DIFFICULTY_COLORS[quest.difficulty] }]}>
                      +{quest.xpReward}XP
                    </TerminalText>
                    {!quest.completed && (
                      <TouchableOpacity
                        style={[styles.completeBtn, { borderColor: DIFFICULTY_COLORS[quest.difficulty] + '80' }]}
                        onPress={() => handleComplete(quest.id)}
                      >
                        <TerminalText style={[styles.completeBtnText, { color: DIFFICULTY_COLORS[quest.difficulty] }]}>
                          ✓
                        </TerminalText>
                      </TouchableOpacity>
                    )}
                    {quest.completed && (
                      <TerminalText style={styles.clearedTag}>CLEARED</TerminalText>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
          <View style={{ height: hp(12) }} />
        </ScrollView>

        {/* Add Quest Button */}
        <View style={styles.fab}>
          <SystemButton
            title="> NEW QUEST_"
            onPress={() => setModalVisible(true)}
            style={styles.fabBtn}
          />
        </View>
      </SafeAreaView>

      {/* Add Quest Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SystemWindow style={styles.modalWindow}>
            <TerminalText style={styles.modalTitle} glow>[ ISSUE NEW QUEST ]</TerminalText>

            <TextInput
              style={styles.input}
              placeholder="Quest Title_"
              placeholderTextColor={SystemTheme.colors.onSurfaceVariant}
              value={newTitle}
              onChangeText={setNewTitle}
              selectionColor={SystemTheme.colors.primary}
            />
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              placeholder="Description (optional)_"
              placeholderTextColor={SystemTheme.colors.onSurfaceVariant}
              value={newDesc}
              onChangeText={setNewDesc}
              selectionColor={SystemTheme.colors.primary}
            />

            <Text style={styles.inputLabel}>DIFFICULTY</Text>
            <View style={styles.diffRow}>
              {(['E', 'D', 'C', 'B', 'A', 'S'] as TaskDifficulty[]).map(d => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.diffChoice,
                    { borderColor: DIFFICULTY_COLORS[d] + '55' },
                    newDifficulty === d && { backgroundColor: DIFFICULTY_COLORS[d] + '30', borderColor: DIFFICULTY_COLORS[d] },
                  ]}
                  onPress={() => setNewDifficulty(d)}
                >
                  <TerminalText style={{ color: DIFFICULTY_COLORS[d], fontSize: 13 }}>{d}</TerminalText>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <SystemButton title="CANCEL" onPress={() => setModalVisible(false)} style={{ flex: 1 }} />
              <SystemButton title="> ISSUE_" onPress={handleAddQuest} style={[{ flex: 1 }, styles.confirmBtn]} />
            </View>
          </SystemWindow>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SystemTheme.colors.background },
  safeArea: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
  },
  backBtn: { padding: 4 },
  backText: { color: SystemTheme.colors.onSurfaceVariant, fontSize: 12 },
  headerTitle: {
    fontFamily: SystemTheme.typography.rank.fontFamily,
    color: SystemTheme.colors.secondary,
    fontSize: 18,
    letterSpacing: 3,
  },
  xpLabel: { color: SystemTheme.colors.primary, fontSize: 12 },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: wp(5),
    marginTop: hp(2),
    padding: hp(2),
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statNum: { fontSize: 22, fontFamily: SystemTheme.typography.stat.fontFamily },
  statLabel: { color: SystemTheme.colors.onSurfaceVariant, fontSize: 10, fontFamily: SystemTheme.typography.terminal.fontFamily, letterSpacing: 1 },
  statDivider: { width: 1, backgroundColor: SystemTheme.colors.primaryDim, marginVertical: 4 },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: wp(5),
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
  },
  filterTabActive: {
    backgroundColor: SystemTheme.colors.primaryDim,
    borderColor: SystemTheme.colors.primary,
  },
  filterText: { color: SystemTheme.colors.onSurfaceVariant, fontSize: 11 },
  filterTextActive: { color: SystemTheme.colors.primary },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: wp(5), paddingTop: hp(1) },

  emptyState: { alignItems: 'center', marginTop: hp(10), gap: 12 },
  emptyText: { color: SystemTheme.colors.primary, fontSize: 14 },
  emptySubText: { color: SystemTheme.colors.onSurfaceVariant, fontSize: 12, fontFamily: SystemTheme.typography.body.fontFamily },

  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(3, 8, 12, 0.85)',
    borderWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
    borderLeftWidth: 3,
    padding: 14,
    marginBottom: 8,
  },
  questCardDone: { opacity: 0.5 },
  diffBadge: {
    width: 28,
    height: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffText: { fontSize: 12, fontWeight: '800' },
  questInfo: { flex: 1, gap: 3 },
  questTitle: { color: SystemTheme.colors.onBackground, fontSize: 13, fontFamily: SystemTheme.typography.terminal.fontFamily, letterSpacing: 0.8 },
  questTitleDone: { textDecorationLine: 'line-through', opacity: 0.5 },
  questDesc: { color: SystemTheme.colors.onSurfaceVariant, fontSize: 11, fontFamily: SystemTheme.typography.body.fontFamily },
  questRight: { alignItems: 'flex-end', gap: 6 },
  xpReward: { fontSize: 11, fontFamily: SystemTheme.typography.stat.fontFamily },
  completeBtn: {
    width: 28,
    height: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtnText: { fontSize: 14 },
  clearedTag: { color: '#22c55e', fontSize: 10 },

  fab: {
    position: 'absolute',
    bottom: hp(3),
    left: wp(5),
    right: wp(5),
  },
  fabBtn: { width: '100%' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    paddingHorizontal: wp(6),
  },
  modalWindow: { padding: 24 },
  modalTitle: { color: SystemTheme.colors.secondary, fontSize: 14, textAlign: 'center', marginBottom: 20 },
  input: {
    borderBottomWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
    color: SystemTheme.colors.onBackground,
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    letterSpacing: 0.8,
  },
  inputLabel: {
    color: SystemTheme.colors.onSurfaceVariant,
    fontSize: 10,
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    letterSpacing: 1.5,
    marginTop: 20,
    marginBottom: 8,
  },
  diffRow: { flexDirection: 'row', gap: 8 },
  diffChoice: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  confirmBtn: {
    backgroundColor: SystemTheme.colors.primaryDim,
    borderColor: SystemTheme.colors.primary,
  },
});
