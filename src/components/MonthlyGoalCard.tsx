import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MonthlyGoal } from '../types';

interface MonthlyGoalCardProps {
  goal: MonthlyGoal;
}

export const MonthlyGoalCard: React.FC<MonthlyGoalCardProps> = ({ goal }) => {
  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remainingAmount = goal.targetAmount - goal.currentAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meta Mensal</Text>
        <Text style={styles.month}>{formatMonth(goal.month)}</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.amountRow}>
          <Text style={styles.currentAmount}>
            {formatCurrency(goal.currentAmount)}
          </Text>
          <Text style={styles.targetAmount}>
            de {formatCurrency(goal.targetAmount)}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${Math.min(progressPercentage, 100)}%` }
            ]} 
          />
        </View>

        {/* Progress Info */}
        <View style={styles.progressInfo}>
          <Text style={styles.progressPercentage}>
            {progressPercentage.toFixed(1)}% concluído
          </Text>
          {remainingAmount > 0 && (
            <Text style={styles.remainingAmount}>
              Faltam {formatCurrency(remainingAmount)}
            </Text>
          )}
        </View>
      </View>

      {/* Platform Breakdown */}
      <View style={styles.platformSection}>
        <Text style={styles.platformTitle}>Distribuição por Plataforma</Text>
        
        {goal.platformBreakdown.map((platform, index) => (
          <View key={index} style={styles.platformItem}>
            <View style={styles.platformInfo}>
              <Text style={styles.platformName}>{platform.platform}</Text>
              <Text style={styles.platformPercentage}>
                {platform.percentage.toFixed(1)}%
              </Text>
            </View>
            <View style={styles.platformBarContainer}>
              <View 
                style={[
                  styles.platformBar,
                  { 
                    width: `${platform.percentage}%`,
                    backgroundColor: getPlatformColor(platform.platform)
                  }
                ]} 
              />
            </View>
            <Text style={styles.platformAmount}>
              {formatCurrency(platform.amount)}
            </Text>
          </View>
        ))}
      </View>
    </View>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  month: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  progressSection: {
    marginBottom: 24,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  currentAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginRight: 8,
  },
  targetAmount: {
    fontSize: 16,
    color: '#6b7280',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  remainingAmount: {
    fontSize: 14,
    color: '#6b7280',
  },
  platformSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
  },
  platformTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  platformItem: {
    marginBottom: 12,
  },
  platformInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  platformName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  platformPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  platformBarContainer: {
    height: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  platformBar: {
    height: '100%',
    borderRadius: 2,
  },
  platformAmount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
});