/**
 * Global UI state store using Zustand
 */

import { create } from 'zustand';
import type { Notification } from '@/types';

/**
 * UI store state interface
 */
export interface UIStore {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;

  // Modals
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;

  // Detail panel
  detailPanelDocumentId: string | null;
  openDetailPanel: (documentId: string) => void;
  closeDetailPanel: () => void;
}

/**
 * Create UI store
 */
export const useUIStore = create<UIStore>((set) => ({
  // Theme state
  theme: 'light',
  setTheme: (theme) => set({ theme }),

  // Notifications state
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: `notification-${Date.now()}-${Math.random()}`,
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  // Modals state
  activeModal: null,
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),

  // Detail panel state
  detailPanelDocumentId: null,
  openDetailPanel: (documentId) => set({ detailPanelDocumentId: documentId }),
  closeDetailPanel: () => set({ detailPanelDocumentId: null }),
}));
