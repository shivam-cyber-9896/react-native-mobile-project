/**
 * Styles for AddTransactionScreen
 * Uses ThemeColors passed in at runtime so styles react to theme changes.
 */
import {StyleSheet} from 'react-native';
import {ThemeColors} from './theme';

export const makeAddTransactionStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    content: {
      padding: 20,
      paddingBottom: 48,
    },
    // ── Header ─────────────────────────────────────────────────────────────
    headerRow: {
      marginBottom: 20,
    },
    title: {
      fontSize: 26,
      fontWeight: '800' as const,
      color: c.text,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 13,
      color: c.textSub,
      marginTop: 2,
    },
    // ── Toggle ─────────────────────────────────────────────────────────────
    toggleRow: {
      flexDirection: 'row',
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: 4,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: c.border,
    },
    toggleBtn: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 13,
      alignItems: 'center',
    },
    toggleBtnExpenseActive: {
      backgroundColor: c.expense,
      elevation: 4,
      shadowColor: c.expense,
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.4,
      shadowRadius: 6,
    },
    toggleBtnIncomeActive: {
      backgroundColor: c.income,
      elevation: 4,
      shadowColor: c.income,
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.4,
      shadowRadius: 6,
    },
    toggleText: {
      fontSize: 15,
      fontWeight: '700' as const,
      color: c.textMuted,
    },
    toggleTextActive: {
      color: '#FFFFFF',
    },
    // ── Amount Card ─────────────────────────────────────────────────────────
    amountCard: {
      backgroundColor: c.surface,
      borderRadius: 20,
      padding: 20,
      marginBottom: 28,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center' as const,
    },
    amountLabel: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: c.textSub,
      textTransform: 'uppercase' as const,
      letterSpacing: 1.2,
      marginBottom: 8,
    },
    amountSection: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 4,
    },
    currencySymbol: {
      fontSize: 36,
      fontWeight: '700' as const,
      color: c.textSub,
    },
    amountInput: {
      fontSize: 52,
      fontWeight: '800' as const,
      color: c.text,
      minWidth: 120,
      textAlign: 'center' as const,
      padding: 0,
    },
    // ── Labels ──────────────────────────────────────────────────────────────
    label: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: c.textSub,
      textTransform: 'uppercase' as const,
      letterSpacing: 1,
      marginBottom: 12,
    },
    // ── Category Grid ────────────────────────────────────────────────────────
    categoryGrid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: 10,
      marginBottom: 24,
    },
    categoryChip: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 6,
      backgroundColor: c.surface,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: 1.5,
      borderColor: c.border,
    },
    categoryChipActive: {
      borderColor: c.accent,
      backgroundColor: c.accentBg,
      elevation: 3,
    },
    categoryEmoji: {
      fontSize: 18,
    },
    categoryName: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: c.textMuted,
    },
    categoryNameActive: {
      color: c.accent,
    },
    // ── Note ────────────────────────────────────────────────────────────────
    noteInput: {
      backgroundColor: c.surface,
      borderRadius: 14,
      padding: 16,
      fontSize: 15,
      color: c.text,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 24,
      minHeight: 60,
      textAlignVertical: 'top' as const,
    },
    // ── Date Row ─────────────────────────────────────────────────────────────
    dateRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      backgroundColor: c.surface,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 32,
    },
    dateLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: c.textSub,
    },
    dateValue: {
      fontSize: 14,
      fontWeight: '700' as const,
      color: c.text,
    },
    // ── Save Button ──────────────────────────────────────────────────────────
    saveBtn: {
      paddingVertical: 18,
      borderRadius: 18,
      alignItems: 'center' as const,
      elevation: 5,
    },
    saveBtnExpense: {
      backgroundColor: c.expense,
      shadowColor: c.expense,
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.45,
      shadowRadius: 10,
    },
    saveBtnIncome: {
      backgroundColor: c.income,
      shadowColor: c.income,
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.45,
      shadowRadius: 10,
    },
    saveBtnDisabled: {
      opacity: 0.5,
    },
    saveBtnText: {
      fontSize: 17,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    // ── PDF ─────────────────────────────────────────────────────────────────
    pdfContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.accentBg,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: c.accent,
      marginBottom: 20,
    },
    pdfIcon: {
      fontSize: 20,
      marginRight: 10,
    },
    pdfName: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600' as const,
      color: c.text,
    },
    pdfRemoveBtn: {
      padding: 4,
    },
    pdfRemoveText: {
      fontSize: 16,
      color: c.expense,
      fontWeight: '700' as const,
    },
    pdfAttachBtn: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: c.surface,
      borderRadius: 14,
      padding: 18,
      borderWidth: 1.5,
      borderStyle: 'dashed' as const,
      borderColor: c.border,
      marginBottom: 20,
      gap: 8,
    },
    pdfAttachIcon: {
      fontSize: 18,
    },
    pdfAttachText: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: c.textSub,
    },
    uploadingContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: 16,
      gap: 10,
      backgroundColor: c.accentBg,
      borderRadius: 12,
      padding: 12,
    },
    uploadingText: {
      fontSize: 13,
      color: c.accent,
      fontWeight: '600' as const,
    },
  });
