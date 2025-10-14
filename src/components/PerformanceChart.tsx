import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { DashboardData } from '../services/apiService';

interface PerformanceChartProps {
  data: DashboardData;
  period: 'daily' | 'weekly' | 'monthly';
}

const screenWidth = Dimensions.get('window').width;
const chartWidth = Math.min(screenWidth - 80, 320); // Limitar largura máxima

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, period }) => {
  const { state: themeState } = useTheme();
  
  // Verificação de segurança para o tema
  if (!themeState || !themeState.colors) {
    return null;
  }

  const styles = createStyles(themeState.colors);
  // Preparar dados para gráfico de linha (performance ao longo do tempo)
  const preparePerformanceLineData = () => {
    if (!data.dailyProfit || data.dailyProfit.length === 0) {
      return {
        labels: ['N/A'],
        datasets: [
          {
            data: [0],
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      };
    }

    const sortedData = data.dailyProfit
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Últimos 7 dias

    return {
      labels: sortedData.map(item => {
        const date = new Date(item.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      datasets: [
        {
          data: sortedData.map(item => item.profit),
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  // Preparar dados para gráfico de barras (métricas de performance)
  const prepareMetricsBarData = () => {
    const metrics = [
      { label: 'R$/Hora', value: data.averageEarningsPerHour || 0 },
      { label: 'R$/KM', value: data.averageEarningsPerKm || 0 },
      { label: 'R$/Corrida', value: data.averageEarningsPerTrip || 0 },
    ];

    return {
      labels: metrics.map(item => item.label),
      datasets: [
        {
          data: metrics.map(item => item.value),
        },
      ],
    };
  };

  const chartConfig = {
    backgroundColor: themeState.colors.surface,
    backgroundGradientFrom: themeState.colors.surface,
    backgroundGradientTo: themeState.colors.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${themeState.isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#3b82f6',
    },
  };

  const lineChartData = preparePerformanceLineData();
  const barChartData = prepareMetricsBarData();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ Análise de Performance</Text>
      
      {/* Gráfico de Linha - Lucro ao longo do tempo */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>📈 Lucro Diário</Text>
        <LineChart
          data={lineChartData}
          width={chartWidth}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={false}
        />
      </View>

      {/* Gráfico de Barras - Métricas de Performance */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>📊 Métricas de Performance</Text>
        <BarChart
          data={barChartData}
          width={chartWidth}
          height={180}
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={false}
        />
      </View>

      {/* Resumo de Métricas */}
      <View style={styles.metricsContainer}>
        <Text style={styles.chartTitle}>📋 Resumo de Performance</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Total de Horas</Text>
            <Text style={styles.metricValue}>{data.totalHoursWorked?.toFixed(1) || 0}h</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Total de KMs</Text>
            <Text style={styles.metricValue}>{data.totalKilometersRidden?.toFixed(1) || 0} KM</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Total de Corridas</Text>
            <Text style={styles.metricValue}>{data.totalTripsCount || 0}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Dias Trabalhados</Text>
            <Text style={styles.metricValue}>{data.workingDaysCount || 0}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  chartContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden', // Prevenir overflow
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  metricsContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden', // Prevenir overflow
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
});
