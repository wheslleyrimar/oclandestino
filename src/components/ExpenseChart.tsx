import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { DashboardData } from '../services/apiService';

interface ExpenseChartProps {
  data: DashboardData;
  period: 'daily' | 'weekly' | 'monthly';
}

const screenWidth = Dimensions.get('window').width;
const chartWidth = Math.min(screenWidth - 80, 320); // Limitar largura máxima

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ data, period }) => {
  const { state: themeState } = useTheme();
  
  // Verificação de segurança para o tema
  if (!themeState || !themeState.colors) {
    return null;
  }

  const styles = createStyles(themeState.colors);
  // Preparar dados para gráfico de barras (gastos por categoria)
  const prepareBarChartData = () => {
    if (!data.expensesByCategory || data.expensesByCategory.length === 0) {
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
      labels: data.expensesByCategory.map(item => item.category),
      datasets: [
        {
          data: data.expensesByCategory.map(item => item.value),
        },
      ],
    };
  };

  // Preparar dados para gráfico de pizza (distribuição de gastos)
  const preparePieChartData = () => {
    if (!data.expensesByCategory || data.expensesByCategory.length === 0) {
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

    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#8b5cf6', '#06b6d4', '#6b7280'];
    
    return data.expensesByCategory.map((item, index) => ({
      name: item.category,
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
    color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${themeState.isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ef4444',
    },
  };

  const barChartData = prepareBarChartData();
  const pieChartData = preparePieChartData();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💸 Análise de Gastos</Text>
      
      {/* Gráfico de Barras - Gastos por Categoria */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>📊 Gastos por Categoria</Text>
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

      {/* Gráfico de Pizza - Distribuição de Gastos */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>🥧 Distribuição de Gastos</Text>
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
