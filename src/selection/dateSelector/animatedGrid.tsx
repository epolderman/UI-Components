import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Grid } from 'react-virtualized';
import { GridProps } from 'react-virtualized/dist/es/Grid';
import Easing from 'easing-functions';

/* 
   Handles virtualization via windowing
   Thin wrapper around the Grid component for animations
*/

export interface AnimatedGridProps {
  column: number;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  durationOfAnimation?: number;
}

export type CombinedProps = AnimatedGridProps & GridProps;

// default: milliseconds
const DEFAULT_DURATION_OF_ANIMATION = 800;

export const AnimatedGrid: React.FC<CombinedProps> = React.memo(
  ({
    column,
    onAnimationStart,
    onAnimationEnd,
    durationOfAnimation,
    ...gridProps
  }) => {
    const [scrollLeft, setScrollLeft] = useState(0);
    const gridRef = useRef<Grid>(null);
    const scrollLeftStart = useRef(0);
    const scrollLeftFinal = useRef(0);
    const isAnimating = useRef(false);
    const animationStartTime = useRef(0);
    const animationDuration = useRef<number>(
      durationOfAnimation || DEFAULT_DURATION_OF_ANIMATION
    );

    const animateToOffset = useCallback(() => {
      requestAnimationFrame(() => {
        const now = performance.now();
        const elapsedTime = now - animationStartTime.current;
        const scrollDelta = scrollLeftFinal.current - scrollLeftStart.current;
        const easing = Easing.Cubic.InOut(
          Math.min(1, elapsedTime / animationDuration.current)
        );
        const scrollLeft = scrollLeftStart.current + scrollDelta * easing;
        setScrollLeft(scrollLeft);

        if (elapsedTime < animationDuration.current) {
          animateToOffset();
        } else {
          animationStartTime.current = 0;
          scrollLeftStart.current = scrollLeftFinal.current;
          isAnimating.current = false;
          if (onAnimationEnd) {
            onAnimationEnd();
          }
        }
      });
    }, [onAnimationEnd, animationDuration]);

    useEffect(() => {
      if (onAnimationStart) {
        onAnimationStart();
      }
      animationStartTime.current = performance.now();
      scrollLeftFinal.current = gridRef.current.getOffsetForCell({
        columnIndex: column
      }).scrollLeft;
      setScrollLeft(scrollLeftFinal.current);
      isAnimating.current = true;
      animateToOffset();
    }, [column, animateToOffset, onAnimationStart]);

    const onScroll = useCallback(({ scrollLeft }: { scrollLeft: number }) => {
      if (!isAnimating) {
        scrollLeftStart.current = scrollLeft;
      }
    }, []);

    return (
      <Grid
        {...gridProps}
        ref={gridRef}
        onScroll={onScroll}
        scrollToColumn={undefined}
        scrollLeft={scrollLeft}
      />
    );
  }
);
