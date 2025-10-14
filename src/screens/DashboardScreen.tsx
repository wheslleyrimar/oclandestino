import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { PeriodTabs } from '../components/PeriodTabs';
import { StatCard } from '../components/StatCard';
import { PremiumButton, PremiumStatus } from '../components/PremiumButton';
import { RevenueChart } from '../components/RevenueChart';
import { ExpenseChart } from '../components/ExpenseChart';
import { PerformanceChart } from '../components/PerformanceChart';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { DashboardData } from '../services/apiService';
import { apiService } from '../services/apiService';
import { Ionicons } from '@expo/vector-icons';
import { 
  calculateIndicators,
  IndicatorsData 
} from '../utils/indicatorsCalculator';

const DashboardScreen: React.FC = () => {
  const { state, setPeriod, getDashboardData, setFilters } = useFinance();
  const { state: themeState } = useTheme();
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [indicators, setIndicators] = useState<IndicatorsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificação de segurança para o tema
  if (!themeState || !themeState.colors) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#64748b' }}>Carregando...</Text>
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


      // Fazer chamadas paralelas para dashboard e receitas
      const [dashboardResponse, revenuesResponse] = await Promise.all([
        apiService.getDashboardData({ startDate, endDate }),
        apiService.getRevenues({ 
          startDate, 
          endDate, 
          limit: Math.max(1, Math.min(100, 100)) // Garantir que está entre 1 e 100
        })
      ]);


      if (dashboardResponse.success && revenuesResponse.success) {
        const dashboardData = dashboardResponse.data;
        // Verificar se a estrutura de resposta está correta
        const revenues = revenuesResponse.data?.data || revenuesResponse.data || [];


        // Garantir que os dados tenham a estrutura correta
        const safeData = {
          totalRevenue: dashboardData?.totalRevenue || 0,
          totalExpenses: dashboardData?.totalExpenses || 0,
          netProfit: dashboardData?.netProfit || 0,
          workingDaysCount: dashboardData?.workingDaysCount || 0,
          averageEarningsPerHour: dashboardData?.averageEarningsPerHour || 0,
          averageEarningsPerKm: dashboardData?.averageEarningsPerKm || 0,
          totalHoursWorked: dashboardData?.totalHoursWorked || 0,
          averageHoursPerPeriod: dashboardData?.averageHoursPerPeriod || 0,
          totalKilometersRidden: dashboardData?.totalKilometersRidden || 0,
          totalTripsCount: dashboardData?.totalTripsCount || 0,
          averageEarningsPerTrip: dashboardData?.averageEarningsPerTrip || 0,
          revenueByPlatform: dashboardData?.revenueByPlatform || [],
          expensesByCategory: dashboardData?.expensesByCategory || [],
          dailyProfit: dashboardData?.dailyProfit || [],
        };

        // Verificar se há dados nas receitas
        if (revenues.length > 0) {
          // Debug removido
        } else {
          // Nenhuma receita encontrada
        }

        // Calcular indicadores usando dados reais
        // Garantir que revenues seja um array antes de passar para calculateIndicators
        const safeRevenues = Array.isArray(revenues) ? revenues : [];
        const calculatedIndicators = calculateIndicators(safeData, safeRevenues, state.selectedPeriod);


        setDashboardData(safeData);
        setIndicators(calculatedIndicators);
      } else {
        throw new Error(`Failed to load data: Dashboard=${dashboardResponse.success}, Revenues=${revenuesResponse.success}`);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
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

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeState.colors.background }]}>
        <StatusBar barStyle={themeState.isDark ? "light-content" : "dark-content"} backgroundColor={themeState.colors.surface} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeState.colors.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeState.colors.background }]}>
        <StatusBar barStyle={themeState.isDark ? "light-content" : "dark-content"} backgroundColor={themeState.colors.surface} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t('common.error')}: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!dashboardData || !indicators) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeState.colors.background }]}>
        <StatusBar barStyle={themeState.isDark ? "light-content" : "dark-content"} backgroundColor={themeState.colors.surface} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Nenhum dado encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeState.colors.background }]}>
      <StatusBar barStyle={themeState.isDark ? "light-content" : "dark-content"} backgroundColor={themeState.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Ionicons name="bar-chart-outline" size={24} color={themeState.colors.text} />
            </View>
            <View>
              <Text style={styles.title}>{t('dashboard.title')}</Text>
              <Text style={styles.subtitle}>Visão geral dos seus ganhos</Text>
            </View>
          </View>
          <PremiumButton variant="secondary" size="small" />
        </View>
        <View style={styles.headerBottom}>
          <PremiumStatus />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Tabs */}
        <PeriodTabs
          selectedPeriod={state.selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />

        {/* Financial Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
          
          <View style={styles.statsGrid}>
            <StatCard
              title={t('dashboard.totalRevenue')}
              value={`R$ ${(dashboardData.totalRevenue || 0).toFixed(2)}`}
              icon="💰"
              color="#22c55e"
            />
            <StatCard
              title="Gastos Totais"
              value={`R$ ${(dashboardData.totalExpenses || 0).toFixed(2)}`}
              icon="💸"
              color="#ef4444"
            />
            <StatCard
              title={t('dashboard.netProfit')}
              value={`R$ ${(dashboardData.netProfit || 0).toFixed(2)}`}
              icon="📈"
              color={(dashboardData.netProfit || 0) >= 0 ? "#22c55e" : "#ef4444"}
            />
            <StatCard
              title={t('dashboard.workingDaysCount')}
              value={(dashboardData.workingDaysCount || 0).toString()}
              icon="📅"
              color="#0ea5e9"
            />
          </View>
        </View>




        {/* Charts Section */}
        <RevenueChart data={dashboardData} period={state.selectedPeriod} />
        <ExpenseChart data={dashboardData} period={state.selectedPeriod} />
        <PerformanceChart data={dashboardData} period={state.selectedPeriod} />

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Floating Action Button */}
      <FloatingActionButton />
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
  headerBottom: {
    marginTop: 8,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
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
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
});

export default DashboardScreen;
