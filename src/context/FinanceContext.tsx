import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Revenue, Expense, DashboardData, FilterOptions, MonthlyGoal, PeriodMetrics } from '../types';
import { mockRevenues, mockExpenses, mockMonthlyGoal } from '../data/mockData';

interface FinanceState {
  revenues: Revenue[];
  expenses: Expense[];
  filters: FilterOptions;
  monthlyGoal: MonthlyGoal | null;
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
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
  | { type: 'SET_MONTHLY_GOAL'; payload: MonthlyGoal }
  | { type: 'LOAD_DATA'; payload: { revenues: Revenue[]; expenses: Expense[]; monthlyGoal?: MonthlyGoal } };

const initialState: FinanceState = {
  revenues: [],
  expenses: [],
  filters: {},
  monthlyGoal: null,
  selectedPeriod: 'monthly',
};

const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'ADD_REVENUE':
      return {
        ...state,
        revenues: [...state.revenues, action.payload],
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case 'UPDATE_REVENUE':
      return {
        ...state,
        revenues: state.revenues.map((revenue) =>
          revenue.id === action.payload.id ? action.payload : revenue
        ),
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'DELETE_REVENUE':
      return {
        ...state,
        revenues: state.revenues.filter((revenue) => revenue.id !== action.payload),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
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
    case 'LOAD_DATA':
      return {
        ...state,
        revenues: action.payload.revenues,
        expenses: action.payload.expenses,
        monthlyGoal: action.payload.monthlyGoal || state.monthlyGoal,
      };
    default:
      return state;
  }
};

interface FinanceContextType {
  state: FinanceState;
  addRevenue: (revenue: Omit<Revenue, 'id' | 'createdAt'>) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateRevenue: (revenue: Revenue) => void;
  updateExpense: (expense: Expense) => void;
  deleteRevenue: (id: string) => void;
  deleteExpense: (id: string) => void;
  setFilters: (filters: FilterOptions) => void;
  setPeriod: (period: 'daily' | 'weekly' | 'monthly') => void;
  setMonthlyGoal: (goal: MonthlyGoal) => void;
  getDashboardData: () => DashboardData;
  getPeriodMetrics: () => PeriodMetrics;
  getFilteredRevenues: () => Revenue[];
  getFilteredExpenses: () => Expense[];
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

  // Load mock data on first render
  useEffect(() => {
    dispatch({ 
      type: 'LOAD_DATA', 
      payload: { 
        revenues: mockRevenues, 
        expenses: mockExpenses,
        monthlyGoal: mockMonthlyGoal
      } 
    });
  }, []);

  const addRevenue = (revenueData: Omit<Revenue, 'id' | 'createdAt'>) => {
    const revenue: Revenue = {
      ...revenueData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_REVENUE', payload: revenue });
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const expense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const updateRevenue = (revenue: Revenue) => {
    dispatch({ type: 'UPDATE_REVENUE', payload: revenue });
  };

  const updateExpense = (expense: Expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
  };

  const deleteRevenue = (id: string) => {
    dispatch({ type: 'DELETE_REVENUE', payload: id });
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const setFilters = (filters: FilterOptions) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setPeriod = (period: 'daily' | 'weekly' | 'monthly') => {
    dispatch({ type: 'SET_PERIOD', payload: period });
  };

  const setMonthlyGoal = (goal: MonthlyGoal) => {
    dispatch({ type: 'SET_MONTHLY_GOAL', payload: goal });
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

  const getDashboardData = (): DashboardData => {
    const filteredRevenues = getFilteredRevenues();
    const filteredExpenses = getFilteredExpenses();

    const totalRevenue = filteredRevenues.reduce((sum, revenue) => sum + revenue.value, 0);
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.value, 0);
    const netProfit = totalRevenue - totalExpenses;

    // New metrics calculations
    const totalHoursWorked = filteredRevenues.reduce((sum, revenue) => sum + (revenue.hoursWorked || 0), 0);
    const totalKilometersRidden = filteredRevenues.reduce((sum, revenue) => sum + (revenue.kilometersRidden || 0), 0);
    const totalTripsCount = filteredRevenues.reduce((sum, revenue) => sum + (revenue.tripsCount || 0), 0);
    
    const averageEarningsPerHour = totalHoursWorked > 0 ? totalRevenue / totalHoursWorked : 0;
    const averageEarningsPerKm = totalKilometersRidden > 0 ? totalRevenue / totalKilometersRidden : 0;
    const averageEarningsPerTrip = totalTripsCount > 0 ? totalRevenue / totalTripsCount : 0;
    
    // Working days count
    const workingDays = new Set(filteredRevenues.map(r => r.date));
    const workingDaysCount = workingDays.size;
    const averageHoursPerPeriod = workingDaysCount > 0 ? totalHoursWorked / workingDaysCount : 0;

    // Revenue by platform
    const revenueByPlatform = filteredRevenues.reduce((acc, revenue) => {
      const existing = acc.find((item) => item.platform === revenue.platform);
      if (existing) {
        existing.value += revenue.value;
      } else {
        acc.push({ platform: revenue.platform, value: revenue.value });
      }
      return acc;
    }, [] as Array<{ platform: string; value: number }>);

    // Expenses by category
    const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
      const existing = acc.find((item) => item.category === expense.category);
      if (existing) {
        existing.value += expense.value;
      } else {
        acc.push({ category: expense.category, value: expense.value });
      }
      return acc;
    }, [] as Array<{ category: string; value: number }>);

    // Daily profit calculation
    const allDates = new Set([
      ...filteredRevenues.map((r) => r.date),
      ...filteredExpenses.map((e) => e.date),
    ]);

    const dailyProfit = Array.from(allDates)
      .sort()
      .map((date) => {
        const dayRevenue = filteredRevenues
          .filter((r) => r.date === date)
          .reduce((sum, r) => sum + r.value, 0);
        const dayExpenses = filteredExpenses
          .filter((e) => e.date === date)
          .reduce((sum, e) => sum + e.value, 0);
        return {
          date,
          revenue: dayRevenue,
          expenses: dayExpenses,
          profit: dayRevenue - dayExpenses,
        };
      });

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      revenueByPlatform,
      expensesByCategory,
      dailyProfit,
      totalHoursWorked,
      totalKilometersRidden,
      totalTripsCount,
      averageEarningsPerHour,
      averageEarningsPerKm,
      averageEarningsPerTrip,
      averageHoursPerPeriod,
      workingDaysCount,
    };
  };

  const getPeriodMetrics = (): PeriodMetrics => {
    const dashboardData = getDashboardData();
    
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
    getDashboardData,
    getPeriodMetrics,
    getFilteredRevenues,
    getFilteredExpenses,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};