import { authService } from './authService';
import { Revenue, Expense, DriverProfile, PerformanceGoals, MonthlyGoal, AppPreferences, FilterOptions } from '../types';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.getBaseUrl();

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DashboardData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueByPlatform: Array<{
    platform: string;
    value: number;
  }>;
  expensesByCategory: Array<{
    category: string;
    value: number;
  }>;
  dailyProfit: Array<{
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  totalHoursWorked: number;
  totalKilometersRidden: number;
  totalTripsCount: number;
  averageEarningsPerHour: number;
  averageEarningsPerKm: number;
  averageEarningsPerTrip: number;
  averageHoursPerPeriod: number;
  workingDaysCount: number;
}

export interface RevenueByPlatform {
  platform: string;
  value: number;
}

export interface ExpenseByCategory {
  category: string;
  value: number;
}

class APIService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const headers = {
        ...authService.getAuthHeaders(),
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Revenue endpoints
  async getRevenues(filters?: FilterOptions & { page?: number; limit?: number }): Promise<APIResponse<PaginatedResponse<Revenue>>> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);
    if (filters?.platform) params.append('platform', filters.platform);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit && filters.limit > 0) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/revenues${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<PaginatedResponse<Revenue>>(endpoint);
  }

  async createRevenue(revenue: Omit<Revenue, 'id' | 'createdAt' | 'updatedAt' | 'driverId'>): Promise<APIResponse<Revenue>> {
    return this.makeRequest<Revenue>('/revenues', {
      method: 'POST',
      body: JSON.stringify(revenue),
    });
  }

  async updateRevenue(id: string, revenue: Partial<Revenue>): Promise<APIResponse<Revenue>> {
    return this.makeRequest<Revenue>(`/revenues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(revenue),
    });
  }

  async deleteRevenue(id: string): Promise<APIResponse<void>> {
    return this.makeRequest<void>(`/revenues/${id}`, {
      method: 'DELETE',
    });
  }

  async getRevenueById(id: string): Promise<APIResponse<Revenue>> {
    return this.makeRequest<Revenue>(`/revenues/${id}`);
  }

  async getRevenueByPlatform(filters?: FilterOptions): Promise<APIResponse<RevenueByPlatform[]>> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);

    const queryString = params.toString();
    const endpoint = `/revenues/platform${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<RevenueByPlatform[]>(endpoint);
  }

  // Expense endpoints
  async getExpenses(filters?: FilterOptions & { page?: number; limit?: number }): Promise<APIResponse<PaginatedResponse<Expense>>> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit && filters.limit > 0) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/expenses${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<PaginatedResponse<Expense>>(endpoint);
  }

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'driverId'>): Promise<APIResponse<Expense>> {
    return this.makeRequest<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  async updateExpense(id: string, expense: Partial<Expense>): Promise<APIResponse<Expense>> {
    return this.makeRequest<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  }

  async deleteExpense(id: string): Promise<APIResponse<void>> {
    return this.makeRequest<void>(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  async getExpenseById(id: string): Promise<APIResponse<Expense>> {
    return this.makeRequest<Expense>(`/expenses/${id}`);
  }

  async getExpenseByCategory(filters?: FilterOptions): Promise<APIResponse<ExpenseByCategory[]>> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);

    const queryString = params.toString();
    const endpoint = `/expenses/category${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<ExpenseByCategory[]>(endpoint);
  }

  // Dashboard endpoints
  async getDashboardData(filters?: FilterOptions): Promise<APIResponse<DashboardData>> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);

    const queryString = params.toString();
    const endpoint = `/dashboard${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<DashboardData>(endpoint);
  }

  async getDashboardSummary(filters?: FilterOptions): Promise<APIResponse<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
  }>> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);

    const queryString = params.toString();
    const endpoint = `/dashboard/summary${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<{
      totalRevenue: number;
      totalExpenses: number;
      netProfit: number;
    }>(endpoint);
  }

  async getDashboardTrends(filters?: FilterOptions): Promise<APIResponse<Array<{
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>>> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);

    const queryString = params.toString();
    const endpoint = `/dashboard/trends${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<Array<{
      date: string;
      revenue: number;
      expenses: number;
      profit: number;
    }>>(endpoint);
  }

  async getDashboardRevenueByPlatform(filters?: FilterOptions): Promise<APIResponse<RevenueByPlatform[]>> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);
    if (filters?.platform) params.append('platform', filters.platform);

    const queryString = params.toString();
    const endpoint = `/dashboard/revenue-by-platform${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<RevenueByPlatform[]>(endpoint);
  }

  async getDashboardExpensesByCategory(filters?: FilterOptions): Promise<APIResponse<ExpenseByCategory[]>> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);
    if (filters?.category) params.append('category', filters.category);

    const queryString = params.toString();
    const endpoint = `/dashboard/expenses-by-category${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<ExpenseByCategory[]>(endpoint);
  }

  // Profile endpoints
  async getProfile(): Promise<APIResponse<DriverProfile>> {
    try {
      return await this.makeRequest<DriverProfile>('/auth/profile');
    } catch (error) {
      // Se o perfil não existir, retorna null em vez de erro
      if (error instanceof Error && error.message.includes('Driver not found')) {
        return {
          success: false,
          data: null as any,
          message: 'Profile not found'
        };
      }
      throw error;
    }
  }

  async updateProfile(profile: Partial<DriverProfile>): Promise<APIResponse<DriverProfile>> {
    return this.makeRequest<DriverProfile>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Goals endpoints
  async getPerformanceGoals(): Promise<APIResponse<PerformanceGoals>> {
    try {
      return await this.makeRequest<PerformanceGoals>('/goals/performance');
    } catch (error) {
      // Se as metas de performance não existirem, retorna null em vez de erro
      if (error instanceof Error && error.message.includes('Performance goals not found')) {
        return {
          success: false,
          data: null as any,
          message: 'Performance goals not found'
        };
      }
      throw error;
    }
  }

  async updatePerformanceGoals(goals: Partial<PerformanceGoals>): Promise<APIResponse<PerformanceGoals>> {
    return this.makeRequest<PerformanceGoals>('/goals/performance', {
      method: 'PUT',
      body: JSON.stringify(goals),
    });
  }

  async getPerformanceGoals(): Promise<APIResponse<PerformanceGoals>> {
    try {
      const endpoint = '/goals/performance';


      const response = await this.makeRequest<PerformanceGoals>(endpoint);
      
      return response;
    } catch (error) {
      console.error('Erro ao buscar metas de desempenho:', error);
      throw error;
    }
  }

  async getMonthlyGoal(month?: string): Promise<APIResponse<MonthlyGoal>> {
    try {
      const params = new URLSearchParams();
      if (month) params.append('month', month);

      const queryString = params.toString();
      const endpoint = `/goals/monthly${queryString ? `?${queryString}` : ''}`;


      const response = await this.makeRequest<MonthlyGoal>(endpoint);
      
      return response;
    } catch (error) {
      console.error('Erro ao buscar meta mensal específica:', error);
      // Se a meta mensal não existir, retorna null em vez de erro
      if (error instanceof Error && error.message.includes('Monthly goal not found')) {
        return {
          success: false,
          data: null as any,
          message: 'Monthly goal not found'
        };
      }
      throw error;
    }
  }

  async createMonthlyGoal(goal: Omit<MonthlyGoal, 'id' | 'createdAt' | 'updatedAt' | 'driverId'>): Promise<APIResponse<MonthlyGoal>> {
    return this.makeRequest<MonthlyGoal>('/goals/monthly', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }

  async updateMonthlyGoal(id: string, goal: Partial<MonthlyGoal>): Promise<APIResponse<MonthlyGoal>> {
    return this.makeRequest<MonthlyGoal>(`/goals/monthly/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goal),
    });
  }

  async deleteMonthlyGoal(id: string): Promise<APIResponse<void>> {
    return this.makeRequest<void>(`/goals/monthly/${id}`, {
      method: 'DELETE',
    });
  }

  async getMonthlyGoalHistory(limit?: number): Promise<APIResponse<MonthlyGoal[]>> {
    const params = new URLSearchParams();
    if (limit && limit > 0) params.append('limit', limit.toString());

    const queryString = params.toString();
    const endpoint = `/goals/monthly/history${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<MonthlyGoal[]>(endpoint);
  }

  // Preferences endpoints
  async getPreferences(): Promise<APIResponse<AppPreferences>> {
    return this.makeRequest<AppPreferences>('/preferences');
  }

  async updatePreferences(preferences: Partial<AppPreferences>): Promise<APIResponse<AppPreferences>> {
    return this.makeRequest<AppPreferences>('/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  async updateNotificationSettings(settings: {
    earnings: boolean;
    goals: boolean;
    reminders: boolean;
    promotions: boolean;
  }): Promise<APIResponse<void>> {
    return this.makeRequest<void>('/preferences/notifications', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Utility endpoints
  async getHealthCheck(): Promise<APIResponse<{
    status: string;
    time: string;
  }>> {
    return this.makeRequest<{
      status: string;
      time: string;
    }>('/health');
  }

  async getAPIDocumentation(): Promise<APIResponse<{
    message: string;
    version: string;
    endpoints: {
      health: string;
      auth: string;
      revenues: string;
      expenses: string;
      dashboard: string;
      goals: string;
      monthly_goal: string;
      preferences: string;
    };
  }>> {
    return this.makeRequest<{
      message: string;
      version: string;
      endpoints: {
        health: string;
        auth: string;
        revenues: string;
        expenses: string;
        dashboard: string;
        goals: string;
        monthly_goal: string;
        preferences: string;
      };
    }>('/');
  }
}

export const apiService = new APIService();
