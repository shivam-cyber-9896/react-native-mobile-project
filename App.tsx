/**
 * App.tsx
 * App Entry Point for Personal Finance App.
 */
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {configureGoogleSignIn} from './android/src/services/authService';
import {RootNavigator} from './android/src/navigation/RootNavigator';

function App() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}

export default App;
