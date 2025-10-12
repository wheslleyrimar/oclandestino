import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Revenue, Expense } from '../types';

interface TransactionCardProps {
  transaction: (Revenue | Expense) & { type: 'revenue' | 'expense' };
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const { state: themeState } = useTheme();
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getIcon = () => {
    if (transaction.type === 'revenue') {
      const revenue = transaction as Revenue;
      const platformIcons: { [key: string]: string } = {
        'Uber': '🚗',
        '99': '🚕',
        'inDrive': '🚙',
        'Cabify': '🚐',
        'Outros': '🚘',
      };
      return platformIcons[revenue.platform] || '🚘';
    } else {
      const expense = transaction as Expense;
      const categoryIcons: { [key: string]: string } = {
        'Combustível': '⛽',
        'Manutenção': '🔧',
        'Alimentação': '🍽️',
        'Pedágio': '🛣️',
        'Estacionamento': '🅿️',
        'Outros': '📦',
      };
      return categoryIcons[expense.category] || '📦';
    }
  };

  const getSubtitle = () => {
    if (transaction.type === 'revenue') {
      const revenue = transaction as Revenue;
      return revenue.platform;
    } else {
      const expense = transaction as Expense;
      return expense.category;
    }
  };

  const getValueColor = () => {
    return transaction.type === 'revenue' ? '#22c55e' : '#ef4444';
  };

  const getValuePrefix = () => {
    return transaction.type === 'revenue' ? '+' : '-';
  };

  const styles = createStyles(themeState.colors);

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: getValueColor() + '20' }]}>
        <Text style={styles.icon}>{getIcon()}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        <View style={styles.rightInfo}>
          <Text style={[styles.value, { color: getValueColor() }]}>
            {getValuePrefix()}{formatCurrency(transaction.value)}
          </Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
      </View>

      {/* Additional info for revenues */}
      {transaction.type === 'revenue' && (
        <View style={styles.additionalInfo}>
          {(transaction as Revenue).hoursWorked && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>⏰</Text>
              <Text style={styles.infoValue}>
                {(transaction as Revenue).hoursWorked?.toFixed(1)}h
              </Text>
            </View>
          )}
          {(transaction as Revenue).kilometersRidden && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>📏</Text>
              <Text style={styles.infoValue}>
                {(transaction as Revenue).kilometersRidden?.toFixed(1)}km
              </Text>
            </View>
          )}
          {(transaction as Revenue).tripsCount && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>🚗</Text>
              <Text style={styles.infoValue}>
                {(transaction as Revenue).tripsCount} corridas
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 3,
  },
  iconContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 56,
  },
  mainInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  rightInfo: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  additionalInfo: {
    flexDirection: 'row',
    marginTop: 12,
    marginLeft: 56,
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});