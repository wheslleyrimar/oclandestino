import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { PeriodTabs } from '../components/PeriodTabs';
import { MonthlyGoalHistoryCard } from '../components/MonthlyGoalHistoryCard';
import { CircularProgress } from '../components/CircularProgress';
import { DashboardData } from '../services/apiService';
import { calculateIndicators } from '../utils/indicatorsCalculator';
import { Ionicons } from '@expo/vector-icons';

const OverviewScreen: React.FC = () => {
  const { state, setPeriod, getDashboardData, setFilters, checkAndResetMonthlyGoal } = useFinance();
  const { state: themeState } = useTheme();
  const { state: authState } = useAuth();
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animações para meta atingida
  const goalScaleAnim = useRef(new Animated.Value(1)).current;
  const goalPulseAnim = useRef(new Animated.Value(1)).current;

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

  // useEffect para animações da meta atingida
  useEffect(() => {
    const goalPercentage = state?.monthlyGoal 
      ? (state.monthlyGoal.currentAmount / state.monthlyGoal.targetAmount) * 100 
      : 0;
    
    if (goalPercentage >= 100) {
      // Animação de escala inicial
      Animated.sequence([
        Animated.timing(goalScaleAnim, {
          toValue: 1.05,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(goalScaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Animação de pulso contínua
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(goalPulseAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(goalPulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    }
  }, [state?.monthlyGoal, goalScaleAnim, goalPulseAnim]);

  // useEffect para recarregar dados quando transações são atualizadas
  useEffect(() => {
    loadDashboardData();
  }, [state.lastUpdated]);

  // useEffect para atualizar meta mensal quando dados são carregados
  useEffect(() => {
    if (state.monthlyGoal && state.revenues.length > 0) {
      // A meta mensal será atualizada automaticamente pelas funções de receita
      // Não precisamos fazer nada aqui, pois o cálculo é feito em tempo real
    }
  }, [state.revenues, state.monthlyGoal]);

  // useEffect para verificar e resetar meta mensal quando necessário
  useEffect(() => {
    checkAndResetMonthlyGoal();
  }, []); // Executa apenas uma vez quando o componente monta

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

  // Função para calcular dias restantes no mês
  const getDaysRemaining = () => {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysRemaining = lastDayOfMonth.getDate() - now.getDate();
    return Math.max(0, daysRemaining);
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

  // Calcular despesas por categoria
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.value;
    return acc;
  }, {} as Record<string, number>);

  // Calcular percentuais das despesas por categoria
  const fuelExpense = expensesByCategory['Combustível'] || 0;
  const vehicleExpense = expensesByCategory['Manutenção'] || 0;
  const foodExpense = expensesByCategory['Alimentação'] || 0;
  const extraExpense = expensesByCategory['Outros'] || 0;

  const fuelPercentage = totalExpenses > 0 ? (fuelExpense / totalExpenses) * 100 : 0;
  const vehiclePercentage = totalExpenses > 0 ? (vehicleExpense / totalExpenses) * 100 : 0;
  const foodPercentage = totalExpenses > 0 ? (foodExpense / totalExpenses) * 100 : 0;
  const extraPercentage = totalExpenses > 0 ? (extraExpense / totalExpenses) * 100 : 0;

  // Criar dados filtrados para os indicadores
  const filteredDashboardData = {
    totalRevenue,
    totalExpenses,
    netProfit,
    workingDaysCount: new Set(filteredRevenues.map(revenue => revenue.date)).size,
    averageEarningsPerHour: 0, // Será calculado pelos indicadores
    averageEarningsPerKm: 0, // Será calculado pelos indicadores
    totalHoursWorked: filteredRevenues.reduce((sum, revenue) => sum + (revenue.hoursWorked || 0), 0),
    averageHoursPerPeriod: 0, // Será calculado pelos indicadores
    totalKilometersRidden: filteredRevenues.reduce((sum, revenue) => sum + (revenue.kilometersRidden || 0), 0),
    totalTripsCount: filteredRevenues.reduce((sum, revenue) => sum + (revenue.tripsCount || 0), 0),
    averageEarningsPerTrip: 0, // Será calculado pelos indicadores
    revenueByPlatform: [], // Será calculado abaixo
    expensesByCategory: [], // Será calculado abaixo
    dailyProfit: [], // Não necessário para indicadores
  };

  const indicators = calculateIndicators(
    filteredDashboardData,
    filteredRevenues,
    state.selectedPeriod
  );

  // Debug logs

  // Meta mensal com verificação de segurança
  const monthlyGoal = state?.monthlyGoal;
  
  // Calcular valor atual baseado nas receitas do mês atual
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const currentMonthRevenues = state.revenues.filter(revenue => {
    const revenueDate = new Date(revenue.date);
    const revenueMonth = `${revenueDate.getFullYear()}-${String(revenueDate.getMonth() + 1).padStart(2, '0')}`;
    return revenueMonth === currentMonth;
  });
  
  const currentGoalAmount = currentMonthRevenues.reduce((sum, revenue) => sum + revenue.value, 0);
  
  // Calcular porcentagem baseada no valor real das receitas
  const goalPercentage = monthlyGoal && monthlyGoal.targetAmount > 0 ? 
    (currentGoalAmount / monthlyGoal.targetAmount) * 100 : 0;


  // Plataformas com percentuais baseadas nos dados filtrados
  const platformsMap = new Map<string, number>();
  filteredRevenues.forEach(revenue => {
    const currentValue = platformsMap.get(revenue.platform) || 0;
    platformsMap.set(revenue.platform, currentValue + revenue.value);
  });

  const platformsWithPercentage = Array.from(platformsMap.entries()).map(([platform, value]) => ({
    platform,
    value,
    percentage: totalRevenue > 0 ? (value / totalRevenue) * 100 : 0
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={themeState.isDark ? "light-content" : "dark-content"} backgroundColor={themeState.colors.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="home-outline" size={20} color="#ffffff" />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{t('overview.title')}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.userGreeting}>
            Olá, {authState.driver?.name?.split(' ')[0] || 'Usuário'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Tabs */}
        <PeriodTabs
          selectedPeriod={state.selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />

        {/* Layout Principal - Meta e Resumo Financeiro */}
        <View style={styles.mainLayout}>
          {/* Lado Esquerdo - Meta Mensal */}
          <View style={styles.leftColumn}>
            {/* Meta Mensal */}
            <Animated.View 
              style={[
                styles.goalCard, 
                goalPercentage >= 100 && styles.goalCardSuccess,
                goalPercentage >= 100 && {
                  transform: [
                    { scale: goalScaleAnim },
                    { scale: goalPulseAnim }
                  ]
                }
              ]}
            >
              <View style={styles.goalHeader}>
                <Text style={[styles.goalTitle, goalPercentage >= 100 && styles.goalTitleSuccess]}>
                  {goalPercentage >= 100 ? 'Meta Atingida!' : 'Meta'}
                </Text>
              </View>
              
              {/* Gráfico Circular */}
              <View style={styles.circularProgressContainer}>
                <CircularProgress
                  percentage={goalPercentage}
                  size={100}
                  strokeWidth={8}
                  color={goalPercentage >= 100 ? '#22c55e' : themeState.colors.primary}
                  backgroundColor={themeState.colors.border}
                />
                <View style={styles.circularProgressText}>
                  <Text style={[styles.goalPercentage, goalPercentage >= 100 && styles.goalPercentageSuccess]}>
                    {goalPercentage.toFixed(0)}%
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.goalAmount, goalPercentage >= 100 && styles.goalAmountSuccess]}>
                R$ {currentGoalAmount.toFixed(2).replace('.', ',')}
              </Text>
              <Text style={styles.goalTarget}>
                de R$ {(monthlyGoal?.targetAmount || 0).toFixed(2).replace('.', ',')}
              </Text>
              
              {/* Contador de dias restantes */}
              <View style={styles.daysRemainingContainer}>
                <Text style={styles.daysRemainingLabel}>Dias restantes:</Text>
                <Text style={[styles.daysRemainingValue, getDaysRemaining() <= 3 && styles.daysRemainingUrgent]}>
                  {getDaysRemaining()} {getDaysRemaining() === 1 ? 'dia' : 'dias'}
                </Text>
              </View>
            </Animated.View>

          </View>

          {/* Lado Direito - Resumo Financeiro */}
          <View style={styles.rightColumn}>
            {/* Faturamento */}
            <View style={styles.revenueCard}>
              <View style={styles.revenueHeader}>
                <Ionicons name="trending-up-outline" size={14} color="#f59e0b" />
                <Text style={styles.revenueLabel}>Faturamento</Text>
              </View>
              <Text style={styles.revenueAmount}>R$ {totalRevenue.toFixed(2).replace('.', ',')}</Text>
              <Text style={styles.revenuePercentage}>100%</Text>
            </View>

            {/* Despesas */}
            <View style={styles.expenseCard}>
              <View style={styles.expenseHeader}>
                <Ionicons name="trending-down-outline" size={14} color="#dc2626" />
                <Text style={styles.expenseLabel}>Despesas</Text>
              </View>
              <Text style={styles.expenseAmount}>R$ {totalExpenses.toFixed(2).replace('.', ',')}</Text>
              <Text style={styles.expensePercentage}>{expensePercentage.toFixed(2)}%</Text>
            </View>

            {/* Lucro Líquido */}
            <View style={styles.profitCard}>
              <View style={styles.profitHeader}>
                <Ionicons name="trending-up-outline" size={14} color="#10b981" />
                <Text style={styles.profitLabel}>Lucro Líquido</Text>
              </View>
              <Text style={styles.profitAmount}>R$ {netProfit.toFixed(2).replace('.', ',')}</Text>
              <Text style={styles.profitPercentage}>{profitPercentage.toFixed(2)}%</Text>
            </View>
          </View>
        </View>

        {/* Plataformas */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Receitas por Plataforma</Text>
          <View style={styles.platformsSection}>
          {platformsWithPercentage.map((platform, index) => (
            <View key={index} style={styles.platformCard}>
              <View style={[styles.platformIcon, { backgroundColor: getPlatformColor(platform.platform) }]}>
                <Text style={styles.platformIconText}>{getPlatformIcon(platform.platform)}</Text>
              </View>
              <Text style={styles.platformAmount}>R$ {platform.value.toFixed(2).replace('.', ',')}</Text>
              <Text style={styles.platformPercentage}>{platform.percentage.toFixed(2)}%</Text>
              <Text style={styles.platformLabel}>{platform.platform}</Text>
            </View>
          ))}
          </View>
        </View>

        {/* Despesas por Categoria */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Despesas por Categoria</Text>
          <View style={styles.expensesGrid}>
          <View style={styles.expenseCategoryCard}>
            <View style={styles.expenseCategoryHeader}>
              <Ionicons name="car-outline" size={20} color="#ef4444" />
              <Text style={styles.expenseCategoryLabel}>Combustível</Text>
            </View>
            <Text style={styles.expenseCategoryAmount}>R$ {fuelExpense.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.expenseCategoryPercentage}>{fuelPercentage.toFixed(2)}%</Text>
          </View>

          <View style={styles.expenseCategoryCard}>
            <View style={styles.expenseCategoryHeader}>
              <Ionicons name="construct-outline" size={20} color="#ef4444" />
              <Text style={styles.expenseCategoryLabel}>Custo com Veículo</Text>
            </View>
            <Text style={styles.expenseCategoryAmount}>R$ {vehicleExpense.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.expenseCategoryPercentage}>{vehiclePercentage.toFixed(2)}%</Text>
          </View>

          <View style={styles.expenseCategoryCard}>
            <View style={styles.expenseCategoryHeader}>
              <Ionicons name="restaurant-outline" size={20} color="#ef4444" />
              <Text style={styles.expenseCategoryLabel}>Alimentação</Text>
            </View>
            <Text style={styles.expenseCategoryAmount}>R$ {foodExpense.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.expenseCategoryPercentage}>{foodPercentage.toFixed(2)}%</Text>
          </View>

          <View style={styles.expenseCategoryCard}>
            <View style={styles.expenseCategoryHeader}>
              <Ionicons name="ellipsis-horizontal-outline" size={20} color="#ef4444" />
              <Text style={styles.expenseCategoryLabel}>Despesas Extras</Text>
            </View>
            <Text style={styles.expenseCategoryAmount}>R$ {extraExpense.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.expenseCategoryPercentage}>{extraPercentage.toFixed(2)}%</Text>
          </View>
          </View>
        </View>

        {/* Indicadores Estatísticos */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Indicadores de Performance</Text>
          <View style={styles.indicatorsSection}>
          {/* Primeira linha - Médias de Ganho */}
          <View style={styles.indicatorsRow}>
            <View style={styles.indicatorCard}>
              <Text style={styles.indicatorValue}>R$ {(indicators?.averagePerPeriod || 0).toFixed(2).replace('.', ',')}</Text>
              <Text style={styles.indicatorLabel}>
                Média de Ganho por {state.selectedPeriod === 'daily' ? 'Dia' : state.selectedPeriod === 'weekly' ? 'Semana' : 'Mês'}
              </Text>
            </View>

            <View style={styles.indicatorCard}>
              <Text style={styles.indicatorValue}>R$ {(indicators?.averagePerHour || 0).toFixed(2).replace('.', ',')}</Text>
              <Text style={styles.indicatorLabel}>Média de Ganho por Hora</Text>
            </View>

            <View style={styles.indicatorCard}>
              <Text style={styles.indicatorValue}>R$ {(indicators?.averagePerKm || 0).toFixed(2).replace('.', ',')}</Text>
              <Text style={styles.indicatorLabel}>Média de Ganho por KM</Text>
            </View>
          </View>

          {/* Segunda linha - Horas e Distância */}
          <View style={styles.indicatorsRow}>
            <View style={styles.indicatorCard}>
              <Text style={styles.indicatorValue}>
                {Math.floor(indicators?.hoursWorked || 0)}:{String(Math.round(((indicators?.hoursWorked || 0) % 1) * 60)).padStart(2, '0')}h
              </Text>
              <Text style={styles.indicatorLabel}>Total de Horas Trabalhadas</Text>
            </View>

            <View style={styles.indicatorCard}>
              <Text style={styles.indicatorValue}>
                {Math.floor(indicators?.averageHours || 0)}:{String(Math.round(((indicators?.averageHours || 0) % 1) * 60)).padStart(2, '0')}h
              </Text>
              <Text style={styles.indicatorLabel}>
                Média de Horas Trabalhadas por {state.selectedPeriod === 'daily' ? 'Dia' : state.selectedPeriod === 'weekly' ? 'Semana' : 'Mês'}
              </Text>
            </View>

            <View style={styles.indicatorCard}>
              <Text style={styles.indicatorValue}>{(indicators?.totalKms || 0).toFixed(1)}KM</Text>
              <Text style={styles.indicatorLabel}>Total de KM</Text>
            </View>
          </View>

          {/* Terceira linha - Resumo de Atividade */}
          <View style={styles.indicatorsRow}>
            <View style={styles.indicatorCard}>
              <Text style={styles.indicatorValue}>{indicators?.daysWorked || 0}</Text>
              <Text style={styles.indicatorLabel}>
                {state.selectedPeriod === 'daily' ? 'Dias Trabalhados' : state.selectedPeriod === 'weekly' ? 'Dias da Semana' : 'Dias Trabalhados'}
              </Text>
            </View>

            <View style={styles.indicatorCard}>
              <Text style={styles.indicatorValue}>{indicators?.tripsCompleted || 0}</Text>
              <Text style={styles.indicatorLabel}>Quantidade de Corridas</Text>
            </View>

            <View style={styles.indicatorCard}>
              <Text style={styles.indicatorValue}>R$ {(indicators?.averagePerTrip || 0).toFixed(2).replace('.', ',')}</Text>
              <Text style={styles.indicatorLabel}>Média de Ganho por Corrida</Text>
            </View>
          </View>
          </View>
        </View>

        {/* Histórico de Metas Mensais */}
        <MonthlyGoalHistoryCard history={state.monthlyGoalHistory} />

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
    '99Pop': '#ffcc00',
    'inDrive': '#0ea5e9',
    'InDrive': '#0ea5e9',
    'Cabify': '#6b7280',
    'Outros': '#6b7280',
  };
  return colors[platform] || '#6b7280';
};

const getPlatformIcon = (platform: string): string => {
  const icons: { [key: string]: string } = {
    'Uber': '⚫',
    '99': '🟡',
    '99Pop': '🟡',
    'inDrive': '🔵',
    'InDrive': '🔵',
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
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 0,
    borderBottomColor: colors.border,
    paddingTop: Platform.OS === 'ios' ? 20 : 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 20,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  titleContainer: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 120,
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
    opacity: 0.8,
  },
  userGreeting: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
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
    paddingHorizontal: 24,
  },
  mainLayout: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
    minHeight: 200,
  },
  leftColumn: {
    flex: 1.3,
    gap: 12,
  },
  rightColumn: {
    flex: 1,
    gap: 8,
    justifyContent: 'space-between',
  },
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
    minHeight: 180,
  },
  goalCardSuccess: {
    backgroundColor: '#f0fdf4',
    borderWidth: 3,
    borderColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  goalHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  circularProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    position: 'relative',
  },
  circularProgressText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
    letterSpacing: -0.2,
  },
  goalTitleSuccess: {
    color: '#22c55e',
  },
  goalPercentage: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  goalPercentageSuccess: {
    color: '#22c55e',
  },
  goalAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 6,
    letterSpacing: -0.3,
  },
  goalAmountSuccess: {
    color: '#22c55e',
  },
  goalTarget: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  daysRemainingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  daysRemainingLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  daysRemainingValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  daysRemainingUrgent: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  goalHint: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  goalSuccessMessage: {
    fontSize: 16,
    color: '#22c55e',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  revenueCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
    justifyContent: 'space-between',
    minHeight: 60,
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  revenueLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#f59e0b',
    marginLeft: 4,
  },
  revenueAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 1,
    letterSpacing: -0.1,
  },
  revenuePercentage: {
    fontSize: 9,
    color: '#f59e0b',
  },
  profitCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
    justifyContent: 'space-between',
    minHeight: 60,
  },
  profitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  profitLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 4,
  },
  profitAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 1,
    letterSpacing: -0.1,
  },
  profitPercentage: {
    fontSize: 9,
    color: '#059669',
  },
  expenseCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: '#dc2626',
    justifyContent: 'space-between',
    minHeight: 60,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  expenseLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 4,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 1,
    letterSpacing: -0.1,
  },
  expensePercentage: {
    fontSize: 9,
    color: '#dc2626',
  },
  expensesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  expenseCategoryCard: {
    flexBasis: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 3,
    borderTopColor: '#ef4444',
    marginBottom: 12,
    minHeight: 100,
  },
  expenseCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseCategoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 6,
  },
  expenseCategoryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  expenseCategoryPercentage: {
    fontSize: 10,
    color: colors.error,
  },
  platformsSection: {
    flexDirection: 'row',
    gap: 16,
  },
  platformCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  platformIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  platformIconText: {
    fontSize: 18,
  },
  platformAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  platformPercentage: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  platformLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  indicatorsSection: {
    gap: 16,
  },
  indicatorsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  indicatorCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  indicatorLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
    lineHeight: 14,
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  bottomSpacing: {
    height: Platform.OS === 'ios' ? 150 : 140,
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
