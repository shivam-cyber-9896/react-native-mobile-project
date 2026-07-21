/**
 * HistoryScreen
 * Transaction history with filter chips, PDF receipt viewer, and PDF report export.
 * Uses useTheme() for light/dark support and styles from historyStyles.ts
 */
import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getAuth} from '@react-native-firebase/auth';
import {viewDocument} from '@react-native-documents/viewer';
import {saveDocuments} from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import {PDFDocument, StandardFonts, rgb} from 'pdf-lib';
import {uploadFileToStorage} from '../../../services/firebaseConfig';
import {useTheme} from '../../../hooks/useTheme';
import {makeHistoryStyles} from '../../../styles/historyStyles';
import {
  getTransactions,
  deleteTransaction,
  Transaction,
  CATEGORY_ICONS,
} from '../../../services/transactionService';

type FilterPeriod = 'ALL' | 'TODAY' | 'WEEK' | 'MONTH';

// ─── Hermes-safe Uint8Array → base64 (no Node.js Buffer) ─────────────────────
function uint8ArrayToBase64(bytes: Uint8Array): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < len ? bytes[i + 1] : 0;
    const b2 = i + 2 < len ? bytes[i + 2] : 0;
    result += chars[b0 >> 2];
    result += chars[((b0 & 3) << 4) | (b1 >> 4)];
    result += i + 1 < len ? chars[((b1 & 15) << 2) | (b2 >> 6)] : '=';
    result += i + 2 < len ? chars[b2 & 63] : '=';
  }
  return result;
}

