/**
 * Tests for UI store
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './useUIStore';

describe('useUIStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useUIStore.setState({
      theme: 'light',
      notifications: [],
      activeModal: null,
      detailPanelDocumentId: null,
    });
  });

  describe('theme', () => {
    it('has default light theme', () => {
      const { theme } = useUIStore.getState();
      expect(theme).toBe('light');
    });

    it('sets theme', () => {
      useUIStore.getState().setTheme('dark');
      expect(useUIStore.getState().theme).toBe('dark');
    });
  });

  describe('notifications', () => {
    it('starts with empty notifications', () => {
      const { notifications } = useUIStore.getState();
      expect(notifications).toEqual([]);
    });

    it('adds notification', () => {
      useUIStore.getState().addNotification({
        type: 'success',
        message: 'Test notification',
      });

      const { notifications } = useUIStore.getState();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].message).toBe('Test notification');
      expect(notifications[0].id).toBeDefined();
    });

    it('removes notification', () => {
      useUIStore.getState().addNotification({
        type: 'success',
        message: 'Test notification',
      });

      const { notifications } = useUIStore.getState();
      const notificationId = notifications[0].id;

      useUIStore.getState().removeNotification(notificationId);
      expect(useUIStore.getState().notifications).toHaveLength(0);
    });
  });

  describe('modals', () => {
    it('starts with no active modal', () => {
      const { activeModal } = useUIStore.getState();
      expect(activeModal).toBeNull();
    });

    it('opens modal', () => {
      useUIStore.getState().openModal('test-modal');
      expect(useUIStore.getState().activeModal).toBe('test-modal');
    });

    it('closes modal', () => {
      useUIStore.getState().openModal('test-modal');
      useUIStore.getState().closeModal();
      expect(useUIStore.getState().activeModal).toBeNull();
    });
  });

  describe('detail panel', () => {
    it('starts with no document selected', () => {
      const { detailPanelDocumentId } = useUIStore.getState();
      expect(detailPanelDocumentId).toBeNull();
    });

    it('opens detail panel', () => {
      useUIStore.getState().openDetailPanel('doc-123');
      expect(useUIStore.getState().detailPanelDocumentId).toBe('doc-123');
    });

    it('closes detail panel', () => {
      useUIStore.getState().openDetailPanel('doc-123');
      useUIStore.getState().closeDetailPanel();
      expect(useUIStore.getState().detailPanelDocumentId).toBeNull();
    });
  });
});
