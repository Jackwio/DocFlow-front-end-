/**
 * usePolling hook
 * Conditional polling hook that polls only when certain conditions are met
 */

import { useEffect, useRef } from 'react';

export interface UsePollingOptions {
  /** Interval in milliseconds between polls */
  interval: number;
  /** Whether polling should be enabled */
  enabled?: boolean;
  /** Callback function to execute on each poll */
  onPoll: () => void;
}

/**
 * Hook for conditional polling
 * Only polls when enabled is true
 * Automatically cleans up on unmount
 */
export function usePolling({ interval, enabled = true, onPoll }: UsePollingOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onPollRef = useRef(onPoll);

  // Keep onPoll reference up to date
  useEffect(() => {
    onPollRef.current = onPoll;
  }, [onPoll]);

  useEffect(() => {
    if (!enabled) {
      // Clear any existing interval if polling is disabled
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start polling
    intervalRef.current = setInterval(() => {
      onPollRef.current();
    }, interval);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [interval, enabled]);
}
