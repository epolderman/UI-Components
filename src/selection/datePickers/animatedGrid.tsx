import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Grid } from 'react-virtualized';
import { GridProps } from 'react-virtualized/dist/es/Grid';
import { EasingFunctions } from '../../utils/easing';

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

type CombinedProps = AnimatedGridProps & GridProps;

// default: milliseconds
const DEFAULT_DURATION_ANIMATION = 500;

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
    const animationStartTime = useRef(0);
    const requestAnimationRef = useRef(null);
    const animationDuration = useRef(
      durationOfAnimation || DEFAULT_DURATION_ANIMATION
    );

    const animateToOffset = useCallback(() => {
      const now = performance.now();
      const elapsedTime = now - animationStartTime.current;
      const scrollDelta = scrollLeftFinal.current - scrollLeftStart.current;
      const easing = EasingFunctions.easeInOutQuart(
        Math.min(1, elapsedTime / animationDuration.current)
      );
      const scrollLeft = scrollLeftStart.current + scrollDelta * easing;
      setScrollLeft(scrollLeft);

      if (elapsedTime < animationDuration.current) {
        requestAnimationRef.current = requestAnimationFrame(animateToOffset);
      } else {
        animationStartTime.current = 0;
        scrollLeftStart.current = scrollLeftFinal.current;
        if (onAnimationEnd) {
          onAnimationEnd();
        }
      }
    }, [onAnimationEnd, animationDuration]);

    useEffect(() => {
      if (onAnimationStart) {
        onAnimationStart();
      }
      scrollLeftFinal.current = gridRef.current.getOffsetForCell({
        columnIndex: column
      }).scrollLeft;
      setScrollLeft(scrollLeftFinal.current);
      animationStartTime.current = performance.now();
      requestAnimationRef.current = requestAnimationFrame(animateToOffset);
      return () => cancelAnimationFrame(requestAnimationRef.current);
    }, [column, animateToOffset, onAnimationStart]);

    return <Grid {...gridProps} ref={gridRef} scrollLeft={scrollLeft} />;
  }
);
