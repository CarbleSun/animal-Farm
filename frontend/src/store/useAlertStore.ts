import { create } from 'zustand';

interface AlertState {
  isOpen: boolean;
  type: 'alert' | 'confirm';
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  showAlert: (message: string, onConfirm?: () => void) => void;
  showConfirm: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  isOpen: false,
  type: 'alert',
  message: '',
  onConfirm: () => {},
  onCancel: () => {},
  
  showAlert: (message, onConfirm) => 
    set({ isOpen: true, type: 'alert', message, onConfirm: onConfirm || (() => {}), onCancel: () => {} }),
    
  showConfirm: (message, onConfirm, onCancel) => 
    set({ isOpen: true, type: 'confirm', message, onConfirm, onCancel: onCancel || (() => {}) }),
    
  closeAlert: () => set({ isOpen: false }),
}));