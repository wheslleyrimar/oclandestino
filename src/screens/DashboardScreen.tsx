import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { MetricsGrid } from '../components/MetricsGrid';
import { PeriodTabs } from '../components/PeriodTabs';
import { StatCard } from '../components/StatCard';

const DashboardScreen: React.FC = () => {
  const { state, setPeriod, getDashboardData } = useFinance();
  const dashboardData = getDashboardData();

  const handlePeriodChange = (period: 'daily' | 'weekly' | 'monthly') => {
    setPeriod(period);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Visão geral dos seus ganhos</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Tabs */}
        <PeriodTabs
          selectedPeriod={state.selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />

        {/* Financial Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Receita Total"
              value={`R$ ${dashboardData.totalRevenue.toFixed(2)}`}
              icon="💰"
              color="#22c55e"
            />
            <StatCard
              title="Gastos Totais"
              value={`R$ ${dashboardData.totalExpenses.toFixed(2)}`}
              icon="💸"
              color="#ef4444"
            />
            <StatCard
              title="Lucro Líquido"
              value={`R$ ${dashboardData.netProfit.toFixed(2)}`}
              icon="📈"
              color={dashboardData.netProfit >= 0 ? "#22c55e" : "#ef4444"}
            />
            <StatCard
              title="Dias Trabalhados"
              value={dashboardData.workingDaysCount.toString()}
              icon="📅"
              color="#0ea5e9"
            />
          </View>
        </View>

        {/* Metrics Grid */}
        <MetricsGrid />

        {/* Platform Revenue */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Receita por Plataforma</Text>
          
          {dashboardData.revenueByPlatform.map((platform, index) => (
            <View key={index} style={styles.platformItem}>
              <View style={styles.platformInfo}>
                <Text style={styles.platformName}>{platform.platform}</Text>
                <Text style={styles.platformValue}>
                  R$ {platform.value.toFixed(2)}
                </Text>
              </View>
              <View style={styles.platformBar}>
                <View 
                  style={[
                    styles.platformProgress,
                    { 
                      width: `${(platform.value / dashboardData.totalRevenue) * 100}%`,
                      backgroundColor: getPlatformColor(platform.platform)
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

        {/* Expense Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gastos por Categoria</Text>
          
          {dashboardData.expensesByCategory.map((category, index) => (
            <View key={index} style={styles.platformItem}>
              <View style={styles.platformInfo}>
                <Text style={styles.platformName}>{category.category}</Text>
                <Text style={styles.platformValue}>
                  R$ {category.value.toFixed(2)}
                </Text>
              </View>
              <View style={styles.platformBar}>
                <View 
                  style={[
                    styles.platformProgress,
                    { 
                      width: `${(category.value / dashboardData.totalExpenses) * 100}%`,
                      backgroundColor: getCategoryColor(category.category)
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const getPlatformColor = (platform: string): string => {
  const colors: { [key: string]: string } = {
    'Uber': '#000000',
    '99': '#ffcc00',
    'inDrive': '#00d4aa',
    'Cabify': '#7b2cbf',
    'Outros': '#6b7280',
  };
  return colors[platform] || '#6b7280';
};

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Combustível': '#ef4444',
    'Manutenção': '#f59e0b',
    'Alimentação': '#22c55e',
    'Pedágio': '#8b5cf6',
    'Estacionamento': '#06b6d4',
    'Outros': '#6b7280',
  };
  return colors[category] || '#6b7280';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  platformItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 3,
  },
  platformInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  platformValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  platformBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  platformProgress: {
    height: '100%',
    borderRadius: 3,
  },
  bottomSpacing: {
    height: 120,
  },
});

export default DashboardScreen;
