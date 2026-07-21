/**
 * Auth Service
 * Handles Google Sign-In with Firebase Authentication.
 * Configure your webClientId from Firebase Console.
 */
import {getAuth, signInWithCredential, GoogleAuthProvider, signOut as firebaseSignOut} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

/**
 * Configure Google Sign-In.
 * Call this once at app startup (in App.tsx).
 *
 * ⚠️  Replace the webClientId with YOUR web client ID from:
 *     Firebase Console → Authentication → Sign-in method → Google → Web client ID
 */
export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId:
      '56449888789-cn1uemt732p4jsjsosq0f85j3deejf7d.apps.googleusercontent.com',
  });
}

/**
 * Full Google Sign-In flow:
 * 1. Check Play Services available
 * 2. Open Google account picker
 * 3. Get tokens
 * 4. Create Firebase credential
 * 5. Sign in to Firebase
 */
export async function signInWithGoogle() {
  // Ensure Google Play Services are available
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

  // Open Google account picker UI
  await GoogleSignin.signIn();

  // Get the ID and access tokens
  const {idToken, accessToken} = await GoogleSignin.getTokens();

  if (!idToken) {
    throw new Error('No ID token received from Google Sign-In');
  }

  // Create a Firebase credential with the tokens
  const credential = GoogleAuthProvider.credential(idToken, accessToken);

  // Sign in to Firebase with the Google credential
  return signInWithCredential(getAuth(), credential);
}

/**
 * Sign out from both Firebase and Google.
 */
export async function signOut() {
  try {
    await GoogleSignin.revokeAccess();
  } catch {
    // Revoke may fail if not previously signed in — ignore
  }
  try {
    await GoogleSignin.signOut();
  } catch {
    // Ignore
  }
  await firebaseSignOut(getAuth());
}
