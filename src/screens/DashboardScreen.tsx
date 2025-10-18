import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { PeriodTabs } from '../components/PeriodTabs';
import { RevenueChart } from '../components/RevenueChart';
import { ExpenseChart } from '../components/ExpenseChart';
import { PerformanceChart } from '../components/PerformanceChart';
import { DashboardData } from '../services/apiService';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';
import { Ionicons } from '@expo/vector-icons';
import NotificationIcon from '../components/NotificationIcon';

const DashboardScreen: React.FC = () => {
  const { state, setPeriod, getDashboardData, setFilters } = useFinance();
  const { state: themeState } = useTheme();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
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

  // useEffect para recarregar dados quando transações são atualizadas
  useEffect(() => {
    loadDashboardData();
  }, [state.lastUpdated]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Verificar se há token válido antes de fazer as requisições
      const token = await authService.getStoredToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado. Faça login novamente.');
      }
      
      
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


      // Fazer chamada para dashboard
      const dashboardResponse = await apiService.getDashboardData({ startDate, endDate });

      if (dashboardResponse.success) {
        const dashboardData = dashboardResponse.data;

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

        setDashboardData(safeData);
      } else {
        throw new Error(`Erro ao carregar dashboard: ${dashboardResponse.message || 'Falha desconhecida'}`);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      
      // Verificar se é erro de token inválido
      if (err instanceof Error && err.message.includes('invalid token')) {
        setError('Sessão expirada. Faça login novamente.');
      } else if (err instanceof Error && err.message.includes('Token de autenticação')) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Falha ao carregar dados do dashboard');
      }
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
    const isTokenError = error.includes('Token de autenticação') || error.includes('Sessão expirada') || error.includes('invalid token');
    
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeState.colors.background }]}>
        <StatusBar barStyle={themeState.isDark ? "light-content" : "dark-content"} backgroundColor={themeState.colors.surface} />
        <View style={styles.errorContainer}>
          <Ionicons 
            name="warning-outline" 
            size={48} 
            color={themeState.colors.error} 
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>{t('common.error')}: {error}</Text>
          {isTokenError && (
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={async () => {
                await logout();
                // O logout redirecionará automaticamente para a tela de login
              }}
            >
              <Text style={styles.loginButtonText}>Fazer Login Novamente</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (!dashboardData) {
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
              <Ionicons name="bar-chart-outline" size={20} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.title}>{t('dashboard.title')}</Text>
              <Text style={styles.subtitle}>Visão geral dos seus ganhos</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <NotificationIcon />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Tabs */}
        <PeriodTabs
          selectedPeriod={state.selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />

        {/* Charts Section */}
        <RevenueChart data={dashboardData} period={state.selectedPeriod} />
        <ExpenseChart data={dashboardData} period={state.selectedPeriod} />
        <PerformanceChart data={dashboardData} period={state.selectedPeriod} />

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 20,
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  errorIcon: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;
