export interface Revenue {
  id: string;
  value: number;
  date: string;
  description: string;
  platform: 'Uber' | '99' | 'inDrive' | 'Cabify' | 'Outros';
  createdAt: string;
  // New fields for enhanced metrics
  hoursWorked?: number;
  kilometersRidden?: number;
  tripsCount?: number;
}

export interface Expense {
  id: string;
  value: number;
  date: string;
  description: string;
  category: 'Combustível' | 'Manutenção' | 'Alimentação' | 'Pedágio' | 'Estacionamento' | 'Outros';
  createdAt: string;
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
  // New metrics
  totalHoursWorked: number;
  totalKilometersRidden: number;
  totalTripsCount: number;
  averageEarningsPerHour: number;
  averageEarningsPerKm: number;
  averageEarningsPerTrip: number;
  averageHoursPerPeriod: number;
  workingDaysCount: number;
}

export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  platform?: string;
  category?: string;
  period?: 'daily' | 'weekly' | 'monthly';
}

export interface MonthlyGoal {
  id: string;
  targetAmount: number;
  currentAmount: number;
  month: string; // YYYY-MM format
  platformBreakdown: Array<{
    platform: string;
    percentage: number;
    amount: number;
  }>;
}

export interface PeriodMetrics {
  period: 'daily' | 'weekly' | 'monthly';
  averageEarnings: number;
  averageEarningsPerHour: number;
  averageEarningsPerKm: number;
  totalHoursWorked: number;
  averageHoursWorked: number;
  totalKilometersRidden: number;
  workingDaysCount: number;
  totalTripsCount: number;
  averageEarningsPerTrip: number;
}

export type Platform = 'Uber' | '99' | 'inDrive' | 'Cabify' | 'Outros';
export type ExpenseCategory = 'Combustível' | 'Manutenção' | 'Alimentação' | 'Pedágio' | 'Estacionamento' | 'Outros';

// Configuration types
export interface DriverProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleModel: string;
  vehiclePlate: string;
  avatar?: string;
}

export interface PerformanceGoals {
  id: string;
  monthlyEarningsGoal: number;
  dailyTripsGoal: number;
  weeklyHoursGoal: number;
  monthlyHoursGoal: number;
  averageEarningsPerHourGoal: number;
  averageEarningsPerTripGoal: number;
  workingDaysPerWeekGoal: number;
}

export interface AppPreferences {
  id: string;
  language: 'pt-BR' | 'en-US' | 'es-ES';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    earnings: boolean;
    goals: boolean;
    reminders: boolean;
    promotions: boolean;
  };
  currency: 'BRL' | 'USD' | 'EUR';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '24h' | '12h';
}

export interface ConfigurationState {
  profile: DriverProfile;
  goals: PerformanceGoals;
  preferences: AppPreferences;
}