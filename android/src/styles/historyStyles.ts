/**
 * Styles for HistoryScreen
 * Uses ThemeColors passed in at runtime so styles react to theme changes.
 */
import {StyleSheet} from 'react-native';
import {ThemeColors} from './theme';

export const makeHistoryStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    // ── Header ───────────────────────────────────────────────────────────────
    headerRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 14,
    },
    headerLeft: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 26,
      fontWeight: '800' as const,
      color: c.text,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 12,
      color: c.textMuted,
      marginTop: 2,
    },
    pdfExportBtn: {
      backgroundColor: c.accent,
      paddingVertical: 11,
      paddingHorizontal: 16,
      borderRadius: 12,
      elevation: 4,
      shadowColor: c.accent,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.4,
      shadowRadius: 8,
      minWidth: 44,
      alignItems: 'center' as const,
    },
    pdfExportBtnDisabled: {
      opacity: 0.55,
    },
    pdfExportText: {
      color: '#FFFFFF',
      fontWeight: '700' as const,
      fontSize: 13,
    },
    themeToggleBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: 8,
    },
    themeToggleText: {
      fontSize: 18,
    },
    // ── Filter Chips ─────────────────────────────────────────────────────────
    filterRow: {
      flexDirection: 'row' as const,
      paddingHorizontal: 20,
      gap: 8,
      marginBottom: 16,
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
    },
    chipActive: {
      backgroundColor: c.accent,
      borderColor: c.accent,
      elevation: 3,
    },
    chipText: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: c.textSub,
    },
    chipTextActive: {
      color: '#FFFFFF',
    },
    // ── List ─────────────────────────────────────────────────────────────────
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    txRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.surface,
      padding: 16,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
    },
    iconWrapper: {
      width: 46,
      height: 46,
      borderRadius: 13,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: 14,
    },
    categoryEmoji: {
      fontSize: 22,
    },
    txDetails: {
      flex: 1,
    },
    categoryTitle: {
      fontSize: 15,
      fontWeight: '700' as const,
      color: c.text,
    },
    noteText: {
      fontSize: 13,
      color: c.textSub,
      marginTop: 2,
    },
    dateText: {
      fontSize: 11,
      color: c.textMuted,
      marginTop: 4,
    },
    amountText: {
      fontSize: 16,
      fontWeight: '800' as const,
      marginLeft: 4,
    },
    separator: {
      height: 10,
    },
    // ── Empty State ───────────────────────────────────────────────────────────
    emptyContainer: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingTop: 80,
    },
    emptyEmoji: {
      fontSize: 52,
      marginBottom: 14,
    },
    emptyTitle: {
      fontSize: 17,
      fontWeight: '700' as const,
      color: c.textSub,
      marginBottom: 6,
    },
    emptySubtitle: {
      fontSize: 13,
      color: c.textMuted,
      textAlign: 'center' as const,
      paddingHorizontal: 30,
    },
    // ── Receipt Badge ─────────────────────────────────────────────────────────
    pdfReceiptBadge: {
      backgroundColor: c.accentBg,
      padding: 8,
      borderRadius: 10,
      marginRight: 10,
      borderWidth: 1,
      borderColor: c.accent,
      minWidth: 34,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    pdfReceiptEmoji: {
      fontSize: 16,
    },
  });
