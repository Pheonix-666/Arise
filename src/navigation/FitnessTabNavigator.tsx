import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Text } from 'react-native';
import { FitnessTabParamList } from '../types';
import { SystemTheme } from '../theme/SystemTheme';
import TerminalText from '../components/system/TerminalText';
import { hp } from '../utils/responsive';

// Screens
import FitnessHome from '../screens/fitness/FitnessHome';
import ExerciseLibrary from '../screens/fitness/ExerciseLibrary';
import Programs from '../screens/fitness/Programs';
import WorkoutHistory from '../screens/fitness/WorkoutHistory';
import PRTracker from '../screens/fitness/PRTracker';

const Tab = createBottomTabNavigator<FitnessTabParamList>();

export default function FitnessTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="FitnessHome"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: SystemTheme.colors.primary,
        tabBarInactiveTintColor: SystemTheme.colors.onSurfaceVariant,
      }}
    >
      <Tab.Screen 
        name="FitnessHome" 
        component={FitnessHome} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <TerminalText style={{ color, fontSize: 16 }}>{focused ? '[HOME]' : 'HOME'}</TerminalText>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="ExerciseLibrary" 
        component={ExerciseLibrary} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <TerminalText style={{ color, fontSize: 16 }}>{focused ? '[LIB]' : 'LIB'}</TerminalText>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Programs" 
        component={Programs} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <TerminalText style={{ color, fontSize: 16 }}>{focused ? '[PROG]' : 'PROG'}</TerminalText>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="WorkoutHistory" 
        component={WorkoutHistory} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <TerminalText style={{ color, fontSize: 16 }}>{focused ? '[LOG]' : 'LOG'}</TerminalText>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="PRTracker" 
        component={PRTracker} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <TerminalText style={{ color, fontSize: 16 }}>{focused ? '[KILLS]' : 'KILLS'}</TerminalText>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(3, 8, 12, 0.95)',
    borderTopWidth: 1,
    borderTopColor: SystemTheme.colors.primaryDim,
    height: hp(8), // Make it thick enough
    paddingBottom: hp(1),
    paddingTop: hp(1),
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  }
});