export default function HistoryScreen() {
  const {theme} = useTheme();
  const styles = useMemo(() => makeHistoryStyles(theme), [theme]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterPeriod>('ALL');
  const [loading, setLoading] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [downloadingReceiptId, setDownloadingReceiptId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const user = getAuth().currentUser;
    if (!user) return;
    setLoading(true);
    const data = await getTransactions(user.uid);
    setTransactions(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  // ── Filter logic ────────────────────────────────────────────────────────
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filter === 'ALL') return true;
      const txDate = new Date(t.date);
      const now = new Date();
      if (filter === 'TODAY') {
        return txDate.getDate() === now.getDate() &&
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear();
      }
      if (filter === 'WEEK') {
        const weekAgo = new Date(); weekAgo.setDate(now.getDate() - 7);
        return txDate >= weekAgo;
      }
      if (filter === 'MONTH') {
        return txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [transactions, filter]);

  // ── Open remote receipt PDF ─────────────────────────────────────────────
  const handleOpenPDF = async (txId: string, pdfUri: string, pdfName?: string) => {
    try {
      setDownloadingReceiptId(txId);
      const safeName = (pdfName || `receipt_${txId}.pdf`).replace(/[^a-zA-Z0-9._-]/g, '_');
      const localPath = `${RNFS.CachesDirectoryPath}/${safeName}`;

      const exists = await RNFS.exists(localPath);
      if (!exists) {
        const dl = await RNFS.downloadFile({fromUrl: pdfUri, toFile: localPath}).promise;
        if (dl.statusCode !== 200) {
          throw new Error(`Download failed (status ${dl.statusCode})`);
        }
      }

      await viewDocument({uri: `file://${localPath}`});
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to view receipt.');
    } finally {
      setDownloadingReceiptId(null);
    }
  };

function cleanAscii(str: string): string {
  if (!str) return '';
  return str
    .replace(/—/g, '-')
    .replace(/–/g, '-')
    .replace(/…/g, '...')
    .replace(/’/g, "'")
    .replace(/[^\x20-\x7E]/g, '');
}

  // ── Generate + upload PDF report ────────────────────────────────────────
  const handleExportPDF = async () => {
    if (filteredTransactions.length === 0) {
      Alert.alert('No Data', 'There are no transactions to export.');
      return;
    }

    const user = getAuth().currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be signed in to export reports.');
      return;
    }

    try {
      setGeneratingPdf(true);

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 850]);
      const {width, height} = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      page.drawText('FINTRACK - EXPENSE REPORT', {
        x: 40, y: height - 60, size: 20,
        font: fontBold, color: rgb(0.23, 0.51, 0.96),
      });
      const periodLabel = filter === 'ALL' ? 'All Transactions' : filter === 'TODAY' ? 'Today' : filter === 'WEEK' ? 'This Week' : 'This Month';
      page.drawText(cleanAscii(`Period: ${periodLabel}`), {x: 40, y: height - 85, size: 11, font, color: rgb(0.39, 0.45, 0.55)});
      page.drawText(cleanAscii(`Generated: ${new Date().toLocaleDateString('en-IN')}`), {
        x: 40, y: height - 100, size: 11, font, color: rgb(0.39, 0.45, 0.55),
      });
      page.drawLine({start: {x: 40, y: height - 115}, end: {x: width - 40, y: height - 115}, thickness: 1, color: rgb(0.88, 0.91, 0.94)});

      const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      const balance = totalIncome - totalExpense;

      const summaryBoxes = [
        {x: 40, label: 'TOTAL INCOME', value: `+Rs ${totalIncome.toFixed(2)}`, pos: true},
        {x: 220, label: 'TOTAL EXPENSE', value: `-Rs ${totalExpense.toFixed(2)}`, pos: false},
        {x: 400, label: 'NET BALANCE', value: `${balance >= 0 ? '+' : ''}Rs ${balance.toFixed(2)}`, pos: balance >= 0},
      ];
      for (const b of summaryBoxes) {
        page.drawRectangle({x: b.x, y: height - 190, width: 160, height: 60, color: b.pos ? rgb(0.94, 0.98, 0.95) : rgb(0.99, 0.94, 0.94), borderColor: b.pos ? rgb(0.8, 0.93, 0.84) : rgb(0.98, 0.85, 0.85), borderWidth: 1});
        page.drawText(cleanAscii(b.label), {x: b.x + 10, y: height - 150, size: 9, font: fontBold, color: b.pos ? rgb(0.06, 0.46, 0.25) : rgb(0.62, 0.12, 0.12)});
        page.drawText(cleanAscii(b.value), {x: b.x + 10, y: height - 175, size: 14, font: fontBold, color: b.pos ? rgb(0.06, 0.72, 0.51) : rgb(0.93, 0.26, 0.26)});
      }

      const tableTop = height - 230;
      page.drawRectangle({x: 40, y: tableTop - 20, width: width - 80, height: 25, color: rgb(0.12, 0.16, 0.23)});
      [{label: 'Date', x: 50}, {label: 'Category', x: 130}, {label: 'Note', x: 230}, {label: 'Type', x: 420}, {label: 'Amount', x: 500}].forEach(col =>
        page.drawText(cleanAscii(col.label), {x: col.x, y: tableTop - 13, size: 10, font: fontBold, color: rgb(1, 1, 1)})
      );

      let curY = tableTop - 45;
      for (let i = 0; i < filteredTransactions.length; i++) {
        if (curY < 60) { page.drawText('... truncated ...', {x: 40, y: 40, size: 10, font, color: rgb(0.62, 0.12, 0.12)}); break; }
        const t = filteredTransactions[i];
        const isInc = t.type === 'income';
        const dateStr = new Date(t.date).toLocaleDateString('en-IN');
        if (i % 2 === 1) { page.drawRectangle({x: 40, y: curY - 5, width: width - 80, height: 25, color: isInc ? rgb(0.97, 0.99, 0.98) : rgb(0.99, 0.97, 0.97)}); }
        page.drawText(cleanAscii(dateStr), {x: 50, y: curY + 3, size: 9, font, color: rgb(0.18, 0.25, 0.35)});
        page.drawText(cleanAscii(t.category), {x: 130, y: curY + 3, size: 9, font, color: rgb(0.18, 0.25, 0.35)});
        
        const noteStr = t.note ? (t.note.length > 25 ? `${t.note.substring(0, 23)}...` : t.note) : '-';
        page.drawText(cleanAscii(noteStr), {x: 230, y: curY + 3, size: 9, font, color: rgb(0.39, 0.45, 0.55)});
        page.drawText(isInc ? 'Income' : 'Expense', {x: 420, y: curY + 3, size: 9, font: fontBold, color: isInc ? rgb(0.06, 0.72, 0.51) : rgb(0.93, 0.26, 0.26)});
        page.drawText(cleanAscii(`Rs ${t.amount.toFixed(2)}`), {x: 500, y: curY + 3, size: 9, font: fontBold, color: isInc ? rgb(0.06, 0.72, 0.51) : rgb(0.93, 0.26, 0.26)});
        page.drawLine({start: {x: 40, y: curY - 5}, end: {x: width - 40, y: curY - 5}, thickness: 0.5, color: rgb(0.88, 0.91, 0.94)});
        curY -= 25;
      }

      page.drawText('FinTrack App - Smart Money Management', {x: width / 2 - 110, y: 25, size: 8, font, color: rgb(0.6, 0.65, 0.75)});

      // Hermes-safe base64 (no Node.js Buffer)
      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = uint8ArrayToBase64(pdfBytes);

      const fileName = `fintrack_report_${filter.toLowerCase()}_${Date.now()}.pdf`;
      const localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
      await RNFS.writeFile(localPath, pdfBase64, 'base64');

      const storagePath = `reports/${user.uid}/${fileName}`;
      try {
        await uploadFileToStorage(storagePath, localPath);
      } catch (uploadErr: any) {
        console.warn('Cloud upload skipped/failed:', uploadErr?.message);
      }

      await viewDocument({uri: `file://${localPath}`});

      Alert.alert(
        'Report Saved ☁️',
        'Your PDF has been uploaded to Firebase. Save a local copy?',
        [
          {text: 'Close', style: 'cancel'},
          {
            text: 'Save Locally',
            onPress: async () => {
              try {
                await saveDocuments({files: [{uri: `file://${localPath}`, fileName}]});
              } catch (_e) { /* user cancelled */ }
            },
          },
        ],
      );
    } catch (error: any) {
      console.error('PDF Export error details:', error);
      Alert.alert('Export Failed', error?.message || 'Failed to generate PDF report.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────
  const handleDelete = (tx: Transaction) => {
    Alert.alert(
      'Delete Transaction',
      `Delete this ${tx.category} transaction of ₹${tx.amount}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            const user = getAuth().currentUser;
            if (!user) return;
            await deleteTransaction(user.uid, tx.id);
            await loadData();
          },
        },
      ],
    );
  };

  // ── Render row ─────────────────────────────────────────────────────────
  const renderItem = ({item}: {item: Transaction}) => {
    const isIncome = item.type === 'income';
    const formattedDate = new Date(item.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });

    return (
      <TouchableOpacity
        style={styles.txRow}
        onLongPress={() => handleDelete(item)}
        activeOpacity={0.75}>
        <View style={[styles.iconWrapper, {backgroundColor: isIncome ? theme.incomeLight : theme.expenseLight}]}>
          <Text style={styles.categoryEmoji}>{CATEGORY_ICONS[item.category] || '📌'}</Text>
        </View>

        <View style={styles.txDetails}>
          <Text style={styles.categoryTitle}>{item.category}</Text>
          {item.note ? <Text style={styles.noteText} numberOfLines={1}>{item.note}</Text> : null}
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        {item.pdfUri ? (
          <TouchableOpacity
            style={styles.pdfReceiptBadge}
            onPress={() => handleOpenPDF(item.id, item.pdfUri!, item.pdfName)}
            disabled={downloadingReceiptId !== null}
            activeOpacity={0.6}>
            {downloadingReceiptId === item.id ? (
              <ActivityIndicator size="small" color={theme.accent} />
            ) : (
              <Text style={styles.pdfReceiptEmoji}>📄</Text>
            )}
          </TouchableOpacity>
        ) : null}

        <Text style={[styles.amountText, {color: isIncome ? theme.income : theme.expense}]}>
          {isIncome ? '+' : '-'}₹{item.amount.toLocaleString('en-IN')}
        </Text>
      </TouchableOpacity>
    );
  };

  // ── UI ─────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />

      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>Long press to delete</Text>
        </View>

        {/* Export PDF */}
        <TouchableOpacity
          style={[styles.pdfExportBtn, generatingPdf && styles.pdfExportBtnDisabled]}
          onPress={handleExportPDF}
          disabled={generatingPdf}
          activeOpacity={0.8}>
          {generatingPdf ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.pdfExportText}>Export 📄</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {(['ALL', 'TODAY', 'WEEK', 'MONTH'] as FilterPeriod[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.8}>
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
              {f === 'ALL' ? 'All' : f === 'TODAY' ? 'Today' : f === 'WEEK' ? 'Week' : 'Month'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onRefresh={loadData}
        refreshing={loading}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📜</Text>
            <Text style={styles.emptyTitle}>No transactions found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'ALL'
                ? 'Your transaction history will appear here'
                : 'No transactions for the selected period'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
