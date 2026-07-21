/**
 * AddTransactionScreen
 * Form to add income/expense transactions with category selection.
 * Uses useTheme() for light/dark support and styles from addTransactionStyles.ts
 */
import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {getAuth} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {pick, types} from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import {uploadFileToStorage} from '../../../services/firebaseConfig';
import {useTheme} from '../../../hooks/useTheme';
import {makeAddTransactionStyles} from '../../../styles/addTransactionStyles';
import {
  addTransaction,
  TransactionType,
  Category,
  CATEGORY_ICONS,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../../../services/transactionService';

export default function AddTransactionScreen() {
  const navigation = useNavigation();
  const {theme, isDark} = useTheme();
  const styles = useMemo(() => makeAddTransactionStyles(theme), [theme]);

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [pdfLocalUri, setPdfLocalUri] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // ── PDF Picker ──────────────────────────────────────────────────────────
  const handlePickPDF = async () => {
    try {
      const result = await pick({type: [types.pdf]});

      if (result && result.length > 0) {
        const file = result[0];
        const safeName = (file.name || `receipt_${Date.now()}.pdf`)
          .replace(/[^a-zA-Z0-9._-]/g, '_');

        // Copy from content:// → file:// so Android background worker can access it
        const destPath = `${RNFS.CachesDirectoryPath}/${safeName}`;
        await RNFS.copyFile(file.uri, destPath);

        setPdfLocalUri(`file://${destPath}`);
        setPdfName(file.name || 'receipt.pdf');
      }
    } catch (error: any) {
      const msg: string = error?.message || '';
      if (msg.includes('cancel') || msg.includes('cancelled') || error?.code?.includes('CANCEL')) {
        return;
      }
      Alert.alert('Error', msg || 'Failed to pick document.');
    }
  };

  const handleRemovePDF = () => {
    setPdfLocalUri(null);
    setPdfName(null);
  };

  // ── Type Toggle ─────────────────────────────────────────────────────────
  const handleTypeSwitch = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'expense' ? 'Food' : 'Salary');
  };

  // ── Save Transaction ────────────────────────────────────────────────────
  const handleSave = async () => {
    const user = getAuth().currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be signed in to add transactions.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive amount.');
      return;
    }

    try {
      setSaving(true);
      let uploadedUrl: string | undefined = undefined;

      if (pdfLocalUri) {
        setUploading(true);
        const fileName = pdfName || `receipt_${Date.now()}.pdf`;
        const storagePath = `receipts/${user.uid}/${Date.now()}_${fileName}`;

        try {
          uploadedUrl = await uploadFileToStorage(storagePath, pdfLocalUri);
        } catch (uploadError: any) {
          setUploading(false);
          Alert.alert(
            'Receipt Upload Failed',
            uploadError?.message || 'Could not upload PDF receipt to Firebase Storage. Transaction will be saved without attachment.',
          );
        }
        setUploading(false);

        try {
          await RNFS.unlink(pdfLocalUri.replace('file://', ''));
        } catch (_e) { /* ignore cleanup errors */ }
      }

      await addTransaction(user.uid, {
        amount: numAmount,
        category,
        note: note.trim(),
        type,
        date: new Date().toISOString(),
        pdfUri: uploadedUrl,
        pdfName: pdfName || undefined,
      });

      setAmount('');
      setNote('');
      setCategory(type === 'expense' ? 'Food' : 'Salary');
      setPdfLocalUri(null);
      setPdfName(null);

      Alert.alert('Success ✅', 'Transaction added successfully!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error: any) {
      setUploading(false);
      Alert.alert('Error', error?.message || 'Failed to save transaction.');
    } finally {
      setSaving(false);
    }
  };

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />
      <ScrollView contentContainerStyle={styles.content}>

        {/* Screen Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>New Transaction</Text>
          <Text style={styles.subtitle}>Record your income or expense</Text>
        </View>

        {/* Type Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, type === 'expense' && styles.toggleBtnExpenseActive]}
            onPress={() => handleTypeSwitch('expense')}
            activeOpacity={0.8}>
            <Text style={[styles.toggleText, type === 'expense' && styles.toggleTextActive]}>
              💸 Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, type === 'income' && styles.toggleBtnIncomeActive]}
            onPress={() => handleTypeSwitch('income')}
            activeOpacity={0.8}>
            <Text style={[styles.toggleText, type === 'income' && styles.toggleTextActive]}>
              💰 Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount</Text>
          <View style={styles.amountSection}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              maxLength={10}
            />
          </View>
        </View>

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
              onPress={() => setCategory(cat)}
              activeOpacity={0.7}>
              <Text style={styles.categoryEmoji}>{CATEGORY_ICONS[cat]}</Text>
              <Text style={[styles.categoryName, category === cat && styles.categoryNameActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note */}
        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Add a note..."
          placeholderTextColor={theme.textMuted}
          value={note}
          onChangeText={setNote}
          multiline
          maxLength={100}
        />

        {/* PDF Attachment */}
        <Text style={styles.label}>Receipt PDF (optional)</Text>
        {pdfName ? (
          <View style={styles.pdfContainer}>
            <Text style={styles.pdfIcon}>📄</Text>
            <Text style={styles.pdfName} numberOfLines={1}>{pdfName}</Text>
            <TouchableOpacity
              style={styles.pdfRemoveBtn}
              onPress={handleRemovePDF}
              disabled={saving || uploading}>
              <Text style={styles.pdfRemoveText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.pdfAttachBtn}
            onPress={handlePickPDF}
            disabled={saving || uploading}>
            <Text style={styles.pdfAttachIcon}>📎</Text>
            <Text style={styles.pdfAttachText}>Attach PDF Receipt</Text>
          </TouchableOpacity>
        )}

        {uploading && (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="small" color={theme.accent} />
            <Text style={styles.uploadingText}>Uploading receipt to cloud…</Text>
          </View>
        )}

        {/* Date */}
        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>📅  Date</Text>
          <Text style={styles.dateValue}>
            {new Date().toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            type === 'income' ? styles.saveBtnIncome : styles.saveBtnExpense,
            saving && styles.saveBtnDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>
            {saving ? 'Saving…' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
