import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { state: themeState } = useTheme();

  // Verificação de segurança
  if (!themeState || !themeState.colors) {
    return null;
  }

  if (!state || !descriptors) {
    return null;
  }
  const getTabIcon = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case 'Overview':
        return '🏠';
      case 'Dashboard':
        return '📊';
      case 'Transactions':
        return '📋';
      case 'Configuration':
        return '⚙️';
      default:
        return '⚪';
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'Overview':
        return 'Painel';
      case 'Dashboard':
        return 'Dashboard';
      case 'Transactions':
        return 'Lançamentos';
      case 'Configuration':
        return 'Config';
      default:
        return routeName;
    }
  };

  const styles = createStyles(themeState.colors);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = getTabLabel(route.name);
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              style={styles.tab}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabIcon,
                  { color: isFocused ? '#3b82f6' : '#9ca3af' }
                ]}
              >
                {getTabIcon(route.name, isFocused)}
              </Text>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? '#3b82f6' : '#9ca3af' }
                ]}
              >
                {label}
              </Text>
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});
