import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

// Import screens
import AuthScreen from '../screens/AuthScreen';
import OverviewScreen from '../screens/OverviewScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import ConfigurationScreen from '../screens/ConfigurationScreen';

// Import custom tab bar
import { CustomTabBar } from '../components/CustomTabBar';
import { FloatingActionButton } from '../components/FloatingActionButton';

// Import contexts
import { useAuth } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Overview" 
          component={OverviewScreen} 
          options={{ tabBarLabel: 'Painel' }}
        />
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ tabBarLabel: 'Dashboard' }}
        />
        <Tab.Screen 
          name="Transactions" 
          component={TransactionsScreen} 
          options={{ tabBarLabel: 'Transações' }}
        />
        <Tab.Screen 
          name="Configuration" 
          component={ConfigurationScreen} 
          options={{ tabBarLabel: 'Config' }}
        />
      </Tab.Navigator>
      <FloatingActionButton />
    </>
  );
};

const AppNavigator = () => {
  const { state: authState } = useAuth();

  // Show loading screen while checking authentication
  if (authState.isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaProvider>
    );
  }
  
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {authState.isAuthenticated ? (
              <Stack.Screen name="MainTabs" component={MainTabs} />
            ) : (
              <Stack.Screen name="Auth" component={AuthScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
});

export default AppNavigator;
