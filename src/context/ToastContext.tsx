import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type'], title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info', title?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastMessage = { id, message, type, title };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0"
        aria-live="assertive"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
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

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const type = toast.type || 'info';

  const icons: Record<ToastMessage['type'], React.ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#FFD83D] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#168BFF] shrink-0" />,
  };

  const borders: Record<ToastMessage['type'], string> = {
    success: 'border-emerald-500/30',
    error: 'border-rose-500/30',
    warning: 'border-[#FFD83D]/40',
    info: 'border-[#168BFF]/40',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 bg-[#0B2342] text-[#F5F7FC] rounded-lg border shadow-xl shadow-black/40 backdrop-blur-md transition-all duration-300 ${borders[type]}`}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1 min-w-0">
        {toast.title && <h4 className="text-sm font-bold text-[#F5F7FC] mb-0.5">{toast.title}</h4>}
        <p className="text-xs text-[#B9C7D9] leading-relaxed break-words">{toast.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 text-[#B9C7D9] hover:text-[#F5F7FC] rounded transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
