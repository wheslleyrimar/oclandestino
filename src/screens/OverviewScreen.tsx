import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { PeriodTabs } from '../components/PeriodTabs';
import { DateFilterDropdown } from '../components/DateFilterDropdown';

const OverviewScreen: React.FC = () => {
  const { state, setPeriod, getDashboardData } = useFinance();
  const { state: themeState } = useTheme();
  
  // Sempre renderizar o conteúdo, mesmo sem dados
  // Os dados mock serão carregados pelo useEffect do contexto

  const dashboardData = getDashboardData();

  const handlePeriodChange = (period: 'daily' | 'weekly' | 'monthly') => {
    setPeriod(period);
  };

  // Calcular percentuais
  const totalRevenue = dashboardData.totalRevenue || 0;
  const totalExpenses = dashboardData.totalExpenses || 0;
  const netProfit = dashboardData.netProfit || 0;
  
  const profitPercentage = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const expensePercentage = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;

  // Meta mensal
  const monthlyGoal = state.monthlyGoal;
  const goalPercentage = monthlyGoal ? (monthlyGoal.currentAmount / monthlyGoal.targetAmount) * 100 : 0;

  // Plataformas com percentuais
  const platformsWithPercentage = (dashboardData.revenueByPlatform || []).map(platform => ({
    ...platform,
    percentage: totalRevenue > 0 ? (platform.value / totalRevenue) * 100 : 0
  }));

  const styles = createStyles(themeState.colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={themeState.isDark ? "light-content" : "dark-content"} backgroundColor={themeState.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>📊</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.appName}>KLANS</Text>
            <Text style={styles.title}>Visão Geral</Text>
          </View>
        </View>
        <DateFilterDropdown />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Tabs */}
        <PeriodTabs
          selectedPeriod={state.selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />

        {/* Meta Mensal Card */}
        {monthlyGoal && (
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalIcon}>
                <Text style={styles.goalIconText}>🎯</Text>
              </View>
              <Text style={styles.goalTitle}>Meta Mensal</Text>
              <Text style={styles.goalPercentage}>{goalPercentage.toFixed(0)}%</Text>
            </View>
            
            <Text style={styles.goalAmount}>R$ {monthlyGoal.currentAmount.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.goalTarget}>de R$ {monthlyGoal.targetAmount.toFixed(2).replace('.', ',')}</Text>
            
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(goalPercentage, 100)}%` }]} />
            </View>
          </View>
        )}

        {/* Lucro e Despesas */}
        <View style={styles.profitExpenseRow}>
          <View style={styles.profitCard}>
            <View style={styles.profitHeader}>
              <Text style={styles.profitIcon}>📈</Text>
              <Text style={styles.profitLabel}>Lucro</Text>
            </View>
            <Text style={styles.profitAmount}>R$ {netProfit.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.profitPercentage}>{profitPercentage.toFixed(1)}%</Text>
          </View>

          <View style={styles.expenseCard}>
            <View style={styles.expenseHeader}>
              <Text style={styles.expenseIcon}>📉</Text>
              <Text style={styles.expenseLabel}>Despesas</Text>
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

        {/* Indicadores Mensais */}
        <Text style={styles.sectionTitle}>Indicadores Mensais</Text>
        
        <View style={styles.indicatorsGrid}>
          {/* Primeira linha */}
          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#dcfce7' }]}>
              <Text style={styles.indicatorIconText}>💰</Text>
            </View>
            <Text style={styles.indicatorLabel}>Média por Período</Text>
            <Text style={styles.indicatorValue}>R$ {totalRevenue.toFixed(2).replace('.', ',')}</Text>
          </View>

          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#dbeafe' }]}>
              <Text style={styles.indicatorIconText}>⏰</Text>
            </View>
            <Text style={styles.indicatorLabel}>Média por Hora</Text>
            <Text style={styles.indicatorValue}>R$ {dashboardData.averageEarningsPerHour.toFixed(2).replace('.', ',')}</Text>
          </View>

          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#fef3c7' }]}>
              <Text style={styles.indicatorIconText}>🛣️</Text>
            </View>
            <Text style={styles.indicatorLabel}>Média por KM</Text>
            <Text style={styles.indicatorValue}>R$ {dashboardData.averageEarningsPerKm.toFixed(2).replace('.', ',')}</Text>
          </View>

          {/* Segunda linha */}
          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#f3f4f6' }]}>
              <Text style={styles.indicatorIconText}>⏱️</Text>
            </View>
            <Text style={styles.indicatorLabel}>Horas Trabalhadas</Text>
            <Text style={styles.indicatorValue}>{Math.floor(dashboardData.totalHoursWorked)}:{String(Math.round((dashboardData.totalHoursWorked % 1) * 60)).padStart(2, '0')}h</Text>
          </View>

          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#dbeafe' }]}>
              <Text style={styles.indicatorIconText}>📊</Text>
            </View>
            <Text style={styles.indicatorLabel}>Média de Horas</Text>
            <Text style={styles.indicatorValue}>{Math.floor(dashboardData.averageHoursPerPeriod)}:{String(Math.round((dashboardData.averageHoursPerPeriod % 1) * 60)).padStart(2, '0')}h</Text>
          </View>

          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#fecaca' }]}>
              <Text style={styles.indicatorIconText}>📏</Text>
            </View>
            <Text style={styles.indicatorLabel}>Total de KMs</Text>
            <Text style={styles.indicatorValue}>{dashboardData.totalKilometersRidden.toFixed(1)} KM</Text>
          </View>

          {/* Terceira linha */}
          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#dcfce7' }]}>
              <Text style={styles.indicatorIconText}>📅</Text>
            </View>
            <Text style={styles.indicatorLabel}>Dias Trabalhados</Text>
            <Text style={styles.indicatorValue}>{dashboardData.workingDaysCount} dias</Text>
          </View>

          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#dbeafe' }]}>
              <Text style={styles.indicatorIconText}>🚗</Text>
            </View>
            <Text style={styles.indicatorLabel}>Corridas Realizadas</Text>
            <Text style={styles.indicatorValue}>{dashboardData.totalTripsCount} corridas</Text>
          </View>

          <View style={styles.indicatorCard}>
            <View style={[styles.indicatorIcon, { backgroundColor: '#fed7aa' }]}>
              <Text style={styles.indicatorIconText}>🎯</Text>
            </View>
            <Text style={styles.indicatorLabel}>Média por Corrida</Text>
            <Text style={styles.indicatorValue}>R$ {dashboardData.averageEarningsPerTrip.toFixed(2).replace('.', ',')}</Text>
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
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appIconText: {
    fontSize: 20,
  },
  appName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
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
});

export default OverviewScreen;
