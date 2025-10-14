import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { TransactionCard } from '../components/TransactionCard';
import { FilterBar } from '../components/FilterBar';
import { RevenueForm } from '../components/RevenueForm';
import { ExpenseForm } from '../components/ExpenseForm';
import { WorkEntryModal } from '../components/WorkEntryModal';
import NewEntryModal from '../components/NewEntryModal';
import { EditTransactionModal } from '../components/EditTransactionModal';
import { Revenue, Expense } from '../types';

const TransactionsScreen: React.FC = () => {
  const { getFilteredRevenues, getFilteredExpenses, loadData } = useFinance();
  const { state: themeState } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'all' | 'revenues' | 'expenses'>('all');
  const [showRevenueForm, setShowRevenueForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false); // Não abrir automaticamente
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<((Revenue | Expense) & { type: 'revenue' | 'expense' }) | null>(null);

  // Carregar dados quando a tela for montada
  useEffect(() => {
    loadData();
  }, []);

  const revenues = getFilteredRevenues();
  const expenses = getFilteredExpenses();

  // Combine and sort all transactions
  const allTransactions = [
    ...revenues.map(r => ({ ...r, type: 'revenue' as const })),
    ...expenses.map(e => ({ ...e, type: 'expense' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getFilteredTransactions = () => {
    switch (activeTab) {
      case 'revenues':
        return revenues.map(r => ({ ...r, type: 'revenue' as const }));
      case 'expenses':
        return expenses.map(e => ({ ...e, type: 'expense' as const }));
      default:
        return allTransactions;
    }
  };

  const filteredTransactions = getFilteredTransactions();

  const handleEditTransaction = (transaction: (Revenue | Expense) & { type: 'revenue' | 'expense' }) => {
    setSelectedTransaction(transaction);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    loadData(); // Recarregar dados após edição
  };

  // Verificação de segurança para o tema
  if (!themeState || !themeState.colors) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }

  const styles = createStyles(themeState.colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={themeState.isDark ? "light-content" : "dark-content"} backgroundColor={themeState.colors.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Ionicons name="list-outline" size={24} color={themeState.colors.text} />
            </View>
            <View>
              <Text style={styles.title}>Lançamentos</Text>
              <Text style={styles.subtitle}>Gerencie suas receitas e gastos</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Filter Bar */}
      <FilterBar />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            {t('transactions.all')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'revenues' && styles.activeTab]}
          onPress={() => setActiveTab('revenues')}
        >
          <Text style={[styles.tabText, activeTab === 'revenues' && styles.activeTabText]}>
            {t('transactions.revenue')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
            Gastos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Buttons */}
      <View style={styles.addButtons}>
        <TouchableOpacity
          style={[styles.addButton, styles.newEntryButton]}
          onPress={() => setShowNewEntryModal(true)}
        >
          <Text style={styles.addButtonText}>+ Novo Lançamento</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addButton, styles.revenueButton]}
          onPress={() => setShowRevenueForm(true)}
        >
          <Text style={styles.addButtonText}>+ {t('transactions.revenue')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addButton, styles.expenseButton]}
          onPress={() => setShowExpenseForm(true)}
        >
          <Text style={styles.addButtonText}>+ Gasto</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {t('transactions.noTransactions')}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Adicione suas primeiras receitas e gastos
            </Text>
          </View>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <TransactionCard
              key={`${transaction.type}-${transaction.id}`}
              transaction={transaction}
              onEdit={handleEditTransaction}
            />
          ))
        )}

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Forms */}
      <NewEntryModal
        isVisible={showNewEntryModal}
        onClose={() => setShowNewEntryModal(false)}
        onSuccess={() => {
          loadData(); // Recarregar dados após sucesso
        }}
      />
      <RevenueForm
        isVisible={showRevenueForm}
        onClose={() => setShowRevenueForm(false)}
      />
      <ExpenseForm
        isVisible={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
      />
      <WorkEntryModal
        isVisible={showWorkModal}
        onClose={() => setShowWorkModal(false)}
      />
      <EditTransactionModal
        isVisible={showEditModal}
        transaction={selectedTransaction}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTransaction(null);
        }}
        onSuccess={handleEditSuccess}
      />
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: '#ffffff',
  },
  addButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  newEntryButton: {
    backgroundColor: colors.primary,
  },
  revenueButton: {
    backgroundColor: colors.success,
  },
  expenseButton: {
    backgroundColor: colors.error,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 120,
  },
});

export default TransactionsScreen;
