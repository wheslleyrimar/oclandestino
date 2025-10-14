import { useState, useCallback } from 'react';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertOptions {
  title?: string;
  message: string;
  buttons?: AlertButton[];
  type?: 'success' | 'error' | 'warning' | 'info';
}

interface AlertState extends AlertOptions {
  visible: boolean;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  buttons?: AlertButton[];
  type?: 'success' | 'error' | 'warning' | 'info';
}

interface ConfirmState extends ConfirmOptions {
  visible: boolean;
}

export const useCustomAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    message: '',
  });

  const [confirmState, setConfirmState] = useState<ConfirmState>({
    visible: false,
    message: '',
  });

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({
      ...options,
      visible: true,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions) => {
    setConfirmState({
      ...options,
      visible: true,
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmState(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showAlert({
      title: title || 'Sucesso!',
      message,
      type: 'success',
      buttons: [{ text: 'OK' }],
    });
  }, [showAlert]);

  const showError = useCallback((message: string, title?: string) => {
    showAlert({
      title: title || 'Erro',
      message,
      type: 'error',
      buttons: [{ text: 'OK' }],
    });
  }, [showAlert]);

  const showWarning = useCallback((message: string, title?: string) => {
    showAlert({
      title: title || 'Atenção',
      message,
      type: 'warning',
      buttons: [{ text: 'OK' }],
    });
  }, [showAlert]);

  const showInfo = useCallback((message: string, title?: string) => {
    showAlert({
      title: title || 'Informação',
      message,
      type: 'info',
      buttons: [{ text: 'OK' }],
    });
  }, [showAlert]);

  const showConfirmDialog = useCallback((
    message: string,
    onConfirm: () => void,
    title?: string,
    confirmText?: string,
    cancelText?: string
  ) => {
    showConfirm({
      title: title || 'Confirmação',
      message,
      type: 'warning',
      buttons: [
        {
          text: cancelText || 'Cancelar',
          style: 'cancel',
        },
        {
          text: confirmText || 'Confirmar',
          onPress: onConfirm,
          style: 'default',
        },
      ],
    });
  }, [showConfirm]);

  return {
    alertState,
    confirmState,
    showAlert,
    hideAlert,
    showConfirm,
    hideConfirm,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmDialog,
  };
};