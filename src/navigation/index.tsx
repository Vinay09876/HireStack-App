import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { JobsListScreen } from '../screens/JobsListScreen';
import { SavedJobsScreen } from '../screens/SavedJobsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { JobDetailScreen } from '../screens/JobDetailScreen';
import type { RootStackParamList, TabParamList } from './types';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, string> = {
  JobsList: '🔎',
  Saved: '★',
  Profile: '👤',
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: () => <Text>{TAB_ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="JobsList" component={JobsListScreen} options={{ title: 'Jobs' }} />
      <Tab.Screen name="Saved" component={SavedJobsScreen} options={{ title: 'Saved' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export const RootNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="JobDetail"
        component={JobDetailScreen}
        options={{ title: 'Job Details', headerStyle: { backgroundColor: colors.surface } }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
