import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MonthlyGoal } from '../types';

interface MonthlyGoalCardProps {
  goal: MonthlyGoal;
}

export const MonthlyGoalCard: React.FC<MonthlyGoalCardProps> = ({ goal }) => {
  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const isGoalAchieved = goal.currentAmount >= goal.targetAmount;

  // Animações para quando a meta for atingida
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isGoalAchieved) {
      // Animação de escala inicial
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Animação de pulso contínua
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    }
  }, [isGoalAchieved, scaleAnim, pulseAnim]);

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
    <Animated.View 
      style={[
        styles.container, 
        isGoalAchieved && styles.containerSuccess,
        isGoalAchieved && {
          transform: [
            { scale: scaleAnim },
            { scale: pulseAnim }
          ]
        }
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, isGoalAchieved && styles.titleSuccess]}>
            {isGoalAchieved ? '🎉 Meta Atingida!' : 'Meta Mensal'}
          </Text>
          {isGoalAchieved && (
            <Text style={styles.successBadge}>CONQUISTADA</Text>
          )}
        </View>
        <Text style={styles.month}>{formatMonth(goal.month)}</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.amountRow}>
          <Text style={[styles.currentAmount, isGoalAchieved && styles.currentAmountSuccess]}>
            {formatCurrency(goal.currentAmount)}
          </Text>
          <Text style={styles.targetAmount}>
            de {formatCurrency(goal.targetAmount)}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBarContainer, isGoalAchieved && styles.progressBarContainerSuccess]}>
          <View 
            style={[
              styles.progressBar, 
              isGoalAchieved && styles.progressBarSuccess,
              { width: `${Math.min(progressPercentage, 100)}%` }
            ]} 
          />
        </View>

        {/* Progress Info */}
        <View style={styles.progressInfo}>
          <Text style={[styles.progressPercentage, isGoalAchieved && styles.progressPercentageSuccess]}>
            {isGoalAchieved ? `${progressPercentage.toFixed(1)}% SUPERADA!` : `${progressPercentage.toFixed(1)}% concluído`}
          </Text>
          {remainingAmount > 0 ? (
            <Text style={styles.remainingAmount}>
              Faltam {formatCurrency(remainingAmount)}
            </Text>
          ) : (
            <Text style={styles.exceededAmount}>
              +{formatCurrency(Math.abs(remainingAmount))} além da meta!
            </Text>
          )}
        </View>
      </View>

      {/* Platform Breakdown */}
      <View style={styles.platformSection}>
        <Text style={styles.platformTitle}>Distribuição por Plataforma</Text>
        
        {goal.platformBreakdowns.map((platform: any, index: number) => (
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
    </Animated.View>
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
  containerSuccess: {
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  titleSuccess: {
    color: '#22c55e',
  },
  successBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: 'center',
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
  currentAmountSuccess: {
    color: '#22c55e',
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
  progressBarContainerSuccess: {
    backgroundColor: '#dcfce7',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 4,
  },
  progressBarSuccess: {
    backgroundColor: '#22c55e',
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
  progressPercentageSuccess: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  remainingAmount: {
    fontSize: 14,
    color: '#6b7280',
  },
  exceededAmount: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
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