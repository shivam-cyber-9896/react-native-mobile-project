/**
 * Styles for ProfileScreen
 */
import {StyleSheet} from 'react-native';
import {ThemeColors} from './theme';

export const makeProfileStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    content: {
      padding: 20,
      paddingBottom: 48,
    },
    title: {
      fontSize: 26,
      fontWeight: '800' as const,
      color: c.text,
      marginBottom: 24,
      letterSpacing: -0.5,
    },
    // Avatar
    avatarSection: {
      alignItems: 'center' as const,
      marginBottom: 28,
    },
    avatarWrapper: {
      position: 'relative' as const,
      marginBottom: 12,
    },
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: c.accent,
    },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: c.accent,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderWidth: 3,
      borderColor: c.surface,
    },
    avatarInitials: {
      fontSize: 32,
      fontWeight: '800' as const,
      color: '#FFFFFF',
    },
    cameraBadge: {
      position: 'absolute' as const,
      bottom: 0,
      right: 0,
      backgroundColor: c.surface,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderWidth: 2,
      borderColor: c.border,
    },
    cameraBadgeIcon: {
      fontSize: 14,
    },
    userName: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: c.text,
    },
    userEmail: {
      fontSize: 14,
      color: c.textSub,
      marginTop: 2,
    },
    // Info cards
    infoCard: {
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: c.border,
    },
    cardHeader: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: c.textSub,
      textTransform: 'uppercase' as const,
      letterSpacing: 1,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    infoLabel: {
      fontSize: 14,
      color: c.textSub,
      fontWeight: '500' as const,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: c.text,
    },
    divider: {
      height: 1,
      backgroundColor: c.border,
      marginVertical: 14,
    },
    statusBadge: {
      backgroundColor: c.incomeLight,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: c.income,
    },
    // Theme toggle row inside settings card
    themeRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    themeLabel: {
      fontSize: 14,
      color: c.textSub,
      fontWeight: '500' as const,
    },
    themeToggleBtn: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.surfaceHigh,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 7,
      gap: 6,
      borderWidth: 1,
      borderColor: c.border,
    },
    themeToggleText: {
      fontSize: 13,
      fontWeight: '700' as const,
      color: c.text,
    },
    themeToggleEmoji: {
      fontSize: 16,
    },
    // Sign out
    signOutBtn: {
      backgroundColor: c.expenseLight,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center' as const,
      marginTop: 12,
      borderWidth: 1,
      borderColor: c.expense,
    },
    signOutText: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: c.expense,
    },
  });
