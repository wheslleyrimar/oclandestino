import { DashboardData } from '../services/apiService';
import { Revenue } from '../types';

export interface IndicatorsData {
  averagePerPeriod: number;
  averagePerHour: number;
  averagePerKm: number;
  hoursWorked: number;
  averageHours: number;
  totalKms: number;
  daysWorked: number;
  tripsCompleted: number;
  averagePerTrip: number;
}

export const calculateIndicators = (
  dashboardData: DashboardData,
  revenues: Revenue[],
  period: 'daily' | 'weekly' | 'monthly'
): IndicatorsData => {

  // Garantir que revenues seja sempre um array
  const safeRevenues = Array.isArray(revenues) ? revenues : [];

  // Calcular número de dias no período
  const getDaysInPeriod = (period: 'daily' | 'weekly' | 'monthly'): number => {
    const now = new Date();
    switch (period) {
      case 'daily':
        return 1;
      case 'weekly':
        return 7;
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      default:
        return 1;
    }
  };

  const daysInPeriod = getDaysInPeriod(period);

  // Calcular totais das receitas
  const totalRevenue = dashboardData.totalRevenue || 0;
  
  // Tentar usar dados das receitas primeiro, depois fallback para dados do dashboard
  const totalHoursWorked = safeRevenues.length > 0 
    ? safeRevenues.reduce((sum, revenue) => sum + (revenue.hoursWorked || 0), 0)
    : dashboardData.totalHoursWorked || 0;
    
  const totalKilometers = safeRevenues.length > 0
    ? safeRevenues.reduce((sum, revenue) => sum + (revenue.kilometersRidden || 0), 0)
    : dashboardData.totalKilometersRidden || 0;
    
  const totalTrips = safeRevenues.length > 0
    ? safeRevenues.reduce((sum, revenue) => sum + (revenue.tripsCount || 0), 0)
    : dashboardData.totalTripsCount || 0;

  // Contar dias únicos com receitas
  const uniqueDays = safeRevenues.length > 0 
    ? new Set(safeRevenues.map(revenue => revenue.date)).size
    : dashboardData.workingDaysCount || 0;
  
  // Para período diário, se há receitas, significa que trabalhou 1 dia
  const daysWorked = period === 'daily' 
    ? (safeRevenues.length > 0 ? 1 : 0)
    : uniqueDays;



  // Calcular indicadores
  const indicators: IndicatorsData = {
    // 1. Média por Período - Total de receita dividido pelo número de dias no período
    averagePerPeriod: daysInPeriod > 0 ? totalRevenue / daysInPeriod : 0,
    
    // 2. Média por Hora - Total de receita dividido pelas horas trabalhadas
    averagePerHour: totalHoursWorked > 0 ? totalRevenue / totalHoursWorked : 0,
    
    // 3. Média por KM - Total de receita dividido pelos quilômetros rodados
    averagePerKm: totalKilometers > 0 ? totalRevenue / totalKilometers : 0,
    
    // 4. Horas Trabalhadas - Total de horas trabalhadas
    hoursWorked: totalHoursWorked,
    
    // 5. Média de Horas - Horas trabalhadas dividido pelos dias trabalhados
    averageHours: daysWorked > 0 ? totalHoursWorked / daysWorked : 0,
    
    // 6. Total de KMs - Total de quilômetros rodados
    totalKms: totalKilometers,
    
    // 7. Dias Trabalhados - Número de dias únicos com receitas
    daysWorked: daysWorked,
    
    // 8. Corridas Realizadas - Total de corridas
    tripsCompleted: totalTrips,
    
    // 9. Média por Corrida - Total de receita dividido pelo número de corridas
    averagePerTrip: totalTrips > 0 ? totalRevenue / totalTrips : 0,
  };

  return indicators;
};

export const formatCurrency = (value: number): string => {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
};

export const formatTime = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}:${minutes.toString().padStart(2, '0')}h`;
};

export const formatDistance = (kilometers: number): string => {
  return `${kilometers.toFixed(1)} KM`;
};

export const formatCount = (count: number, unit: string): string => {
  return `${count} ${unit}`;
};
