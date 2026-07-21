/**
 * ProfileScreen
 * Displays user details, profile photo, theme toggle, and Sign Out.
 * Theme toggle is placed here; it controls the global theme for all screens.
 */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {getAuth} from '@react-native-firebase/auth';
import {signOut} from '../../../services/authService';
import {getProfilePhoto, saveProfilePhoto} from '../../../services/transactionService';
import {useTheme} from '../../../hooks/useTheme';
import {makeProfileStyles} from '../../../styles/profileStyles';

export default function ProfileScreen() {
  const {theme, isDark, toggleTheme} = useTheme();
  const styles = useMemo(() => makeProfileStyles(theme), [theme]);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const user = getAuth().currentUser;

  const loadPhoto = useCallback(async () => {
    if (!user) return;
    const uri = await getProfilePhoto(user.uid);
    if (uri) setPhotoUri(uri);
  }, [user]);

  useEffect(() => {
    loadPhoto();
  }, [loadPhoto]);

  const handlePickPhoto = () => {
    Alert.alert('Update Profile Photo', 'Choose an option', [
      {text: 'Take Photo', onPress: openCamera},
      {text: 'Choose from Gallery', onPress: openGallery},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const openCamera = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take a profile photo.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Camera permission is required.');
        return;
      }
      const result = await launchCamera({mediaType: 'photo', quality: 0.7, saveToPhotos: false});
      if (result.didCancel || result.errorCode) return;
      const uri = result.assets?.[0]?.uri;
      if (uri && user) { setPhotoUri(uri); await saveProfilePhoto(user.uid, uri); }
    } catch (error: any) {
      Alert.alert('Camera Error', error?.message || 'Failed to open camera');
    }
  };

  const openGallery = async () => {
    try {
      const result = await launchImageLibrary({mediaType: 'photo', quality: 0.7, selectionLimit: 1});
      if (result.didCancel || result.errorCode) return;
      const uri = result.assets?.[0]?.uri;
      if (uri && user) { setPhotoUri(uri); await saveProfilePhoto(user.uid, uri); }
    } catch (error: any) {
      Alert.alert('Gallery Error', error?.message || 'Failed to open gallery');
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Sign Out', style: 'destructive', onPress: async () => { await signOut(); }},
    ]);
  };

  const displayPhoto = photoUri || user?.photoURL;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />

      <Text style={styles.title}>My Profile</Text>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickPhoto}>
          {displayPhoto ? (
            <Image source={{uri: displayPhoto}} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Text style={styles.cameraBadgeIcon}>📷</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
      </View>

      {/* Account Info */}
      <View style={styles.infoCard}>
        <Text style={styles.cardHeader}>Account Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Active ✓</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>User ID</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {user?.uid.substring(0, 12)}...
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Provider</Text>
          <Text style={styles.infoValue}>Google Auth</Text>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.infoCard}>
        <Text style={styles.cardHeader}>Appearance</Text>

        {/* Theme Toggle */}
        <View style={styles.themeRow}>
          <Text style={styles.themeLabel}>
            {isDark ? '🌙  Dark Mode' : '☀️  Light Mode'}
          </Text>
          <TouchableOpacity style={styles.themeToggleBtn} onPress={toggleTheme} activeOpacity={0.8}>
            <Text style={styles.themeToggleEmoji}>{isDark ? '☀️' : '🌙'}</Text>
            <Text style={styles.themeToggleText}>
              Switch to {isDark ? 'Light' : 'Dark'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Storage</Text>
          <Text style={styles.infoValue}>Firebase Cloud</Text>
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
