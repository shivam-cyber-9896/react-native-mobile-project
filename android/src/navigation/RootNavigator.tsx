/**
 * RootNavigator
 * Listens to auth state via useAuth() and conditionally renders:
 * - LoginScreen when user is signed out
 * - MainTabNavigator when user is signed in
 * Wraps the whole tree in ThemeProvider so every screen can call useTheme().
 */
import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useAuth} from '../hooks/useAuth';
import {ThemeProvider} from '../hooks/useTheme';
import LoginScreen from '../features/auth/screens/LoginScreen';
import {MainTabNavigator} from './MainTabNavigator';

export function RootNavigator() {
  const {user, initializing} = useAuth();

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        {user ? <MainTabNavigator /> : <LoginScreen />}
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
