/**
 * Unit tests for usePolling hook
 * Tests start/stop polling and interval configuration
 * Task T082: [US2] Unit test for usePolling hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { usePolling } from '@/hooks/usePolling';

describe('usePolling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Basic Functionality', () => {
    it('should start polling when enabled', () => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        usePolling(callback, { enabled: true, interval: 1000 })
      );

      expect(result.current.isPolling).toBe(true);
    });

    it('should not start polling when disabled', () => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        usePolling(callback, { enabled: false, interval: 1000 })
      );

      expect(result.current.isPolling).toBe(false);
    });

    it('should call callback at specified intervals', () => {
      const callback = vi.fn();
      renderHook(() =>
        usePolling(callback, { enabled: true, interval: 1000 })
      );

      expect(callback).not.toHaveBeenCalled();

      // Advance time by 1 second
      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      // Advance time by another second
      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(2);

      // Advance time by 3 more seconds
      vi.advanceTimersByTime(3000);
      expect(callback).toHaveBeenCalledTimes(5);
    });

    it('should call callback immediately when immediate option is true', () => {
      const callback = vi.fn();
      renderHook(() =>
        usePolling(callback, { enabled: true, interval: 1000, immediate: true })
      );

      expect(callback).toHaveBeenCalledTimes(1);

      // Should continue polling
      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should not call callback immediately when immediate option is false', () => {
      const callback = vi.fn();
      renderHook(() =>
        usePolling(callback, { enabled: true, interval: 1000, immediate: false })
      );

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Start/Stop Control', () => {
    it('should provide start function to manually start polling', () => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        usePolling(callback, { enabled: false, interval: 1000 })
      );

      expect(result.current.isPolling).toBe(false);

      // Manually start polling
      act(() => {
        result.current.start();
      });
      expect(result.current.isPolling).toBe(true);

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should provide stop function to manually stop polling', () => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        usePolling(callback, { enabled: true, interval: 1000 })
      );

      expect(result.current.isPolling).toBe(true);

      // Manually stop polling
      act(() => {
        result.current.stop();
      });
      expect(result.current.isPolling).toBe(false);

      // Callback should not be called after stopping
      vi.advanceTimersByTime(5000);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should provide restart function to restart polling', () => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        usePolling(callback, { enabled: true, interval: 1000 })
      );

      // Advance time to trigger some calls
      vi.advanceTimersByTime(2000);
      expect(callback).toHaveBeenCalledTimes(2);

      // Restart polling
      act(() => {
        result.current.restart();
      });

      // Should reset the interval
      vi.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(2); // Still 2

      vi.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(3); // New interval triggered
    });

    it('should not start multiple intervals when start is called multiple times', () => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        usePolling(callback, { enabled: false, interval: 1000 })
      );

      act(() => {
        result.current.start();
        result.current.start();
        result.current.start();
      });

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1); // Only one interval running
    });
  });

  describe('Interval Configuration', () => {
    it('should use custom interval', () => {
      const callback = vi.fn();
      renderHook(() =>
        usePolling(callback, { enabled: true, interval: 2500 })
      );

      vi.advanceTimersByTime(2500);
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(2500);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should use default interval of 5000ms when not specified', () => {
      const callback = vi.fn();
      renderHook(() =>
        usePolling(callback, { enabled: true })
      );

      vi.advanceTimersByTime(5000);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should update interval when option changes', () => {
      const callback = vi.fn();
      const { rerender } = renderHook(
        ({ interval }) => usePolling(callback, { enabled: true, interval }),
        { initialProps: { interval: 1000 } }
      );

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      // Change interval
      rerender({ interval: 2000 });

      // Old interval should be cleared, new one started
      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1); // Still 1

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(2); // New interval triggered
    });
  });

  describe('Enabled State Changes', () => {
    it('should stop polling when enabled changes to false', () => {
      const callback = vi.fn();
      const { rerender } = renderHook(
        ({ enabled }) => usePolling(callback, { enabled, interval: 1000 }),
        { initialProps: { enabled: true } }
      );

      expect(callback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      // Disable polling
      rerender({ enabled: false });

      vi.advanceTimersByTime(5000);
      expect(callback).toHaveBeenCalledTimes(1); // No more calls
    });

    it('should start polling when enabled changes to true', () => {
      const callback = vi.fn();
      const { rerender } = renderHook(
        ({ enabled }) => usePolling(callback, { enabled, interval: 1000 }),
        { initialProps: { enabled: false } }
      );

      vi.advanceTimersByTime(5000);
      expect(callback).not.toHaveBeenCalled();

      // Enable polling
      rerender({ enabled: true });

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cleanup', () => {
    it('should stop polling on unmount', () => {
      const callback = vi.fn();
      const { unmount } = renderHook(() =>
        usePolling(callback, { enabled: true, interval: 1000 })
      );

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      // Unmount the hook
      unmount();

      // Should not call callback after unmount
      vi.advanceTimersByTime(5000);
      expect(callback).toHaveBeenCalledTimes(1); // Still 1
    });
  });

  describe('Async Callbacks', () => {
    it('should handle async callbacks', async () => {
      const callback = vi.fn().mockResolvedValue(undefined);
      renderHook(() =>
        usePolling(callback, { enabled: true, interval: 1000 })
      );

      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(callback).toHaveBeenCalledTimes(1);
      });

      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(callback).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Callback Updates', () => {
    it('should use updated callback without restarting polling', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      const { rerender } = renderHook(
        ({ cb }) => usePolling(cb, { enabled: true, interval: 1000 }),
        { initialProps: { cb: callback1 } }
      );

      vi.advanceTimersByTime(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();

      // Change callback
      rerender({ cb: callback2 });

      vi.advanceTimersByTime(1000);
      expect(callback1).toHaveBeenCalledTimes(1); // Old callback not called again
      expect(callback2).toHaveBeenCalledTimes(1); // New callback called
    });
  });
});
