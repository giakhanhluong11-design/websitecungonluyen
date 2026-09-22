import React, { useState, useCallback, createContext, useContext, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

interface ThemeRippleContextType {
  darkMode: boolean;
  toggleDarkMode: (event?: React.MouseEvent | MouseEvent | { clientX: number; clientY: number }) => void;
  setDarkModeDirectly: (isDark: boolean, event?: React.MouseEvent | MouseEvent | { clientX: number; clientY: number }) => void;
}

const ThemeRippleContext = createContext<ThemeRippleContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  setDarkModeDirectly: () => {}
});

export const useTheme = () => useContext(ThemeRippleContext);

interface RippleState {
  x: number;
  y: number;
  targetDark: boolean;
  size: number;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cung_on_luyen_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [ripple, setRipple] = useState<RippleState | null>(null);
  const isAnimatingRef = useRef(false);

  // Sync class on html and body on mount & state change
  const applyThemeToDOM = useCallback((isDark: boolean) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;
    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, []);

  useEffect(() => {
    applyThemeToDOM(darkMode);
    try {
      localStorage.setItem('cung_on_luyen_theme', darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode, applyThemeToDOM]);

  const triggerToggle = useCallback(
    (nextDark: boolean, event?: React.MouseEvent | MouseEvent | { clientX: number; clientY: number }) => {
      if (typeof window === 'undefined') {
        setDarkMode(nextDark);
        return;
      }

      // Prevent glitching from rapid consecutive clicks
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      // Extract accurate origin coordinates (click or theme button center)
      let x = window.innerWidth - 70;
      let y = 35;

      if (event) {
        if ('clientX' in event && typeof event.clientX === 'number' && (event.clientX > 0 || event.clientY > 0)) {
          x = event.clientX;
          y = event.clientY;
        } else if ('currentTarget' in event && event.currentTarget) {
          const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }
      } else {
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) {
          const rect = btn.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }
      }

      // Maximum radius from origin to farthest viewport corner
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      const size = Math.ceil(maxRadius * 2.15);

      // Check for native View Transitions API support (GPU-accelerated circular reveal)
      const doc = document as any;
      const isViewTransitionSupported =
        typeof doc !== 'undefined' &&
        typeof doc.startViewTransition === 'function' &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isViewTransitionSupported) {
        try {
          const transition = doc.startViewTransition(() => {
            flushSync(() => {
              applyThemeToDOM(nextDark);
              setDarkMode(nextDark);
            });
          });

          transition.ready.then(() => {
            // Render the glowing wave ripple synchronized with the expanding circle
            setRipple({
              x,
              y,
              targetDark: nextDark,
              size
            });

            doc.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${maxRadius}px at ${x}px ${y}px)`
                ]
              },
              {
                duration: 480,
                easing: 'cubic-bezier(0.2, 0.85, 0.25, 1)',
                pseudoElement: '::view-transition-new(root)'
              }
            );
          }).catch(() => {
            applyThemeToDOM(nextDark);
            setDarkMode(nextDark);
          });

          transition.finished.finally(() => {
            setRipple(null);
            isAnimatingRef.current = false;
          });
          return;
        } catch {
          // Fallback if view transition fails in iframe sandboxing
        }
      }

      // Fallback: Smooth CSS transition on all elements + translucent ripple wave
      doc.documentElement.classList.add('theme-transitioning');
      setRipple({
        x,
        y,
        targetDark: nextDark,
        size
      });

      applyThemeToDOM(nextDark);
      setDarkMode(nextDark);

      setTimeout(() => {
        doc.documentElement.classList.remove('theme-transitioning');
        setRipple(null);
        isAnimatingRef.current = false;
      }, 420);
    },
    [applyThemeToDOM]
  );

  const toggleDarkMode = useCallback(
    (event?: React.MouseEvent | MouseEvent | { clientX: number; clientY: number }) => {
      triggerToggle(!darkMode, event);
    },
    [darkMode, triggerToggle]
  );

  const setDarkModeDirectly = useCallback(
    (isDark: boolean, event?: React.MouseEvent | MouseEvent | { clientX: number; clientY: number }) => {
      if (isDark !== darkMode) {
        triggerToggle(isDark, event);
      }
    },
    [darkMode, triggerToggle]
  );

  return (
    <ThemeRippleContext.Provider value={{ darkMode, toggleDarkMode, setDarkModeDirectly }}>
      {children}

      {/* Water Drop Ripple Wave Rings (Lightweight, non-blocking, GPU-accelerated) */}
      {ripple && (
        <div
          id="theme-water-drop-overlay"
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[9999999] overflow-hidden select-none"
        >
          {/* Wave 1: Soft luminous glow expanding from water droplet impact */}
          <div
            className={`absolute rounded-full animate-water-glow pointer-events-none ${
              ripple.targetDark
                ? 'bg-indigo-500/15 dark:bg-indigo-400/20'
                : 'bg-amber-400/20 dark:bg-amber-300/25'
            }`}
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              width: `${ripple.size * 0.95}px`,
              height: `${ripple.size * 0.95}px`
            }}
          />

          {/* Wave 2: Concentric water ripple crest ring */}
          <div
            className={`absolute rounded-full border animate-water-pulse-1 pointer-events-none ${
              ripple.targetDark
                ? 'border-indigo-400/60 shadow-[0_0_24px_rgba(99,102,241,0.45)]'
                : 'border-amber-400/60 shadow-[0_0_24px_rgba(251,191,36,0.45)]'
            }`}
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              width: `${ripple.size}px`,
              height: `${ripple.size}px`
            }}
          />

          {/* Wave 3: Secondary following ripple wave */}
          <div
            className={`absolute rounded-full border animate-water-pulse-2 pointer-events-none ${
              ripple.targetDark
                ? 'border-indigo-500/35'
                : 'border-amber-300/35'
            }`}
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              width: `${ripple.size * 1.05}px`,
              height: `${ripple.size * 1.05}px`
            }}
          />
        </div>
      )}
    </ThemeRippleContext.Provider>
  );
};
