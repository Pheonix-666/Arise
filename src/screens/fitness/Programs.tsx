import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FitnessTabScreenProp } from '../../types';
import ScanlineBackground from '../../components/system/ScanlineBackground';
import SystemWindow from '../../components/system/SystemWindow';
import TerminalText from '../../components/system/TerminalText';
import { SystemTheme } from '../../theme/SystemTheme';
import { wp, hp } from '../../utils/responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PROGRAMS } from '../../data/programs';

type Props = {
  navigation: FitnessTabScreenProp<'Programs'>;
};

export default function Programs({ navigation }: Props) {
  // Group programs by tier
  const goblinPrograms = PROGRAMS.filter(p => p.tier === 'Goblin');
  const dungeonPrograms = PROGRAMS.filter(p => p.tier === 'Dungeon');
  const gatePrograms = PROGRAMS.filter(p => p.tier === 'Gate');

  const renderProgramCard = (program: typeof PROGRAMS[0], index: number) => (
    <Animated.View key={program.id} entering={FadeInDown.delay(index * 100).springify()}>
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => navigation.navigate('ProgramDetail', { programId: program.id })}
      >
        <SystemWindow style={styles.programCard}>
          <View style={styles.cardHeader}>
            <TerminalText style={styles.programName}>{program.name}</TerminalText>
            <View style={styles.tierBadge}>
              <Text style={styles.tierText}>{program.tier.toUpperCase()}</Text>
            </View>
          </View>
          
          <Text style={styles.programDesc} numberOfLines={2}>
            {program.description}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={styles.footerText}>{program.daysPerWeek} Days/Week</Text>
            <Text style={styles.footerText}>•</Text>
            <Text style={styles.footerText}>{program.difficulty}</Text>
            <Text style={styles.footerText}>•</Text>
            <Text style={styles.primaryStats}>
              Focus: {program.primaryStats.join(', ')}
            </Text>
          </View>
        </SystemWindow>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.root}>
      <ScanlineBackground />
      <SafeAreaView style={styles.safeArea}>
        

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.section}>
            <TerminalText style={styles.sectionTitle}>E-RANK: GOBLIN TIER</TerminalText>
            {goblinPrograms.map((p, i) => renderProgramCard(p, i))}
          </View>

          <View style={styles.section}>
            <TerminalText style={[styles.sectionTitle, { color: SystemTheme.colors.secondary }]}>
              D-RANK: DUNGEON TIER
            </TerminalText>
            {dungeonPrograms.map((p, i) => renderProgramCard(p, i))}
          </View>

          <View style={styles.section}>
            <TerminalText style={[styles.sectionTitle, { color: SystemTheme.colors.error }]}>
              C-RANK: GATE TIER
            </TerminalText>
            {gatePrograms.map((p, i) => renderProgramCard(p, i))}
          </View>

        </ScrollView>
        {/* Bottom Header Bar */}
        <View style={styles.bottomHeaderBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <TerminalText style={styles.backBtn}>{'< FITNESS'}</TerminalText>
          </TouchableOpacity>
          <TerminalText style={styles.screenTitle} glow>[ TRAINING PROTOCOLS ]</TerminalText>
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
  
  scrollContent: { paddingHorizontal: wp(5), paddingVertical: hp(2), gap: hp(4) },
  
  section: { gap: 16 },
  sectionTitle: { fontSize: 12, color: SystemTheme.colors.primary, marginBottom: 8, letterSpacing: 2 },
  
  programCard: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  programName: { fontSize: 14, color: SystemTheme.colors.onBackground, flex: 1 },
  tierBadge: { borderWidth: 1, borderColor: SystemTheme.colors.primaryDim, paddingHorizontal: 8, paddingVertical: 2 },
  tierText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.primary },
  
  programDesc: { fontFamily: SystemTheme.typography.body.fontFamily, fontSize: 12, color: SystemTheme.colors.onSurfaceVariant, marginBottom: 16, lineHeight: 18 },
  
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  footerText: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.onSurfaceVariant },
  primaryStats: { fontFamily: SystemTheme.typography.terminal.fontFamily, fontSize: 10, color: SystemTheme.colors.primary },
});
