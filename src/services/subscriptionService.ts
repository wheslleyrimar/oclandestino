import { Platform } from 'react-native';

// Importações condicionais para evitar problemas na web
let iapModule: any = null;
if (typeof window === 'undefined') {
  // Apenas importar no mobile
  try {
    iapModule = require('react-native-iap');
  } catch (error) {
  }
}

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
      if (typeof window !== 'undefined' || Platform.OS !== 'ios' || !iapModule) {
        return false;
      }

      const result = await iapModule.initConnection();
      
      // Configurar listeners para atualizações de compra
      this.setupPurchaseListeners();
      
      return result;
    } catch (error) {
      console.error('Failed to initialize store connection:', error);
      return false;
    }
  }

  private setupPurchaseListeners() {
    if (!iapModule) return;
    
    // Listener para atualizações de compra
    this.purchaseUpdateSubscription = iapModule.purchaseUpdatedListener(
      async (purchase: any) => {
        
        try {
          // Finalizar a transação
          await iapModule.finishTransaction({ purchase, isConsumable: false });
          
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
    this.purchaseErrorSubscription = iapModule.purchaseErrorListener(
      (error: any) => {
        console.error('Purchase error:', error);
      }
    );
  }

  async getAvailableProducts(): Promise<SubscriptionProduct[]> {
    try {
      if (typeof window !== 'undefined' || Platform.OS !== 'ios' || !iapModule) {
        return [];
      }

      const products = await iapModule.getProducts({ skus: this.productIds });
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
      if (typeof window !== 'undefined' || Platform.OS !== 'ios' || !iapModule) {
        throw new Error('In-App Purchases only available on iOS');
      }

      const purchase = await iapModule.requestPurchase({ sku: productId });
      
      if (purchase) {
        // Finalizar a transação
        await iapModule.finishTransaction({ purchase, isConsumable: false });
        
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
      if (typeof window !== 'undefined' || Platform.OS !== 'ios' || !iapModule) {
        return [];
      }

      const purchases = await iapModule.getAvailablePurchases();
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
      if (typeof window !== 'undefined' || Platform.OS !== 'ios' || !iapModule) {
        return false;
      }

      // Para produção, você deve validar o receipt no seu backend
      // Aqui estamos fazendo uma validação básica local
      const result = await iapModule.validateReceiptIos({
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
      if (typeof window !== 'undefined' || Platform.OS !== 'ios' || !iapModule) {
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
      if (typeof window !== 'undefined' || Platform.OS !== 'ios' || !iapModule) {
        return null;
      }

      const subscriptions = await iapModule.getSubscriptions({ skus: [productId] });
      return subscriptions.length > 0 ? subscriptions[0] : null;
    } catch (error) {
      console.error('Failed to get subscription info:', error);
      return null;
    }
  }
}

export default new SubscriptionService();
