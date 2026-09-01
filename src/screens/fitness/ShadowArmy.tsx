import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, RANK_THRESHOLDS } from '../../types';
import ScanlineBackground from '../../components/system/ScanlineBackground';
import SystemWindow from '../../components/system/SystemWindow';
import TerminalText from '../../components/system/TerminalText';
import { SystemTheme } from '../../theme/SystemTheme';
import { wp, hp } from '../../utils/responsive';
import { useStore } from '../../store/useStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'ShadowArmy'>;

export default function ShadowArmy({ navigation }: Props) {
  const { fitnessProfile } = useStore();
  const shadowRoster = fitnessProfile.shadowRoster || [];

  return (
    <View style={styles.root}>
      <ScanlineBackground />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <TerminalText style={styles.backText}>← BACK</TerminalText>
          </TouchableOpacity>
          <TerminalText style={styles.screenTitle} glow>
            [ SHADOW ARMY ROSTER ]
          </TerminalText>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Summary Window */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <SystemWindow style={styles.summaryWindow}>
              <TerminalText style={styles.summaryTitle} glow>
                ARMY OVERVIEW
              </TerminalText>
              
              <View style={styles.summaryMetrics}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>{shadowRoster.length}</Text>
                  <Text style={styles.metricLabel}>EXTRACTED</Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricValue, { color: SystemTheme.colors.secondary }]}>
                    {shadowRoster.filter(s => s.tier === 'S' || s.tier === 'A').length}
                  </Text>
                  <Text style={styles.metricLabel}>ELITE COMMANDERS</Text>
                </View>
              </View>
            </SystemWindow>
          </Animated.View>

          {/* Soldiers List */}
          {shadowRoster.length === 0 ? (
            <View style={styles.emptyState}>
              <TerminalText style={styles.emptyTitle}>NO SHADOWS EXTRACTED YET.</TerminalText>
              <Text style={styles.emptySub}>
                Complete program days or hit new PRs to extract shadow warriors into your army.
              </Text>
            </View>
          ) : (
            shadowRoster.map((soldier, index) => {
              const rankInfo = RANK_THRESHOLDS.find(r => r.rank === soldier.tier) || RANK_THRESHOLDS[0];
              
              return (
                <Animated.View key={soldier.id} entering={FadeInDown.delay(index * 60).springify()}>
                  <SystemWindow style={styles.soldierCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.nameBlock}>
                        <TerminalText style={styles.soldierName} glow>
                          {soldier.name}
                        </TerminalText>
                        <Text style={styles.sourceText}>
                          SOURCE: {soldier.sourceType.toUpperCase()}
                        </Text>
                      </View>

                      <View style={[styles.rankBadge, { borderColor: rankInfo.color }]}>
                        <Text style={[styles.rankBadgeText, { color: rankInfo.color }]}>
                          {soldier.tier}-RANK
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      <Text style={styles.dateText}>
                        EXTRACTED: {new Date(soldier.extractedAt).toLocaleDateString()}
                      </Text>
                      {soldier.power && (
                        <TerminalText style={styles.powerText}>
                          PWR {soldier.power}
                        </TerminalText>
                      )}
                    </View>
                  </SystemWindow>
                </Animated.View>
              );
            })
          )}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SystemTheme.colors.background },
  safeArea: { flex: 1 },
  
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
  },
  backBtn: { padding: 4 },
  backText: { color: SystemTheme.colors.onSurfaceVariant, fontSize: 12 },
  screenTitle: { color: SystemTheme.colors.primary, fontSize: 13, letterSpacing: 1 },

  scrollContent: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    gap: 16,
  },

  summaryWindow: {
    padding: wp(4),
  },
  summaryTitle: {
    fontSize: 12,
    color: SystemTheme.colors.primary,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: SystemTheme.colors.primaryDim,
    paddingBottom: 4,
  },
  summaryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: SystemTheme.typography.rank.fontFamily,
    fontSize: 28,
    color: SystemTheme.colors.primary,
  },
  metricLabel: {
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    fontSize: 10,
    color: SystemTheme.colors.onSurfaceVariant,
    marginTop: 2,
  },

  emptyState: {
    paddingVertical: hp(8),
    alignItems: 'center',
    paddingHorizontal: wp(4),
  },
  emptyTitle: {
    color: SystemTheme.colors.onSurfaceVariant,
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: SystemTheme.typography.body.fontFamily,
    color: SystemTheme.colors.onSurfaceVariant,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  soldierCard: {
    padding: wp(4),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameBlock: {
    flex: 1,
    gap: 4,
  },
  soldierName: {
    fontSize: 15,
    color: SystemTheme.colors.onBackground,
    fontWeight: '700',
  },
  sourceText: {
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    fontSize: 10,
    color: SystemTheme.colors.onSurfaceVariant,
  },
  rankBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  rankBadgeText: {
    fontFamily: SystemTheme.typography.stat.fontFamily,
    fontSize: 11,
    fontWeight: 'bold',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
  },
  dateText: {
    fontFamily: SystemTheme.typography.terminal.fontFamily,
    fontSize: 10,
    color: SystemTheme.colors.onSurfaceVariant,
  },
  powerText: {
    fontSize: 11,
    color: SystemTheme.colors.primary,
  },
});
