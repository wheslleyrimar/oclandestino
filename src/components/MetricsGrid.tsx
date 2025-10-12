import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { StatCard } from './StatCard';

export const MetricsGrid: React.FC = () => {
  const { getDashboardData, getPeriodMetrics } = useFinance();
  const dashboardData = getDashboardData();
  const periodMetrics = getPeriodMetrics();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Métricas de Performance</Text>
      
      <View style={styles.grid}>
        <StatCard
          title="Ganho por Hora"
          value={`R$ ${dashboardData.averageEarningsPerHour.toFixed(2)}`}
          icon="⏰"
          color="#0ea5e9"
        />
        <StatCard
          title="Ganho por KM"
          value={`R$ ${dashboardData.averageEarningsPerKm.toFixed(2)}`}
          icon="🛣️"
          color="#8b5cf6"
        />
        <StatCard
          title="Horas Trabalhadas"
          value={`${dashboardData.totalHoursWorked.toFixed(1)}h`}
          icon="🕐"
          color="#f59e0b"
        />
        <StatCard
          title="KM Rodados"
          value={`${dashboardData.totalKilometersRidden.toFixed(1)} km`}
          icon="📏"
          color="#06b6d4"
        />
        <StatCard
          title="Total de Corridas"
          value={dashboardData.totalTripsCount.toString()}
          icon="🚗"
          color="#22c55e"
        />
        <StatCard
          title="Ganho por Corrida"
          value={`R$ ${dashboardData.averageEarningsPerTrip.toFixed(2)}`}
          icon="💰"
          color="#ef4444"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});