import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import ModeSelect from '../screens/ModeSelect';

import FitnessTabNavigator from './FitnessTabNavigator';

// Standalone Fitness Screens (not in tabs)
import ExerciseDetail from '../screens/fitness/ExerciseDetail';
import ProgramDetail from '../screens/fitness/ProgramDetail';
import ActiveProgram from '../screens/fitness/ActiveProgram';
import CustomProgramBuilder from '../screens/fitness/CustomProgramBuilder';
import WorkoutSession from '../screens/fitness/WorkoutSession';
import SessionSummary from '../screens/fitness/SessionSummary';
import SessionDetail from '../screens/fitness/SessionDetail';
import ShadowArmy from '../screens/fitness/ShadowArmy';
import BodyStats from '../screens/fitness/BodyStats';

// Task & Monarch
import TaskHome from '../screens/tasks/TaskHome';
import MonarchHome from '../screens/monarch/MonarchHome';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ModeSelect"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#0a0e1a' },
        }}
      >
        <Stack.Screen name="ModeSelect" component={ModeSelect} />
        
        {/* Fitness Module */}
        <Stack.Screen name="FitnessTabs" component={FitnessTabNavigator} />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetail} />
        <Stack.Screen name="ProgramDetail" component={ProgramDetail} />
        <Stack.Screen name="ActiveProgram" component={ActiveProgram} />
        <Stack.Screen name="CustomProgramBuilder" component={CustomProgramBuilder} />
        <Stack.Screen name="WorkoutSession" component={WorkoutSession} />
        <Stack.Screen name="SessionSummary" component={SessionSummary} />
        <Stack.Screen name="SessionDetail" component={SessionDetail} />
        <Stack.Screen name="ShadowArmy" component={ShadowArmy} />
        <Stack.Screen name="BodyStats" component={BodyStats} />

        {/* Task & Monarch Modules */}
        <Stack.Screen name="TaskHome" component={TaskHome} />
        <Stack.Screen name="MonarchHome" component={MonarchHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
