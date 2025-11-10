/**
 * usePolling hook tests
 * Testing start/stop polling, interval configuration, and cleanup
 */

import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { usePolling } from '@/hooks/usePolling';

describe('usePolling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Basic Polling', () => {
    it('should call onPoll at the specified interval', () => {
      const onPoll = vi.fn();
      renderHook(() => usePolling({ interval: 1000, onPoll }));

      // Initially not called
      expect(onPoll).not.toHaveBeenCalled();

      // After 1 second
      vi.advanceTimersByTime(1000);
      expect(onPoll).toHaveBeenCalledTimes(1);

      // After 2 seconds
      vi.advanceTimersByTime(1000);
      expect(onPoll).toHaveBeenCalledTimes(2);

      // After 3 seconds
      vi.advanceTimersByTime(1000);
      expect(onPoll).toHaveBeenCalledTimes(3);
    });

    it('should work with different intervals', () => {
      const onPoll = vi.fn();
      renderHook(() => usePolling({ interval: 5000, onPoll }));

      // After 4.9 seconds (not yet)
      vi.advanceTimersByTime(4900);
      expect(onPoll).not.toHaveBeenCalled();

      // After 5 seconds
      vi.advanceTimersByTime(100);
      expect(onPoll).toHaveBeenCalledTimes(1);

      // After 10 seconds
      vi.advanceTimersByTime(5000);
      expect(onPoll).toHaveBeenCalledTimes(2);
    });

    it('should continue polling multiple times', () => {
      const onPoll = vi.fn();
      renderHook(() => usePolling({ interval: 100, onPoll }));

      vi.advanceTimersByTime(500);
      expect(onPoll).toHaveBeenCalledTimes(5);

      vi.advanceTimersByTime(500);
      expect(onPoll).toHaveBeenCalledTimes(10);
    });
  });

  describe('Conditional Polling', () => {
    it('should start polling when enabled is true', () => {
      const onPoll = vi.fn();
      renderHook(() => usePolling({ interval: 1000, enabled: true, onPoll }));

      vi.advanceTimersByTime(1000);
      expect(onPoll).toHaveBeenCalledTimes(1);
    });

    it('should not start polling when enabled is false', () => {
      const onPoll = vi.fn();
      renderHook(() => usePolling({ interval: 1000, enabled: false, onPoll }));

      vi.advanceTimersByTime(5000);
      expect(onPoll).not.toHaveBeenCalled();
    });

    it('should stop polling when enabled changes from true to false', () => {
      const onPoll = vi.fn();
      const { rerender } = renderHook(
        ({ enabled }) => usePolling({ interval: 1000, enabled, onPoll }),
        { initialProps: { enabled: true } }
      );

      // Initially polling
      vi.advanceTimersByTime(1000);
      expect(onPoll).toHaveBeenCalledTimes(1);

      // Disable polling
      rerender({ enabled: false });

      // Should not call again
      vi.advanceTimersByTime(5000);
      expect(onPoll).toHaveBeenCalledTimes(1);
    });

    it('should start polling when enabled changes from false to true', () => {
      const onPoll = vi.fn();
      const { rerender } = renderHook(
        ({ enabled }) => usePolling({ interval: 1000, enabled, onPoll }),
        { initialProps: { enabled: false } }
      );

      // Initially not polling
      vi.advanceTimersByTime(2000);
      expect(onPoll).not.toHaveBeenCalled();

      // Enable polling
      rerender({ enabled: true });

      // Should start calling
      vi.advanceTimersByTime(1000);
      expect(onPoll).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      expect(onPoll).toHaveBeenCalledTimes(2);
    });
  });

  describe('Interval Changes', () => {
    it('should respect interval changes', () => {
      const onPoll = vi.fn();
      const { rerender } = renderHook(
        ({ interval }) => usePolling({ interval, onPoll }),
        { initialProps: { interval: 1000 } }
      );

      // First interval
      vi.advanceTimersByTime(1000);
      expect(onPoll).toHaveBeenCalledTimes(1);

      // Change interval to 2 seconds
      rerender({ interval: 2000 });
      onPoll.mockClear();

      // Should use new interval
      vi.advanceTimersByTime(1000);
      expect(onPoll).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(onPoll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Callback Updates', () => {
    it('should use the latest onPoll callback', () => {
      const calls: string[] = [];
      let callback = () => calls.push('first');

      const { rerender } = renderHook(() => usePolling({ interval: 1000, onPoll: callback }));

      vi.advanceTimersByTime(1000);
      expect(calls).toEqual(['first']);

      // Update callback
      callback = () => calls.push('second');
      rerender();

      vi.advanceTimersByTime(1000);
      expect(calls).toEqual(['first', 'second']);
    });
  });

  describe('Cleanup', () => {
    it('should stop polling on unmount', () => {
      const onPoll = vi.fn();
      const { unmount } = renderHook(() => usePolling({ interval: 1000, onPoll }));

      vi.advanceTimersByTime(1000);
      expect(onPoll).toHaveBeenCalledTimes(1);

      // Unmount
      unmount();

      // Should not call anymore
      vi.advanceTimersByTime(5000);
      expect(onPoll).toHaveBeenCalledTimes(1);
    });

    it('should clear interval when disabled', () => {
      const onPoll = vi.fn();
      const { rerender, unmount } = renderHook(
        ({ enabled }) => usePolling({ interval: 1000, enabled, onPoll }),
        { initialProps: { enabled: true } }
      );

      vi.advanceTimersByTime(1000);
      expect(onPoll).toHaveBeenCalledTimes(1);

      // Disable
      rerender({ enabled: false });

      // Unmount should not cause issues
      unmount();

      // No additional calls
      vi.advanceTimersByTime(5000);
      expect(onPoll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very fast intervals', () => {
      const onPoll = vi.fn();
      renderHook(() => usePolling({ interval: 10, onPoll }));

      vi.advanceTimersByTime(100);
      expect(onPoll).toHaveBeenCalledTimes(10);
    });

    it('should handle very slow intervals', () => {
      const onPoll = vi.fn();
      renderHook(() => usePolling({ interval: 60000, onPoll }));

      vi.advanceTimersByTime(59999);
      expect(onPoll).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(onPoll).toHaveBeenCalledTimes(1);
    });

    it('should default enabled to true when not provided', () => {
      const onPoll = vi.fn();
      renderHook(() => usePolling({ interval: 1000, onPoll }));

      vi.advanceTimersByTime(1000);
      expect(onPoll).toHaveBeenCalledTimes(1);
    });
  });
});
