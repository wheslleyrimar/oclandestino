import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  change?: number;
  changeType?: 'increase' | 'decrease';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  change, 
  changeType 
}) => {
  const getChangeColor = () => {
    if (!change || !changeType) return '#6b7280';
    return changeType === 'increase' ? '#22c55e' : '#ef4444';
  };

  const getChangeIcon = () => {
    if (!changeType) return '';
    return changeType === 'increase' ? '↗️' : '↘️';
  };

  return (
    <View style={[styles.container, { width: '48%' }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.value, { color }]}>{value}</Text>
        </View>
        
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
      </View>
      
      {/* Change indicator */}
      {change !== undefined && (
        <View style={styles.changeContainer}>
          <View style={[styles.changeIndicator, { backgroundColor: getChangeColor() }]}>
            <Text style={styles.changeIcon}>{getChangeIcon()}</Text>
            <Text style={styles.changeText}>
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </Text>
          </View>
          <Text style={styles.changeLabel}>vs período anterior</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  changeLabel: {
    fontSize: 10,
    color: '#9ca3af',
  },
});