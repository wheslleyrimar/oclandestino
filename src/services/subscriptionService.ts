import { Platform } from 'react-native';

// Importação condicional do react-native-iap apenas para plataformas móveis
let iapModule: any = null;

// Função para detectar se estamos no Expo Go
const isExpoGo = () => {
  try {
    // Verificar se estamos no Expo Go através de constantes do Expo
    return typeof __DEV__ !== 'undefined' && 
           typeof window !== 'undefined' && 
           (window as any).expo && 
           (window as any).expo.ExpoGo;
  } catch {
    // Fallback: verificar se estamos em ambiente de desenvolvimento
    // No Expo Go, geralmente __DEV__ é true e não temos acesso a módulos nativos
    return typeof __DEV__ !== 'undefined';
  }
};

const initializeIAPModule = () => {
  // Não inicializar no web
  if (Platform.OS === 'web') {
    return null;
  }
  
  // Não inicializar no Expo Go - verificação mais robusta
  if (isExpoGo()) {
    return null;
  }
  
  // Verificação adicional: se estamos em desenvolvimento, não carregar o módulo
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return null;
  }
  
  try {
    return require('react-native-iap');
  } catch (error) {
    return null;
  }
};

// Initialize only when needed
const getIAPModule = () => {
  if (!iapModule) {
    iapModule = initializeIAPModule();
  }
  return iapModule;
};

export interface SubscriptionProduct {
  productId: string;
  price: string;
  currency: string;
  title: string;
  description: string;
  localizedPrice: string;
  type: 'subscription' | 'consumable' | 'nonConsumable';
}

export interface PurchaseResult {
  transactionId: string;
  productId: string;
  purchaseTime: number;
  transactionReceipt: string;
  originalTransactionIdIOS?: string;
}

class SubscriptionService {
  private productIds = [
    'com.klans.finance.premium.monthly',
    'com.klans.finance.premium.yearly',
    'com.klans.finance.premium.quarterly'
  ];

  private purchaseUpdateSubscription: any = null;
  private purchaseErrorSubscription: any = null;

  async initialize(): Promise<boolean> {
    try {
      // Verificar se estamos no Expo Go primeiro
      if (isExpoGo()) {
        return false;
      }

      const module = getIAPModule();
      if (Platform.OS === 'web' || !module) {
        return false;
      }

      const result = await module.initConnection();
      
      // Configurar listeners para atualizações de compra
      this.setupPurchaseListeners();
      
      return result;
    } catch (error) {
      console.error('Failed to initialize store connection:', error);
      return false;
    }
  }

  private setupPurchaseListeners() {
    const module = getIAPModule();
    if (!module) return;
    
    // Listener para atualizações de compra
    this.purchaseUpdateSubscription = module.purchaseUpdatedListener(
      async (purchase: any) => {
        
        try {
          // Finalizar a transação
          await module.finishTransaction({ purchase, isConsumable: false });
          
          // Aqui você pode adicionar lógica adicional como:
          // - Salvar no AsyncStorage
          // - Enviar para seu backend
          // - Atualizar estado da aplicação
          
        } catch (error) {
          console.error('Error finishing transaction:', error);
        }
      }
    );

    // Listener para erros de compra
    this.purchaseErrorSubscription = module.purchaseErrorListener(
      (error: any) => {
        console.error('Purchase error:', error);
      }
    );
  }

  async getAvailableProducts(): Promise<SubscriptionProduct[]> {
    try {
      const module = getIAPModule();
      if (typeof window !== 'undefined' || Platform.OS !== 'ios' || !module) {
        return [];
      }

      const products = await module.getProducts({ skus: this.productIds });
      return products.map((product: any) => ({
        productId: product.productId,
        price: product.price,
        currency: product.currency,
        title: product.title,
        description: product.description,
        localizedPrice: product.localizedPrice,
        type: 'subscription' as const
      }));
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }

  async purchaseSubscription(productId: string): Promise<PurchaseResult | null> {
    try {
      const module = getIAPModule();
      if (typeof window !== 'undefined' || Platform.OS !== 'ios' || !module) {
        throw new Error('In-App Purchases only available on iOS');
      }

      const purchase = await module.requestPurchase({ sku: productId });
      
      if (purchase) {
        // Finalizar a transação
        await module.finishTransaction({ purchase, isConsumable: false });
        
        return {
          transactionId: purchase.transactionId,
          productId: purchase.productId,
          purchaseTime: purchase.purchaseTime,
          transactionReceipt: purchase.transactionReceipt,
          originalTransactionIdIOS: purchase.originalTransactionIdIOS
        };
      }
      
      return null;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async restorePurchases(): Promise<PurchaseResult[]> {
    try {
      const module = getIAPModule();
      if (typeof window !== 'undefined' || Platform.OS !== 'ios' || !module) {
        return [];
      }

      const purchases = await module.getAvailablePurchases();
      return purchases.map((purchase: any) => ({
        transactionId: purchase.transactionId,
        productId: purchase.productId,
        purchaseTime: purchase.purchaseTime,
        transactionReceipt: purchase.transactionReceipt,
        originalTransactionIdIOS: purchase.originalTransactionIdIOS
      }));
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return [];
    }
  }

  async validateReceipt(receipt: string): Promise<boolean> {
    try {
      const module = getIAPModule();
      if (typeof window !== 'undefined' || Platform.OS !== 'ios' || !module) {
        return false;
      }

      // Para produção, você deve validar o receipt no seu backend
      // Aqui estamos fazendo uma validação básica local
      const result = await module.validateReceiptIos({
        'receipt-data': receipt,
        password: 'YOUR_SHARED_SECRET' // Configure no App Store Connect
      }, false);
      
      return result.status === 0;
    } catch (error) {
      console.error('Receipt validation failed:', error);
      return false;
    }
  }

  async checkSubscriptionStatus(): Promise<boolean> {
    try {
      const module = getIAPModule();
      if (typeof window !== 'undefined' || Platform.OS !== 'ios' || !module) {
        return false;
      }

      const purchases = await this.restorePurchases();
      
      // Verificar se há pelo menos uma compra ativa
      for (const purchase of purchases) {
        const isValid = await this.validateReceipt(purchase.transactionReceipt);
        if (isValid) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return false;
    }
  }

  // Limpar listeners quando não precisar mais
  cleanup() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }

  // Método para obter informações detalhadas de uma assinatura
  async getSubscriptionInfo(productId: string): Promise<any> {
    try {
      const module = getIAPModule();
      if (typeof window !== 'undefined' || Platform.OS !== 'ios' || !module) {
        return null;
      }

      const subscriptions = await module.getSubscriptions({ skus: [productId] });
      return subscriptions.length > 0 ? subscriptions[0] : null;
    } catch (error) {
      console.error('Failed to get subscription info:', error);
      return null;
    }
  }
}

export default new SubscriptionService();
