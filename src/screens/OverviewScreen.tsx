import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { PeriodTabs } from '../components/PeriodTabs';
import { DateFilterDropdown } from '../components/DateFilterDropdown';
import { DashboardData } from '../services/apiService';
import { calculateIndicators } from '../utils/indicatorsCalculator';
import { Ionicons } from '@expo/vector-icons';

const OverviewScreen: React.FC = () => {
  const { state, setPeriod, getDashboardData, setFilters } = useFinance();
  const { state: themeState } = useTheme();
  const { state: authState } = useAuth();
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificação de segurança para o tema e estado de finanças
  if (!themeState || !themeState.colors) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#64748b' }}>{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  if (!state) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#64748b' }}>{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    // Definir filtros baseados no período selecionado
    const now = new Date();
    let startDate: string;
    let endDate: string;

    switch (state.selectedPeriod) {
      case 'daily':
        startDate = now.toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
        break;
      case 'weekly':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        startDate = startOfWeek.toISOString().split('T')[0];
        endDate = endOfWeek.toISOString().split('T')[0];
        break;
      case 'monthly':
      default:
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        startDate = startOfMonth.toISOString().split('T')[0];
        endDate = endOfMonth.toISOString().split('T')[0];
        break;
    }


    // Aplicar filtros
    setFilters({
      startDate,
      endDate,
      period: state.selectedPeriod,
    });

    loadDashboardData();
  }, [state.selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (period: 'daily' | 'weekly' | 'monthly') => {
    setPeriod(period);
  };

  // Definir estilos antes de usar
  const styles = createStyles(themeState.colors);

  // Verificação de segurança para o tema
  if (!themeState || !themeState.colors) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeState.colors.background }]}>
        <StatusBar barStyle={themeState.isDark ? "light-content" : "dark-content"} backgroundColor={themeState.colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeState.colors.background }]}>
        <StatusBar barStyle={themeState.isDark ? "light-content" : "dark-content"} backgroundColor={themeState.colors.background} />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Erro: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!dashboardData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeState.colors.background }]}>
        <StatusBar barStyle={themeState.isDark ? "light-content" : "dark-content"} backgroundColor={themeState.colors.background} />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Nenhum dado encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Calcular indicadores baseados no período selecionado
  // Usar receitas e despesas filtradas pelo período selecionado
  const filteredRevenues = state.revenues.filter(revenue => {
    const revenueDate = new Date(revenue.date);
    const now = new Date();
    
    switch (state.selectedPeriod) {
      case 'daily':
        return revenueDate.toDateString() === now.toDateString();
      case 'weekly':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return revenueDate >= startOfWeek && revenueDate <= endOfWeek;
      case 'monthly':
        return revenueDate.getMonth() === now.getMonth() && 
               revenueDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });

  const filteredExpenses = state.expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    
    switch (state.selectedPeriod) {
      case 'daily':
        return expenseDate.toDateString() === now.toDateString();
      case 'weekly':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
      case 'monthly':
        return expenseDate.getMonth() === now.getMonth() && 
               expenseDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });

  // Calcular totais baseados nos lançamentos filtrados
  const totalRevenue = filteredRevenues.reduce((sum, revenue) => sum + revenue.value, 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.value, 0);
  const netProfit = totalRevenue - totalExpenses;
  
  const profitPercentage = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const expensePercentage = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;

  const indicators = dashboardData ? calculateIndicators(
    dashboardData,
    filteredRevenues,
    state.selectedPeriod
  ) : null;

  // Debug logs

  // Meta mensal com verificação de segurança
  const monthlyGoal = state?.monthlyGoal;
  const goalPercentage = monthlyGoal && monthlyGoal.targetAmount > 0 ? 
    (monthlyGoal.currentAmount / monthlyGoal.targetAmount) * 100 : 0;


  // Plataformas com percentuais e verificação de segurança
  const platformsWithPercentage = (dashboardData?.revenueByPlatform || []).map(platform => ({
    ...platform,
    percentage: totalRevenue > 0 ? (platform.value / totalRevenue) * 100 : 0
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={themeState.isDark ? "light-content" : "dark-content"} backgroundColor={themeState.colors.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="home-outline" size={24} color={themeState.colors.text} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{t('overview.title')}</Text>
            <Text style={styles.subtitle}>Visão geral dos seus ganhos</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.userGreeting}>
            Olá, {authState.driver?.name?.split(' ')[0] || 'Usuário'}
          </Text>
          <DateFilterDropdown />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Tabs */}
        <PeriodTabs
          selectedPeriod={state.selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />

        {/* Meta Mensal Card */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalIcon}>
              <Text style={styles.goalIconText}>🎯</Text>
            </View>
            <Text style={styles.goalTitle}>{t('overview.monthlyGoal')}</Text>
            <Text style={styles.goalPercentage}>{goalPercentage.toFixed(0)}%</Text>
          </View>
          
          <Text style={styles.goalAmount}>
            R$ {(monthlyGoal?.currentAmount || 0).toFixed(2).replace('.', ',')}
          </Text>
          <Text style={styles.goalTarget}>
            de R$ {(monthlyGoal?.targetAmount || 0).toFixed(2).replace('.', ',')}
          </Text>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(goalPercentage, 100)}%` }]} />
          </View>
          
          {!monthlyGoal && (
            <Text style={styles.goalHint}>
              Configure sua meta mensal nas configurações
            </Text>
          )}
        </View>

        {/* Lucro e Despesas */}
        <View style={styles.profitExpenseRow}>
          <View style={styles.profitCard}>
            <View style={styles.profitHeader}>
              <Text style={styles.profitIcon}>📈</Text>
              <Text style={styles.profitLabel}>{t('overview.netProfit')}</Text>
            </View>
            <Text style={styles.profitAmount}>R$ {netProfit.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.profitPercentage}>{profitPercentage.toFixed(1)}%</Text>
          </View>

          <View style={styles.expenseCard}>
            <View style={styles.expenseHeader}>
              <Text style={styles.expenseIcon}>📉</Text>
              <Text style={styles.expenseLabel}>{t('overview.totalExpenses')}</Text>
            </View>
            <Text style={styles.expenseAmount}>R$ {totalExpenses.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.expensePercentage}>{expensePercentage.toFixed(1)}%</Text>
          </View>
        </View>

        {/* Plataformas Grid */}
        <View style={styles.platformsGrid}>
          {platformsWithPercentage.map((platform, index) => (
            <View key={index} style={styles.platformCard}>
              <View style={[styles.platformIcon, { backgroundColor: getPlatformColor(platform.platform) }]}>
                <Text style={styles.platformIconText}>{getPlatformIcon(platform.platform)}</Text>
              </View>
              <Text style={styles.platformAmount}>R$ {platform.value.toFixed(2).replace('.', ',')}</Text>
              <Text style={styles.platformPercentage}>{platform.percentage.toFixed(1)}%</Text>
            </View>
          ))}
        </View>

        {/* Indicadores por Período */}
        <Text style={styles.sectionTitle}>
          Indicadores {state.selectedPeriod === 'daily' ? t('overview.daily') : state.selectedPeriod === 'weekly' ? t('overview.weekly') : t('overview.monthly')}
        </Text>
        
        <View style={styles.indicatorsGrid}>
          {/* Primeira linha */}
          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#dcfce7' }]}>
              <Text style={styles.indicatorIconText}>💰</Text>
            </View>
            <Text style={styles.indicatorLabel}>Média por Período</Text>
            <Text style={styles.indicatorValue}>R$ {(indicators?.averagePerPeriod || 0).toFixed(2).replace('.', ',')}</Text>
          </View>

          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#dbeafe' }]}>
              <Text style={styles.indicatorIconText}>⏰</Text>
            </View>
            <Text style={styles.indicatorLabel}>{t('overview.averagePerHour')}</Text>
            <Text style={styles.indicatorValue}>R$ {(indicators?.averagePerHour || 0).toFixed(2).replace('.', ',')}</Text>
          </View>

          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#fef3c7' }]}>
              <Text style={styles.indicatorIconText}>🛣️</Text>
            </View>
            <Text style={styles.indicatorLabel}>Média por KM</Text>
            <Text style={styles.indicatorValue}>R$ {(indicators?.averagePerKm || 0).toFixed(2).replace('.', ',')}</Text>
          </View>

          {/* Segunda linha */}
          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#f3f4f6' }]}>
              <Text style={styles.indicatorIconText}>⏱️</Text>
            </View>
            <Text style={styles.indicatorLabel}>{t('overview.totalHours')}</Text>
            <Text style={styles.indicatorValue}>{Math.floor(indicators?.hoursWorked || 0)}:{String(Math.round(((indicators?.hoursWorked || 0) % 1) * 60)).padStart(2, '0')}h</Text>
          </View>

          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#dbeafe' }]}>
              <Text style={styles.indicatorIconText}>📊</Text>
            </View>
            <Text style={styles.indicatorLabel}>{t('overview.averageHours')}</Text>
            <Text style={styles.indicatorValue}>{Math.floor(indicators?.averageHours || 0)}:{String(Math.round(((indicators?.averageHours || 0) % 1) * 60)).padStart(2, '0')}h</Text>
          </View>

          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#fecaca' }]}>
              <Text style={styles.indicatorIconText}>📏</Text>
            </View>
            <Text style={styles.indicatorLabel}>Total de KMs</Text>
            <Text style={styles.indicatorValue}>{(indicators?.totalKms || 0).toFixed(1)} KM</Text>
          </View>

          {/* Terceira linha */}
          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#dcfce7' }]}>
              <Text style={styles.indicatorIconText}>📅</Text>
            </View>
            <Text style={styles.indicatorLabel}>{t('overview.workingDays')}</Text>
            <Text style={styles.indicatorValue}>{indicators?.daysWorked || 0} dias</Text>
          </View>

          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#dbeafe' }]}>
              <Text style={styles.indicatorIconText}>🚗</Text>
            </View>
            <Text style={styles.indicatorLabel}>{t('overview.totalTrips')}</Text>
            <Text style={styles.indicatorValue}>{indicators?.tripsCompleted || 0} corridas</Text>
          </View>

          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#fed7aa' }]}>
              <Text style={styles.indicatorIconText}>🎯</Text>
            </View>
            <Text style={styles.indicatorLabel}>{t('overview.averagePerTrip')}</Text>
            <Text style={styles.indicatorValue}>R$ {(indicators?.averagePerTrip || 0).toFixed(2).replace('.', ',')}</Text>
          </View>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const getPlatformColor = (platform: string): string => {
  const colors: { [key: string]: string } = {
    'Uber': '#000000',
    '99': '#ffcc00',
    'inDrive': '#0ea5e9',
    'Cabify': '#6b7280',
    'Outros': '#6b7280',
  };
  return colors[platform] || '#6b7280';
};

const getPlatformIcon = (platform: string): string => {
  const icons: { [key: string]: string } = {
    'Uber': '⚫',
    '99': '🟡',
    'inDrive': '🔵',
    'Cabify': '⚪',
    'Outros': '⚪',
  };
  return icons[platform] || '⚪';
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
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
  titleContainer: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 120,
  },
  titleContainer: {
    flex: 1,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  appIconText: {
    fontSize: 24,
  },
  appName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
    fontWeight: '500',
    letterSpacing: 1,
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
  userGreeting: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'right',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterText: {
    fontSize: 16,
    color: colors.text,
    marginRight: 6,
  },
  filterArrow: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalIconText: {
    fontSize: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
  },
  goalPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  goalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 8,
  },
  goalTarget: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  goalHint: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  profitExpenseRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  profitCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profitIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  profitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
  },
  profitAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 4,
  },
  profitPercentage: {
    fontSize: 14,
    color: colors.success,
  },
  expenseCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  expenseLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 4,
  },
  expensePercentage: {
    fontSize: 14,
    color: colors.error,
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 12,
  },
  platformCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  platformIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  platformIconText: {
    fontSize: 24,
  },
  platformAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  platformPercentage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 32,
    marginBottom: 16,
  },
  indicatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  indicatorCard: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  indicatorIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  indicatorIconText: {
    fontSize: 18,
  },
  indicatorLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  indicatorValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
});

export default OverviewScreen;
