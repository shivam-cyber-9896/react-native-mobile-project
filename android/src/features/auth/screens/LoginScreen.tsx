/**
 * LoginScreen
 * Premium branded login screen with Google Sign-In button.
 */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import {signInWithGoogle} from '../../../services/authService';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // Navigation happens automatically via RootNavigator when auth state changes
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      Alert.alert(
        'Sign-In Failed',
        error?.message || 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Top decorative gradient area */}
      <View style={styles.heroSection}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>💰</Text>
        </View>
        <Text style={styles.appName}>FinTrack</Text>
        <Text style={styles.tagline}>
          Smart money management{'\n'}at your fingertips
        </Text>
      </View>

      {/* Features showcase */}
      <View style={styles.featuresSection}>
        <View style={styles.featureRow}>
          <View style={styles.featureDot} />
          <Text style={styles.featureText}>Track income & expenses</Text>
        </View>
        <View style={styles.featureRow}>
          <View style={[styles.featureDot, {backgroundColor: '#10B981'}]} />
          <Text style={styles.featureText}>Visual spending insights</Text>
        </View>
        <View style={styles.featureRow}>
          <View style={[styles.featureDot, {backgroundColor: '#F59E0B'}]} />
          <Text style={styles.featureText}>Category-wise breakdown</Text>
        </View>
      </View>

      {/* Sign In Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.googleBtn, loading && styles.googleBtnDisabled]}
          onPress={handleGoogleSignIn}
          disabled={loading}
          activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleBtnText}>Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By signing in, you agree to our Terms of Service
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(33, 150, 243, 0.3)',
  },
  iconEmoji: {
    fontSize: 44,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    paddingHorizontal: 48,
    paddingBottom: 40,
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  featureText: {
    fontSize: 15,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  bottomSection: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    gap: 12,
    elevation: 4,
    shadowColor: '#2196F3',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  googleBtnDisabled: {
    opacity: 0.7,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
    borderRadius: 8,
    overflow: 'hidden',
  },
  googleBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 16,
    textAlign: 'center',
  },
});
