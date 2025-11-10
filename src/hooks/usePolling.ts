/**
 * usePolling hook
 * Conditional polling hook that only polls when there are pending documents
 * Task T087: [US2] Create src/hooks/usePolling.ts hook
 */

import { useEffect, useRef, useState } from 'react';

export interface UsePollingOptions {
  /**
   * Polling interval in milliseconds
   * @default 5000 (5 seconds)
   */
  interval?: number;
  /**
   * Whether polling is enabled
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether to call immediately on mount
   * @default false
   */
  immediate?: boolean;
}

export interface UsePollingResult {
  /**
   * Whether polling is currently active
   */
  isPolling: boolean;
  /**
   * Start polling
   */
  start: () => void;
  /**
   * Stop polling
   */
  stop: () => void;
  /**
   * Reset and restart polling
   */
  restart: () => void;
}

/**
 * Hook for conditional polling with start/stop control
 * 
 * @param callback - Function to call on each poll
 * @param options - Polling configuration options
 * @returns Control functions and polling state
 * 
 * @example
 * ```tsx
 * const { isPolling, start, stop } = usePolling(
 *   () => refetch(),
 *   { interval: 5000, enabled: hasPendingDocs }
 * );
 * ```
 */
export function usePolling(
  callback: () => void | Promise<void>,
  options: UsePollingOptions = {}
): UsePollingResult {
  const {
    interval = 5000,
    enabled = true,
    immediate = false,
  } = options;

  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Start polling function
  const start = () => {
    if (intervalRef.current) return; // Already polling
    
    // Call immediately if requested
    if (immediate) {
      void callbackRef.current();
    }

    intervalRef.current = setInterval(() => {
      void callbackRef.current();
    }, interval);
    
    setIsPolling(true);
  };

  // Stop polling function
  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPolling(false);
    }
  };

  // Restart polling function
  const restart = () => {
    stop();
    start();
  };

  // Handle enabled state changes
  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }

    // Cleanup on unmount
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, interval]);

  return {
    isPolling,
    start,
    stop,
    restart,
  };
}
