import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Revenue, Expense, DashboardData, FilterOptions, MonthlyGoal, PeriodMetrics, MonthlyGoalHistory } from '../types';
import { apiService } from '../services/apiService';
import { useAuth } from './AuthContext';

interface FinanceState {
  revenues: Revenue[];
  expenses: Expense[];
  filters: FilterOptions;
  monthlyGoal: MonthlyGoal | null;
  monthlyGoalHistory: MonthlyGoalHistory[];
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
  isLoading: boolean;
  error: string | null;
  lastUpdated: number; // Timestamp da última atualização
}

type FinanceAction =
  | { type: 'ADD_REVENUE'; payload: Revenue }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_REVENUE'; payload: Revenue }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_REVENUE'; payload: string }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_FILTERS'; payload: FilterOptions }
  | { type: 'SET_PERIOD'; payload: 'daily' | 'weekly' | 'monthly' }
  | { type: 'SET_MONTHLY_GOAL'; payload: MonthlyGoal | null }
  | { type: 'SET_MONTHLY_GOAL_HISTORY'; payload: MonthlyGoalHistory[] }
  | { type: 'ADD_MONTHLY_GOAL_TO_HISTORY'; payload: MonthlyGoalHistory }
  | { type: 'LOAD_DATA'; payload: { revenues: Revenue[]; expenses: Expense[]; monthlyGoal?: MonthlyGoal; monthlyGoalHistory?: MonthlyGoalHistory[] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_TIMESTAMP' };

const initialState: FinanceState = {
  revenues: [],
  expenses: [],
  filters: {},
  monthlyGoal: null,
  monthlyGoalHistory: [],
  selectedPeriod: 'daily',
  isLoading: false,
  error: null,
  lastUpdated: Date.now(),
};

const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'ADD_REVENUE':
      return {
        ...state,
        revenues: [...state.revenues, action.payload],
        lastUpdated: Date.now(),
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
        lastUpdated: Date.now(),
      };
    case 'UPDATE_REVENUE':
      return {
        ...state,
        revenues: state.revenues.map((revenue) =>
          revenue.id === action.payload.id ? action.payload : revenue
        ),
        lastUpdated: Date.now(),
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
        lastUpdated: Date.now(),
      };
    case 'DELETE_REVENUE':
      return {
        ...state,
        revenues: state.revenues.filter((revenue) => revenue.id !== action.payload),
        lastUpdated: Date.now(),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
        lastUpdated: Date.now(),
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
      };
    case 'SET_PERIOD':
      return {
        ...state,
        selectedPeriod: action.payload,
      };
    case 'SET_MONTHLY_GOAL':
      return {
        ...state,
        monthlyGoal: action.payload,
      };
    case 'SET_MONTHLY_GOAL_HISTORY':
      return {
        ...state,
        monthlyGoalHistory: action.payload,
      };
    case 'ADD_MONTHLY_GOAL_TO_HISTORY':
      return {
        ...state,
        monthlyGoalHistory: [...state.monthlyGoalHistory, action.payload],
      };
    case 'LOAD_DATA':
      return {
        ...state,
        revenues: action.payload.revenues,
        expenses: action.payload.expenses,
        monthlyGoal: action.payload.monthlyGoal || state.monthlyGoal,
        monthlyGoalHistory: action.payload.monthlyGoalHistory || state.monthlyGoalHistory,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_TIMESTAMP':
      return {
        ...state,
        lastUpdated: Date.now(),
      };
    default:
      return state;
  }
};

interface FinanceContextType {
  state: FinanceState;
  addRevenue: (revenue: Omit<Revenue, 'id' | 'createdAt' | 'updatedAt' | 'driverId'>) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'driverId'>) => Promise<void>;
  updateRevenue: (id: string, revenue: Partial<Revenue>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteRevenue: (id: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  setFilters: (filters: FilterOptions) => void;
  setPeriod: (period: 'daily' | 'weekly' | 'monthly') => void;
  setMonthlyGoal: (goal: MonthlyGoal | null) => void;
  getMonthlyGoalHistory: () => MonthlyGoalHistory[];
  addMonthlyGoalToHistory: (goal: MonthlyGoalHistory) => void;
  checkAndResetMonthlyGoal: () => Promise<void>;
  getDashboardData: () => Promise<DashboardData>;
  getPeriodMetrics: () => Promise<PeriodMetrics>;
  getFilteredRevenues: () => Revenue[];
  getFilteredExpenses: () => Expense[];
  loadData: () => Promise<void>;
  reloadData: () => Promise<void>; // Nova função para forçar recarregamento
  clearError: () => void;
  updateTimestamp: () => void; // Função para atualizar timestamp
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const { state: authState } = useAuth();

  // Load data when authenticated
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      loadData();
    }
  }, [authState.isAuthenticated, authState.isLoading]);

  // Listen for auth success events to reload data
  useEffect(() => {
    const handleAuthSuccess = () => {
      loadData();
    };

    // Adicionar listener para web (apenas se window e addEventListener existirem)
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('auth-success', handleAuthSuccess);
      
      return () => {
        if (window.removeEventListener) {
          window.removeEventListener('auth-success', handleAuthSuccess);
        }
      };
    }
  }, [authState.isAuthenticated]);

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      // Definir mês atual para a meta mensal
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const [revenuesResponse, expensesResponse, monthlyGoalResponse] = await Promise.all([
        apiService.getRevenues({ limit: 100 }),
        apiService.getExpenses({ limit: 100 }),
        apiService.getMonthlyGoal(currentMonth),
      ]);

      // Usar a meta mensal do endpoint correto
      let finalMonthlyGoal = null;
      if (monthlyGoalResponse.success && monthlyGoalResponse.data) {
        finalMonthlyGoal = monthlyGoalResponse;
      }


      dispatch({
        type: 'LOAD_DATA',
        payload: {
          revenues: revenuesResponse.data.data,
          expenses: expensesResponse.data.data,
          monthlyGoal: finalMonthlyGoal && finalMonthlyGoal.success ? finalMonthlyGoal.data : undefined,
        },
      });
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load data',
      });
    }
  };

  const addRevenue = async (revenueData: Omit<Revenue, 'id' | 'createdAt' | 'updatedAt' | 'driverId'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.createRevenue(revenueData);
      
      if (response.success) {
        dispatch({ type: 'ADD_REVENUE', payload: response.data });
        // Atualizar meta mensal localmente após adicionar receita
        updateMonthlyGoalLocally();
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to add revenue',
      });
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'driverId'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.createExpense(expenseData);
      
      if (response.success) {
        dispatch({ type: 'ADD_EXPENSE', payload: response.data });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to add expense',
      });
    }
  };

  const updateRevenue = async (id: string, revenue: Partial<Revenue>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.updateRevenue(id, revenue);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_REVENUE', payload: response.data });
        // Atualizar meta mensal localmente após atualizar receita
        updateMonthlyGoalLocally();
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to update revenue',
      });
    }
  };

  const updateExpense = async (id: string, expense: Partial<Expense>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.updateExpense(id, expense);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_EXPENSE', payload: response.data });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to update expense',
      });
    }
  };

  const deleteRevenue = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.deleteRevenue(id);
      
      if (response.success) {
        dispatch({ type: 'DELETE_REVENUE', payload: id });
        // Atualizar meta mensal localmente após deletar receita
        updateMonthlyGoalLocally();
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to delete revenue',
      });
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.deleteExpense(id);
      
      if (response.success) {
        dispatch({ type: 'DELETE_EXPENSE', payload: id });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to delete expense',
      });
    }
  };

  const setFilters = (filters: FilterOptions) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setPeriod = (period: 'daily' | 'weekly' | 'monthly') => {
    dispatch({ type: 'SET_PERIOD', payload: period });
  };

  const setMonthlyGoal = (goal: MonthlyGoal | null) => {
    dispatch({ type: 'SET_MONTHLY_GOAL', payload: goal });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const reloadData = async () => {
    await loadData();
  };

  const getFilteredRevenues = (): Revenue[] => {
    let filtered = state.revenues;

    if (state.filters.startDate) {
      filtered = filtered.filter((revenue) => revenue.date >= state.filters.startDate!);
    }

    if (state.filters.endDate) {
      filtered = filtered.filter((revenue) => revenue.date <= state.filters.endDate!);
    }

    if (state.filters.platform) {
      filtered = filtered.filter((revenue) => revenue.platform === state.filters.platform);
    }

    return filtered;
  };

  const getFilteredExpenses = (): Expense[] => {
    let filtered = state.expenses;

    if (state.filters.startDate) {
      filtered = filtered.filter((expense) => expense.date >= state.filters.startDate!);
    }

    if (state.filters.endDate) {
      filtered = filtered.filter((expense) => expense.date <= state.filters.endDate!);
    }

    if (state.filters.category) {
      filtered = filtered.filter((expense) => expense.category === state.filters.category);
    }

    return filtered;
  };

  const getDashboardData = async (): Promise<DashboardData> => {
    try {
      
      const response = await apiService.getDashboardData(state.filters);
      
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error('Failed to get dashboard data');
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  };

  const getPeriodMetrics = async (): Promise<PeriodMetrics> => {
    try {
      const dashboardData = await getDashboardData();
      
      return {
        period: state.selectedPeriod,
        averageEarnings: dashboardData.totalRevenue,
        averageEarningsPerHour: dashboardData.averageEarningsPerHour,
        averageEarningsPerKm: dashboardData.averageEarningsPerKm,
        totalHoursWorked: dashboardData.totalHoursWorked,
        averageHoursWorked: dashboardData.averageHoursPerPeriod,
        totalKilometersRidden: dashboardData.totalKilometersRidden,
        workingDaysCount: dashboardData.workingDaysCount,
        totalTripsCount: dashboardData.totalTripsCount,
        averageEarningsPerTrip: dashboardData.averageEarningsPerTrip,
      };
    } catch (error) {
      console.error('Error getting period metrics:', error);
      throw error;
    }
  };

  const updateTimestamp = () => {
    dispatch({ type: 'UPDATE_TIMESTAMP' });
  };

  // Função para calcular o valor atual da meta mensal baseado nas receitas do mês atual
  const calculateCurrentGoalAmount = (): number => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Filtrar receitas do mês atual
    const currentMonthRevenues = state.revenues.filter(revenue => {
      const revenueDate = new Date(revenue.date);
      const revenueMonth = `${revenueDate.getFullYear()}-${String(revenueDate.getMonth() + 1).padStart(2, '0')}`;
      return revenueMonth === currentMonth;
    });
    
    // Somar todas as receitas do mês atual
    return currentMonthRevenues.reduce((sum, revenue) => sum + revenue.value, 0);
  };

  // Função para atualizar apenas localmente (sem API)
  const updateMonthlyGoalLocally = () => {
    if (!state.monthlyGoal) return;
    
    const currentAmount = calculateCurrentGoalAmount();
    
    // Se o valor atual é diferente do valor armazenado na meta, atualizar localmente
    if (currentAmount !== state.monthlyGoal.currentAmount) {
      const updatedGoal = {
        ...state.monthlyGoal,
        currentAmount: currentAmount
      };
      
      dispatch({ type: 'SET_MONTHLY_GOAL', payload: updatedGoal });
    }
  };

  const getMonthlyGoalHistory = () => {
    return state.monthlyGoalHistory;
  };

  const addMonthlyGoalToHistory = (goal: MonthlyGoalHistory) => {
    dispatch({ type: 'ADD_MONTHLY_GOAL_TO_HISTORY', payload: goal });
  };

  const checkAndResetMonthlyGoal = async () => {
    if (!state.monthlyGoal) return;

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const goalMonth = state.monthlyGoal.month;

    // Se estamos em um mês diferente da meta atual, arquivar a meta anterior
    if (goalMonth !== currentMonth) {
      const historyEntry: MonthlyGoalHistory = {
        id: `history-${goalMonth}-${state.monthlyGoal.id}`,
        month: goalMonth,
        targetAmount: state.monthlyGoal.targetAmount,
        achievedAmount: state.monthlyGoal.currentAmount,
        percentage: (state.monthlyGoal.currentAmount / state.monthlyGoal.targetAmount) * 100,
        wasAchieved: state.monthlyGoal.currentAmount >= state.monthlyGoal.targetAmount,
        driverId: state.monthlyGoal.driverId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addMonthlyGoalToHistory(historyEntry);
      
      // Zerar a meta atual para o novo mês
      dispatch({ type: 'SET_MONTHLY_GOAL', payload: null });
      
      // Recarregar dados para criar nova meta baseada nas metas de desempenho
      await loadData();
    }
  };

  const value: FinanceContextType = {
    state,
    addRevenue,
    addExpense,
    updateRevenue,
    updateExpense,
    deleteRevenue,
    deleteExpense,
    setFilters,
    setPeriod,
    setMonthlyGoal,
    getMonthlyGoalHistory,
    addMonthlyGoalToHistory,
    checkAndResetMonthlyGoal,
    getDashboardData,
    getPeriodMetrics,
    getFilteredRevenues,
    getFilteredExpenses,
    loadData,
    reloadData,
    clearError,
    updateTimestamp,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};