/**
 * useMediaQuery hook
 * Hook for responsive breakpoint detection
 * Listens to window resize events and returns current breakpoint status
 * Includes orientation change handling to preserve scroll position
 */

import { useState, useEffect, useRef } from 'react';
import { BREAKPOINTS } from '@/utils/constants';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface MediaQueryResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  currentBreakpoint: Breakpoint;
  width: number;
  orientation: 'portrait' | 'landscape';
}

/**
 * Custom hook to detect responsive breakpoints
 * @returns MediaQueryResult with current breakpoint information
 */
export function useMediaQuery(): MediaQueryResult {
  const [width, setWidth] = useState<number>(() => {
    // SSR-safe: Check if window is defined
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return BREAKPOINTS.desktop; // Default to desktop for SSR
  });

  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }
    return 'portrait';
  });

  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setWidth(window.innerWidth);
      
      const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      
      // Preserve scroll position on orientation change
      if (newOrientation !== orientation) {
        scrollPositionRef.current = window.scrollY;
        setOrientation(newOrientation);
        
        // Restore scroll position after a short delay to allow for layout changes
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current);
        });
      }
    };

    // Set initial width
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Handle orientation change event specifically
    window.addEventListener('orientationchange', () => {
      scrollPositionRef.current = window.scrollY;
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 100);
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', () => {});
    };
  }, [orientation]);

  // Calculate breakpoint states
  const isMobile = width < BREAKPOINTS.mobile;
  const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.tablet;

  // Determine current breakpoint
  let currentBreakpoint: Breakpoint;
  if (isMobile) {
    currentBreakpoint = 'mobile';
  } else if (isTablet) {
    currentBreakpoint = 'tablet';
  } else {
    currentBreakpoint = 'desktop';
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint,
    width,
    orientation,
  };
}

/**
 * Hook to check if a specific media query matches
 * @param query - CSS media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQueryMatch(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // SSR-safe: Check if window is defined
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Add listener (use addEventListener for broader compatibility)
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
