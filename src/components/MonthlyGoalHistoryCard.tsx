import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MonthlyGoalHistory } from '../types';

interface MonthlyGoalHistoryCardProps {
  history: MonthlyGoalHistory[];
}

export const MonthlyGoalHistoryCard: React.FC<MonthlyGoalHistoryCardProps> = ({ history }) => {
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

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Histórico de Metas</Text>
        <Text style={styles.emptyText}>Nenhuma meta anterior registrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Metas</Text>
      
      {history.map((goal, index) => (
        <View key={goal.id} style={styles.historyItem}>
          <View style={styles.historyHeader}>
            <Text style={styles.monthText}>{formatMonth(goal.month)}</Text>
            <View style={[
              styles.statusBadge,
              goal.wasAchieved ? styles.statusAchieved : styles.statusNotAchieved
            ]}>
              <Text style={styles.statusText}>
                {goal.wasAchieved ? '✅ Atingida' : '❌ Não atingida'}
              </Text>
            </View>
          </View>
          
          <View style={styles.historyContent}>
            <View style={styles.amountRow}>
              <Text style={styles.achievedAmount}>
                {formatCurrency(goal.achievedAmount)}
              </Text>
              <Text style={styles.targetAmount}>
                de {formatCurrency(goal.targetAmount)}
              </Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    goal.wasAchieved ? styles.progressFillAchieved : styles.progressFillNotAchieved,
                    { width: `${Math.min(goal.percentage, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={[
                styles.percentageText,
                goal.wasAchieved ? styles.percentageAchieved : styles.percentageNotAchieved
              ]}>
                {goal.percentage.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  historyItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAchieved: {
    backgroundColor: '#dcfce7',
  },
  statusNotAchieved: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  historyContent: {
    marginTop: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  achievedAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 8,
  },
  targetAmount: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressFillAchieved: {
    backgroundColor: '#22c55e',
  },
  progressFillNotAchieved: {
    backgroundColor: '#f59e0b',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
  percentageAchieved: {
    color: '#22c55e',
  },
  percentageNotAchieved: {
    color: '#f59e0b',
  },
});
