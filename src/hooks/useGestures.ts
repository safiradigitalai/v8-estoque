'use client';

import { useRef, useEffect, useState } from 'react';

interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
}

interface GestureHandlers {
  onSwipe?: (gesture: SwipeGesture) => void;
  onPinch?: (scale: number) => void;
  onLongPress?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
}

export function useGestures(handlers: GestureHandlers) {
  const ref = useRef<HTMLElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    // Touch start handler
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        startTime = Date.now();
        
        touchStartRef.current = { x: startX, y: startY, time: startTime };
        setIsPressed(true);

        // Long press detection
        if (handlers.onLongPress) {
          longPressTimerRef.current = setTimeout(() => {
            handlers.onLongPress?.();
            // Haptic feedback simulation
            if (navigator.vibrate) {
              navigator.vibrate(50);
            }
          }, 500);
        }
      }
    };

    // Touch move handler
    const handleTouchMove = () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };

    // Touch end handler
    const handleTouchEnd = (e: TouchEvent) => {
      setIsPressed(false);
      
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();

      const deltaX = endX - touchStartRef.current.x;
      const deltaY = endY - touchStartRef.current.y;
      const deltaTime = endTime - touchStartRef.current.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = distance / deltaTime;

      // Tap detection
      if (distance < 10 && deltaTime < 300) {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;
        
        if (timeSinceLastTap < 300 && handlers.onDoubleTap) {
          handlers.onDoubleTap();
          // Haptic feedback for double tap
          if (navigator.vibrate) {
            navigator.vibrate([30, 50, 30]);
          }
        } else if (handlers.onTap) {
          handlers.onTap();
          // Light haptic feedback for tap
          if (navigator.vibrate) {
            navigator.vibrate(20);
          }
        }
        
        lastTapRef.current = now;
        return;
      }

      // Swipe detection
      if (distance > 50 && velocity > 0.3 && handlers.onSwipe) {
        let direction: SwipeGesture['direction'];
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }

        handlers.onSwipe({
          direction,
          distance,
          velocity
        });

        // Haptic feedback for swipe
        if (navigator.vibrate) {
          navigator.vibrate(40);
        }
      }

      touchStartRef.current = null;
    };

    // Mouse handlers for desktop
    const handleMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
      setIsPressed(true);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
      
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [handlers]);

  return { ref, isPressed };
}

// Advanced gesture hook for swipe navigation
export function useSwipeNavigation() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = (direction: 'next' | 'prev', totalItems: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (direction === 'next') {
      setCurrentIndex(prev => (prev + 1) % totalItems);
    } else {
      setCurrentIndex(prev => (prev - 1 + totalItems) % totalItems);
    }

    // Reset animation state
    setTimeout(() => setIsAnimating(false), 300);
  };

  const gestureRef = useGestures({
    onSwipe: (gesture) => {
      if (gesture.direction === 'left') {
        // Swipe left = next
        navigate('next', 10); // Adjust based on your data
      } else if (gesture.direction === 'right') {
        // Swipe right = previous
        navigate('prev', 10);
      }
    }
  });

  return {
    currentIndex,
    isAnimating,
    navigate,
    gestureRef
  };
}

// Pull-to-refresh hook
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);

  const gestureRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = gestureRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startYRef.current = e.touches[0].clientY;
        isDraggingRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || window.scrollY > 0) return;

      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startYRef.current);
      
      if (distance > 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, 120));
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > 80 && !isRefreshing) {
        setIsRefreshing(true);
        onRefresh().finally(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        });

        // Haptic feedback for refresh
        if (navigator.vibrate) {
          navigator.vibrate([50, 100, 50]);
        }
      } else {
        setPullDistance(0);
      }
      
      isDraggingRef.current = false;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, pullDistance, isRefreshing]);

  return {
    gestureRef,
    isRefreshing,
    pullDistance,
    pullProgress: Math.min(pullDistance / 80, 1)
  };
}