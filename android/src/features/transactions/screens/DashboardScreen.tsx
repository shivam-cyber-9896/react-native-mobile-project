/**
 * DashboardScreen
 * Shows monthly income/expense/balance, weekly bar chart, and top categories.
 * Uses useFocusEffect to refresh data when screen comes into view.
 */
import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getAuth} from '@react-native-firebase/auth';
import {useTheme} from '../../../hooks/useTheme';
import {makeDashboardStyles} from '../../../styles/dashboardStyles';
import {
  getTransactions,
  Transaction,
  CATEGORY_ICONS,
} from '../../../services/transactionService';

export default function DashboardScreen() {
  const {theme} = useTheme();
  const styles = useMemo(() => makeDashboardStyles(theme), [theme]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const user = getAuth().currentUser;
    if (!user) return;
    const data = await getTransactions(user.uid);
    setTransactions(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const now = new Date();

  // ── Monthly Stats ──────────────────────────────────────────────────────
  const monthStats = useMemo(() => {
    const thisMonth = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const income = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return {income, expense, balance: income - expense};
  }, [transactions, now]);

  // ── Weekly Chart ───────────────────────────────────────────────────────
  const weekData = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days: {label: string; expense: number; income: number}[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const dayTxns = transactions.filter(t => {
        const td = new Date(t.date);
        return td >= dayStart && td < dayEnd;
      });
      days.push({
        label: dayNames[d.getDay()],
        expense: dayTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        income: dayTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      });
    }
    return days;
  }, [transactions]);

  const maxWeekValue = useMemo(() => {
    const allVals = weekData.flatMap(d => [d.expense, d.income]);
    return Math.max(...allVals, 1);
  }, [weekData]);

  // ── Top Categories ─────────────────────────────────────────────────────
  const topCategories = useMemo(() => {
    const catMap: Record<string, number> = {};
    transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
    return Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([category, amount]) => ({category, amount}));
  }, [transactions, now]);

  const totalExpenseForBar = useMemo(
    () => topCategories.reduce((s, c) => s + c.amount, 0) || 1,
    [topCategories],
  );

  const monthName = now.toLocaleString('default', {month: 'long'});

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.accent}
          colors={[theme.accent]}
        />
      }>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />

      {/* Header */}
      <Text style={styles.greeting}>
        Hello, {getAuth().currentUser?.displayName?.split(' ')[0] || 'there'} 👋
      </Text>
      <Text style={styles.subtitle}>{monthName} Overview</Text>

      {/* Summary Cards */}
      <View style={styles.cardRow}>
        <View style={[styles.card, styles.incomeCard]}>
          <Text style={styles.cardLabel}>Income</Text>
          <Text style={[styles.cardValue, {color: theme.income}]}>
            ₹{monthStats.income.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={[styles.card, styles.expenseCard]}>
          <Text style={styles.cardLabel}>Expense</Text>
          <Text style={[styles.cardValue, {color: theme.expense}]}>
            ₹{monthStats.expense.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Monthly Balance</Text>
        <Text style={[styles.balanceValue, {color: monthStats.balance >= 0 ? theme.income : theme.expense}]}>
          {monthStats.balance >= 0 ? '+' : ''}₹{Math.abs(monthStats.balance).toLocaleString('en-IN')}
        </Text>
      </View>

      {/* Weekly Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Last 7 Days</Text>
        <View style={styles.chartContainer}>
          {weekData.map((day, i) => (
            <View key={i} style={styles.chartColumn}>
              <View style={styles.barContainer}>
                <View
                  style={[styles.bar, styles.incomeBar, {
                    height: Math.max((day.income / maxWeekValue) * 80, day.income > 0 ? 4 : 0),
                  }]}
                />
                <View
                  style={[styles.bar, styles.expenseBar, {
                    height: Math.max((day.expense / maxWeekValue) * 80, day.expense > 0 ? 4 : 0),
                  }]}
                />
              </View>
              <Text style={styles.chartLabel}>{day.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: theme.income}]} />
            <Text style={styles.legendText}>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: theme.expense}]} />
            <Text style={styles.legendText}>Expense</Text>
          </View>
        </View>
      </View>

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Spending</Text>
          {topCategories.map((cat, i) => (
            <View key={i} style={styles.catRow}>
              <Text style={styles.catEmoji}>
                {CATEGORY_ICONS[cat.category as keyof typeof CATEGORY_ICONS] || '📌'}
              </Text>
              <View style={styles.catInfo}>
                <View style={styles.catHeader}>
                  <Text style={styles.catName}>{cat.category}</Text>
                  <Text style={styles.catAmount}>₹{cat.amount.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.catBarBg}>
                  <View style={[styles.catBarFill, {width: `${(cat.amount / totalExpenseForBar) * 100}%`}]} />
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {transactions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyTitle}>No transactions yet</Text>
          <Text style={styles.emptyText}>Tap the "+" tab to add your first transaction</Text>
        </View>
      )}

      <View style={{height: 32}} />
    </ScrollView>
  );
}
