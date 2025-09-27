import { useState, useEffect, useCallback } from 'react';

interface UseCartItemAnimationsProps {
  isRemoving?: boolean;
  removalDelay?: number;
}

interface UseCartItemAnimationsReturn {
  isAnimatingOut: boolean;
  isUpdating: boolean;
  triggerUpdateAnimation: () => void;
  startRemovalAnimation: () => void;
}

export function useCartItemAnimations({
  isRemoving = false,
  removalDelay = 300
}: UseCartItemAnimationsProps = {}): UseCartItemAnimationsReturn {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isRemoving && !isAnimatingOut) {
      setIsAnimatingOut(true);
    }
  }, [isRemoving, isAnimatingOut]);

  const triggerUpdateAnimation = useCallback(() => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 200);
  }, []);

  const startRemovalAnimation = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      // Animation complete - parent component should handle actual removal
    }, removalDelay);
  }, [removalDelay]);

  return {
    isAnimatingOut,
    isUpdating,
    triggerUpdateAnimation,
    startRemovalAnimation
  };
}