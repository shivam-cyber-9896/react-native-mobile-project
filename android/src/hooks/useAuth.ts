/**
 * useAuth Hook
 * Wraps Firebase's onAuthStateChanged listener.
 * Returns the current Firebase user (null when signed out).
 */
import {useState, useEffect} from 'react';
import {getAuth} from '@react-native-firebase/auth';
import type {FirebaseAuthTypes} from '@react-native-firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // onAuthStateChanged fires immediately with current auth state,
    // then again whenever the user signs in or out.
    const unsubscribe = getAuth().onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup: remove the listener when component unmounts
    return unsubscribe;
  }, [initializing]);

  return {user, initializing};
}
