import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PeriodTabsProps {
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void;
}

export const PeriodTabs: React.FC<PeriodTabsProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  const periods = [
    { key: 'daily' as const, label: 'Diário' },
    { key: 'weekly' as const, label: 'Semanal' },
    { key: 'monthly' as const, label: 'Mensal' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.tab,
              selectedPeriod === period.key && styles.activeTab,
            ]}
            onPress={() => onPeriodChange(period.key)}
          >
            <Text
              style={[
                styles.tabText,
                selectedPeriod === period.key && styles.activeTabText,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#ffffff',
  },
});