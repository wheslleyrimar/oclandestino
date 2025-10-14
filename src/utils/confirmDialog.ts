import { Alert, Platform } from 'react-native';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

/**
 * Exibe um diálogo de confirmação que funciona tanto na Web quanto em dispositivos móveis
 * @param options - Opções do diálogo de confirmação
 */
export const showConfirmDialog = (options: ConfirmOptions) => {
  const {
    title = 'Confirmar',
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
  } = options;

  if (Platform.OS === 'web') {
    // Para Web, usar window.confirm
    const confirmed = window.confirm(`${title}\n\n${message}`);
    if (confirmed) {
      try {
        const result = onConfirm();
        // Se onConfirm retorna uma Promise, tratar erros
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error('Error in confirm action:', error);
            alert('Ocorreu um erro ao executar a ação');
          });
        }
      } catch (error) {
        console.error('Error in confirm action:', error);
        alert('Ocorreu um erro ao executar a ação');
      }
    } else {
      onCancel?.();
    }
  } else {
    // Para mobile, usar Alert.alert
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelText,
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: confirmText,
          style: 'destructive',
          onPress: async () => {
            try {
              await onConfirm();
            } catch (error) {
              console.error('Error in confirm action:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao executar a ação');
            }
          },
        },
      ]
    );
  }
};

/**
 * Exibe um diálogo de confirmação específico para logout
 * @param onConfirm - Função a ser executada quando o usuário confirmar o logout
 */
export const showLogoutConfirm = (onConfirm: () => void | Promise<void>) => {
  showConfirmDialog({
    title: 'Sair',
    message: 'Tem certeza que deseja sair da sua conta?',
    confirmText: 'Sair',
    cancelText: 'Cancelar',
    onConfirm,
  });
};
