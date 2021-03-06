import Flex from 'components/Flex';
import Portal from 'components/Portal';
import Toast, { ToastMessage } from 'components/Toast';
import { createContext, useCallback, useContext, useState } from 'react';
import generateHash from 'utils/generateHash';

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: Omit<ToastMessage, 'id'>) => {
    const toast = {
      id: generateHash(),
      position: message.position || 'right',
      ...message,
    };

    setMessages((prevState) => [...prevState, toast]);
  }, []);

  const removeToast = useCallback(
    (id: string) => {
      setMessages(messages.filter((message) => message.id !== id));
    },
    [messages]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {messages.length > 0 && (
        <Portal>
          <Toast messages={messages} />
        </Portal>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
