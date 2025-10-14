import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { StatCard } from './StatCard';
import { DashboardData, PeriodMetrics } from '../types';

export const MetricsGrid: React.FC = () => {
  const { getDashboardData, getPeriodMetrics, state } = useFinance();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [periodMetrics, setPeriodMetrics] = useState<PeriodMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboard, metrics] = await Promise.all([
          getDashboardData(),
          getPeriodMetrics()
        ]);
        
        setDashboardData(dashboard);
        setPeriodMetrics(metrics);
      } catch (error) {
        console.error('Erro ao carregar dados do MetricsGrid:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [getDashboardData, getPeriodMetrics, state.filters, state.selectedPeriod]);

  if (isLoading || !dashboardData || !periodMetrics) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Métricas de Performance</Text>
        <Text style={styles.loadingText}>Carregando métricas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Métricas de Performance</Text>
      
      <View style={styles.grid}>
        <StatCard
          title="Média por Período"
          value={`R$ ${periodMetrics.averageEarnings.toFixed(2)}`}
          icon="💰"
          color="#22c55e"
        />
        <StatCard
          title="Média por Hora"
          value={`R$ ${periodMetrics.averageEarningsPerHour.toFixed(2)}`}
          icon="⏰"
          color="#ef4444"
        />
        <StatCard
          title="Média por KM"
          value={`R$ ${periodMetrics.averageEarningsPerKm.toFixed(2)}`}
          icon="🛣️"
          color="#22c55e"
        />
        <StatCard
          title="Horas Trabalhadas"
          value={`${periodMetrics.totalHoursWorked.toFixed(1)}h`}
          icon="🕐"
          color="#f59e0b"
        />
        <StatCard
          title="Média de Horas"
          value={`${periodMetrics.averageHoursWorked.toFixed(1)}h`}
          icon="📊"
          color="#8b5cf6"
        />
        <StatCard
          title="Total de KMs"
          value={`${periodMetrics.totalKilometersRidden.toFixed(1)} KM`}
          icon="📏"
          color="#06b6d4"
        />
        <StatCard
          title="Dias Trabalhados"
          value={`${periodMetrics.workingDaysCount} dias`}
          icon="📅"
          color="#0ea5e9"
        />
        <StatCard
          title="Corridas Realizadas"
          value={`${periodMetrics.totalTripsCount} corridas`}
          icon="🚗"
          color="#ef4444"
        />
        <StatCard
          title="Média por Corrida"
          value={`R$ ${periodMetrics.averageEarningsPerTrip.toFixed(2)}`}
          icon="🎯"
          color="#22c55e"
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
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
  },
});