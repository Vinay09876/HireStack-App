import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity } from 'react-native';
import { JobsListScreen } from '../screens/JobsListScreen';
import { SavedJobsScreen } from '../screens/SavedJobsScreen';
import { JobAlertsScreen } from '../screens/JobAlertsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { JobDetailScreen } from '../screens/JobDetailScreen';
import type { RootStackParamList, TabParamList } from './types';
import { useAppTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, string> = {
  JobsList: '🔎',
  Saved: '★',
  Alerts: '🔔',
  Profile: '👤',
};

// The star glyph renders in the system's default text color instead of an
// emoji's fixed color, so it needs the tab's tint color passed in explicitly
// or it stays black and disappears against a dark background.
const TINTED_ICONS: (keyof TabParamList)[] = ['Saved'];

function ThemeToggleButton() {
  const { theme, toggleTheme } = useAppTheme();
  return (
    <TouchableOpacity onPress={toggleTheme} accessibilityLabel="Toggle dark mode" style={{ paddingHorizontal: 12 }}>
      <Text style={{ fontSize: 18 }}>{theme === 'dark' ? '☀️' : '🌙'}</Text>
    </TouchableOpacity>
  );
}

function Tabs() {
  const { colors } = useAppTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        headerRight: () => <ThemeToggleButton />,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, focused }) =>
          TINTED_ICONS.includes(route.name) ? (
            <Text style={{ color, fontSize: 16 }}>{TAB_ICONS[route.name]}</Text>
          ) : (
            <Text style={{ opacity: focused ? 1 : 0.6 }}>{TAB_ICONS[route.name]}</Text>
          ),
      })}
    >
      <Tab.Screen name="JobsList" component={JobsListScreen} options={{ title: 'Jobs' }} />
      <Tab.Screen name="Saved" component={SavedJobsScreen} options={{ title: 'Saved' }} />
      <Tab.Screen name="Alerts" component={JobAlertsScreen} options={{ title: 'Alerts' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export const RootNavigator: React.FC = () => {
  const { theme, colors } = useAppTheme();
  const navTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      theme={{
        ...navTheme,
        colors: { ...navTheme.colors, background: colors.background, card: colors.surface, border: colors.border, text: colors.text, primary: colors.primary },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="JobDetail"
          component={JobDetailScreen}
          options={{
            title: 'Job Details',
            headerStyle: { backgroundColor: colors.surface },
            headerTitleStyle: { color: colors.text },
            headerTintColor: colors.primary,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
