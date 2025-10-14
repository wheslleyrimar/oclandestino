export interface Revenue {
  id: string;
  value: number;
  date: string;
  description: string;
  platform: 'Uber' | '99' | 'inDrive' | 'Cabify' | 'Outros';
  hoursWorked?: number;
  kilometersRidden?: number;
  tripsCount?: number;
  driverId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  value: number;
  date: string;
  description: string;
  category: 'Combustível' | 'Manutenção' | 'Alimentação' | 'Pedágio' | 'Estacionamento' | 'Outros';
  driverId: string;
  createdAt: string;
  updatedAt: string;
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
  driverId: string;
  platformBreakdowns: Array<{
    id: string;
    platform: string;
    percentage: number;
    amount: number;
  }>;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
  driverId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppPreferences {
  id: string;
  language: 'pt-BR' | 'en-US' | 'es-ES';
  theme: 'light' | 'dark' | 'auto';
  currency: 'BRL' | 'USD' | 'EUR';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '24h' | '12h';
  notificationSettings: {
    id: string;
    earnings: boolean;
    goals: boolean;
    reminders: boolean;
    promotions: boolean;
  };
  driverId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigurationState {
  profile: DriverProfile;
  goals: PerformanceGoals;
  preferences: AppPreferences;
  isLoading?: boolean;
  error?: string | null;
}