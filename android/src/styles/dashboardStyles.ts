/**
 * Styles for DashboardScreen
 */
import {StyleSheet} from 'react-native';
import {ThemeColors} from './theme';

export const makeDashboardStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    content: {
      padding: 20,
    },
    greeting: {
      fontSize: 26,
      fontWeight: '800' as const,
      color: c.text,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 15,
      color: c.textSub,
      marginTop: 4,
      marginBottom: 24,
    },
    // Summary cards
    cardRow: {
      flexDirection: 'row' as const,
      gap: 12,
      marginBottom: 12,
    },
    card: {
      flex: 1,
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.06,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: c.border,
    },
    incomeCard: {
      borderLeftWidth: 4,
      borderLeftColor: c.income,
    },
    expenseCard: {
      borderLeftWidth: 4,
      borderLeftColor: c.expense,
    },
    cardLabel: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: c.textSub,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
    cardValue: {
      fontSize: 22,
      fontWeight: '800' as const,
      marginTop: 8,
    },
    // Balance card
    balanceCard: {
      backgroundColor: c.balanceCard,
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    balanceLabel: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: c.textSub,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
    balanceValue: {
      fontSize: 32,
      fontWeight: '800' as const,
      marginTop: 8,
    },
    // Chart section
    section: {
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      elevation: 1,
      borderWidth: 1,
      borderColor: c.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: c.text,
      marginBottom: 16,
    },
    chartContainer: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'flex-end' as const,
      height: 100,
      paddingBottom: 4,
    },
    chartColumn: {
      alignItems: 'center' as const,
      flex: 1,
    },
    barContainer: {
      flexDirection: 'row' as const,
      alignItems: 'flex-end' as const,
      gap: 3,
      height: 80,
    },
    bar: {
      width: 12,
      borderRadius: 6,
      minHeight: 0,
    },
    incomeBar: {
      backgroundColor: c.income,
    },
    expenseBar: {
      backgroundColor: c.expense,
    },
    chartLabel: {
      fontSize: 11,
      color: c.textSub,
      marginTop: 6,
      fontWeight: '600' as const,
    },
    legendRow: {
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      gap: 24,
      marginTop: 16,
    },
    legendItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      fontSize: 12,
      color: c.textSub,
      fontWeight: '500' as const,
    },
    // Top categories
    catRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 14,
      gap: 12,
    },
    catEmoji: {
      fontSize: 28,
    },
    catInfo: {
      flex: 1,
    },
    catHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginBottom: 6,
    },
    catName: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: c.text,
    },
    catAmount: {
      fontSize: 14,
      fontWeight: '700' as const,
      color: c.text,
    },
    catBarBg: {
      height: 6,
      backgroundColor: c.border,
      borderRadius: 3,
      overflow: 'hidden' as const,
    },
    catBarFill: {
      height: 6,
      backgroundColor: c.accent,
      borderRadius: 3,
    },
    // Empty state
    emptyState: {
      alignItems: 'center' as const,
      paddingVertical: 48,
    },
    emptyEmoji: {
      fontSize: 48,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: c.textSub,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: c.textMuted,
      textAlign: 'center' as const,
    },
  });
