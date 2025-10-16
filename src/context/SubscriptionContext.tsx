import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import subscriptionService, { SubscriptionProduct, PurchaseResult } from '../services/subscriptionService';

interface SubscriptionContextType {
  isPremium: boolean;
  isLoading: boolean;
  products: SubscriptionProduct[];
  purchaseSubscription: (productId: string) => Promise<boolean>;
  restorePurchases: () => Promise<void>;
  checkSubscriptionStatus: () => Promise<void>;
  error: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const PREMIUM_STATUS_KEY = '@clans:premium_status';
const PURCHASE_DATA_KEY = '@clans:purchase_data';

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeSubscription();
    
    // Cleanup listeners quando o componente for desmontado
    return () => {
      subscriptionService.cleanup();
    };
  }, []);

  const initializeSubscription = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Só inicializar no iOS
      if (Platform.OS !== 'ios') {
        setIsLoading(false);
        return;
      }

      // Inicializar conexão com a App Store
      const initialized = await subscriptionService.initialize();
      if (!initialized) {
        // Não tratar como erro crítico, apenas logar
        setIsLoading(false);
        return;
      }

      // Carregar produtos disponíveis
      const availableProducts = await subscriptionService.getAvailableProducts();
      setProducts(availableProducts);

      // Verificar status da assinatura
      await checkSubscriptionStatus();
      
    } catch (error) {
      console.error('Subscription initialization error:', error);
      // Só mostrar erro se não for relacionado ao ambiente de desenvolvimento
      if (!error.message?.includes('Expo Go') && !error.message?.includes('NitroModules')) {
        setError('Falha ao inicializar sistema de assinaturas');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseSubscription = async (productId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (Platform.OS !== 'ios') {
        throw new Error('In-App Purchases only available on iOS');
      }

      const result = await subscriptionService.purchaseSubscription(productId);
      
      if (result) {
        // Validar o receipt
        const isValid = await subscriptionService.validateReceipt(result.transactionReceipt);
        
        if (isValid) {
          // Salvar dados da compra
          await AsyncStorage.setItem(PURCHASE_DATA_KEY, JSON.stringify(result));
          await AsyncStorage.setItem(PREMIUM_STATUS_KEY, 'true');
          
          setIsPremium(true);
          return true;
        } else {
          throw new Error('Receipt validation failed');
        }
      }
      
      return false;
    } catch (error) {
      console.error('Purchase failed:', error);
      setError('Falha ao processar compra. Tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (Platform.OS !== 'ios') {
        throw new Error('In-App Purchases only available on iOS');
      }

      const purchases = await subscriptionService.restorePurchases();
      
      if (purchases.length > 0) {
        // Validar todas as compras restauradas
        for (const purchase of purchases) {
          const isValid = await subscriptionService.validateReceipt(purchase.transactionReceipt);
          
          if (isValid) {
            // Salvar dados da compra mais recente
            const latestPurchase = purchases.reduce((latest, current) => 
              current.purchaseTime > latest.purchaseTime ? current : latest
            );
            
            await AsyncStorage.setItem(PURCHASE_DATA_KEY, JSON.stringify(latestPurchase));
            await AsyncStorage.setItem(PREMIUM_STATUS_KEY, 'true');
            
            setIsPremium(true);
            return;
          }
        }
      }
      
      // Se chegou aqui, não há compras válidas
      await AsyncStorage.removeItem(PREMIUM_STATUS_KEY);
      await AsyncStorage.removeItem(PURCHASE_DATA_KEY);
      setIsPremium(false);
      
    } catch (error) {
      console.error('Restore failed:', error);
      setError('Falha ao restaurar compras');
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      if (Platform.OS !== 'ios') {
        return;
      }

      // Primeiro, verificar se há dados salvos localmente
      const savedStatus = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
      const savedPurchaseData = await AsyncStorage.getItem(PURCHASE_DATA_KEY);
      
      if (savedStatus === 'true' && savedPurchaseData) {
        // Validar se os dados salvos ainda são válidos
        const purchaseData: PurchaseResult = JSON.parse(savedPurchaseData);
        const isValid = await subscriptionService.validateReceipt(purchaseData.transactionReceipt);
        
        if (isValid) {
          setIsPremium(true);
          return;
        }
      }
      
      // Se não há dados válidos salvos, verificar na App Store
      const isActive = await subscriptionService.checkSubscriptionStatus();
      
      if (isActive) {
        setIsPremium(true);
        await AsyncStorage.setItem(PREMIUM_STATUS_KEY, 'true');
      } else {
        setIsPremium(false);
        await AsyncStorage.removeItem(PREMIUM_STATUS_KEY);
        await AsyncStorage.removeItem(PURCHASE_DATA_KEY);
      }
      
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      setError('Falha ao verificar status da assinatura');
    }
  };

  // Função para limpar dados de assinatura (útil para logout)
  const clearSubscriptionData = async () => {
    await AsyncStorage.removeItem(PREMIUM_STATUS_KEY);
    await AsyncStorage.removeItem(PURCHASE_DATA_KEY);
    setIsPremium(false);
  };

  const value: SubscriptionContextType = {
    isPremium,
    isLoading,
    products,
    purchaseSubscription,
    restorePurchases,
    checkSubscriptionStatus,
    error
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
