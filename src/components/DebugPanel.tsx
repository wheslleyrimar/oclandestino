import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DashboardData } from '../services/apiService';
import { IndicatorsData } from '../utils/indicatorsCalculator';

interface DebugPanelProps {
  dashboardData: DashboardData | null;
  indicators: IndicatorsData | null;
  period: 'daily' | 'weekly' | 'monthly';
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ dashboardData, indicators, period }) => {
  if (!dashboardData || !indicators) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Debug Panel</Text>
        <Text style={styles.text}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Panel - {period}</Text>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard Data:</Text>
          <Text style={styles.text}>Total Revenue: {dashboardData.totalRevenue}</Text>
          <Text style={styles.text}>Total Expenses: {dashboardData.totalExpenses}</Text>
          <Text style={styles.text}>Net Profit: {dashboardData.netProfit}</Text>
          <Text style={styles.text}>Working Days: {dashboardData.workingDaysCount}</Text>
          <Text style={styles.text}>Total Hours: {dashboardData.totalHoursWorked}</Text>
          <Text style={styles.text}>Total KMs: {dashboardData.totalKilometersRidden}</Text>
          <Text style={styles.text}>Total Trips: {dashboardData.totalTripsCount}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculated Indicators:</Text>
          <Text style={styles.text}>Average per Period: {indicators.averagePerPeriod}</Text>
          <Text style={styles.text}>Average per Hour: {indicators.averagePerHour}</Text>
          <Text style={styles.text}>Average per KM: {indicators.averagePerKm}</Text>
          <Text style={styles.text}>Hours Worked: {indicators.hoursWorked}</Text>
          <Text style={styles.text}>Average Hours: {indicators.averageHours}</Text>
          <Text style={styles.text}>Total KMs: {indicators.totalKms}</Text>
          <Text style={styles.text}>Days Worked: {indicators.daysWorked}</Text>
          <Text style={styles.text}>Trips Completed: {indicators.tripsCompleted}</Text>
          <Text style={styles.text}>Average per Trip: {indicators.averagePerTrip}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    maxHeight: 300,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
  text: {
    color: '#d1d5db',
    fontSize: 12,
    marginBottom: 4,
  },
  scrollView: {
    maxHeight: 250,
  },
  section: {
    marginBottom: 8,
  },
});
