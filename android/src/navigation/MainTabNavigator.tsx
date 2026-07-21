/**
 * MainTabNavigator
 * Bottom tab navigator containing Dashboard, Add, History, and Profile screens.
 * Fully theme-aware — reads from useTheme() so it reacts to dark/light toggle.
 */
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../hooks/useTheme';

import DashboardScreen from '../features/transactions/screens/DashboardScreen';
import AddTransactionScreen from '../features/transactions/screens/AddTransactionScreen';
import HistoryScreen from '../features/transactions/screens/HistoryScreen';
import ProfileScreen from '../features/transactions/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  const {theme, isDark} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        // ── Header ───────────────────────────────────────────────────────
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: theme.text,
          fontSize: 18,
        },
        headerTintColor: theme.text,

        // ── Tab Bar ───────────────────────────────────────────────────────
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -2},
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        // ── Tab Icons ─────────────────────────────────────────────────────
        tabBarIcon: ({focused, color, size}) => {
          // Special "Add" centre button
          if (route.name === 'Add') {
            return (
              <View style={[
                navStyles.addBtn,
                {
                  backgroundColor: theme.accent,
                  shadowColor: theme.accent,
                },
              ]}>
                <Ionicons name="add" size={28} color="#FFFFFF" />
              </View>
            );
          }

          let iconName: string;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          try {
            return <Ionicons name={iconName} size={size} color={color} />;
          } catch {
            const fallbackEmoji =
              route.name === 'Dashboard' ? '📊' :
              route.name === 'History'   ? '📜' : '👤';
            return <Text style={{fontSize: size - 4}}>{fallbackEmoji}</Text>;
          }
        },
      })}>

      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{title: 'Dashboard', headerShown: false}}
      />
      <Tab.Screen
        name="Add"
        component={AddTransactionScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Add',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            color: theme.accent,
            marginTop: 2,
          },
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{title: 'Transactions', headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'My Profile', headerShown: false}}
      />
    </Tab.Navigator>
  );
}

// Static styles that don't depend on theme (geometry only)
const navStyles = StyleSheet.create({
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
