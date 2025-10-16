import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { DashboardData } from '../services/apiService';

interface RevenueChartProps {
  data: DashboardData;
  period: 'daily' | 'weekly' | 'monthly';
}

const screenWidth = Dimensions.get('window').width;
const chartWidth = Math.min(screenWidth - 80, 320); // Limitar largura máxima

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, period }) => {
  const { state: themeState } = useTheme();
  
  // Verificação de segurança para o tema
  if (!themeState || !themeState.colors) {
    return null;
  }

  const styles = createStyles(themeState.colors);
  // Preparar dados para gráfico de linha (tendência diária)
  const prepareLineChartData = () => {
    
    if (!data.dailyProfit || data.dailyProfit.length === 0) {
      return {
        labels: ['N/A'],
        datasets: [
          {
            data: [0],
            color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
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
          data: sortedData.map(item => item.revenue),
          color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: sortedData.map(item => item.expenses),
          color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: sortedData.map(item => item.profit),
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  // Preparar dados para gráfico de barras (receita por plataforma)
  const prepareBarChartData = () => {
    
    if (!data.revenueByPlatform || data.revenueByPlatform.length === 0) {
      return {
        labels: ['N/A'],
        datasets: [
          {
            data: [0],
          },
        ],
      };
    }


    return {
      labels: data.revenueByPlatform.map(item => item.platform),
      datasets: [
        {
          data: data.revenueByPlatform.map(item => item.value),
        },
      ],
    };
  };

  // Preparar dados para gráfico de pizza (distribuição de receitas)
  const preparePieChartData = () => {
    if (!data.revenueByPlatform || data.revenueByPlatform.length === 0) {
      return [
        {
          name: 'N/A',
          population: 1,
          color: '#6b7280',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
      ];
    }

    const colors = ['#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#6b7280'];
    
    return data.revenueByPlatform.map((item, index) => ({
      name: item.platform,
      population: item.value,
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));
  };

  const chartConfig = {
    backgroundColor: themeState.colors.surface,
    backgroundGradientFrom: themeState.colors.surface,
    backgroundGradientTo: themeState.colors.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${themeState.isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#22c55e',
    },
  };

  const lineChartData = prepareLineChartData();
  const barChartData = prepareBarChartData();
  const pieChartData = preparePieChartData();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Análise de Receitas</Text>
      
      {/* Gráfico de Linha - Tendência */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>📈 Tendência de Ganhos</Text>
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

      {/* Gráfico de Barras - Receita por Plataforma */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>🚗 Receita por Plataforma</Text>
        <BarChart
          data={barChartData}
          width={chartWidth}
          height={180}
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          yAxisLabel="R$"
          yAxisSuffix=""
        />
      </View>

      {/* Gráfico de Pizza - Distribuição */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>🥧 Distribuição de Receitas</Text>
        <PieChart
          data={pieChartData}
          width={chartWidth}
          height={180}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
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
});
