import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSpring, animated, config, interpolate } from 'react-spring';
import { Grid } from 'react-virtualized';
import { GridProps, ScrollOffset } from 'react-virtualized/dist/es/Grid';
import { CALENDAR_DIMENSIONS } from './dateUtils';
import Easing from 'easing-functions';

/* 
   Handles virtualization via windowing
   Thin wrapper around the Grid component for animations
*/

export interface AnimatedGridProps {
  column: number;
  onAnimationComplete?: () => void;
}

export type CombinedProps = AnimatedGridProps & GridProps;

const DURATION_OF_ANIMATION = 500;

export const AnimatedGrid: React.FC<CombinedProps> = React.memo(
  ({ column, onAnimationComplete, ...gridProps }) => {
    const [scrollLeft, setScrollLeft] = useState(0);
    const gridRef = useRef<Grid>(null);
    const scrollLeftInitial = useRef(0);
    const scrollLeftFinal = useRef(0);
    const isAnimating = useRef(false);
    const animationStartTime = useRef(0);

    const { x } = useSpring({
      from: { x: 0 },
      to: { x: scrollLeft }
    });

    // const scrollAnimation = useSpring({
    //   from: { scrollLeft: 0 },
    //   to: { scrollLeft }
    // });

    const animateToOffset = useCallback(() => {
      requestAnimationFrame(() => {
        const now = performance.now();
        const elapsedTime = now - animationStartTime.current;
        const scrollDelta = scrollLeftFinal.current - scrollLeftInitial.current;
        const easing = Easing.Cubic.InOut(
          Math.min(1, elapsedTime / DURATION_OF_ANIMATION)
        );
        const scrollLeft = scrollLeftInitial.current + scrollDelta * easing;
        setScrollLeft(scrollLeft);

        if (elapsedTime < DURATION_OF_ANIMATION) {
          animateToOffset();
        } else {
          animationStartTime.current = 0;
          scrollLeftInitial.current = scrollLeftFinal.current;
          isAnimating.current = false;
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }
      });
    }, [onAnimationComplete]);

    useEffect(() => {
      if (gridRef.current) {
        animationStartTime.current = performance.now();
        scrollLeftFinal.current = gridRef.current.getOffsetForCell({
          columnIndex: column
        }).scrollLeft;
        console.log('scrollLeft Setting', scrollLeftFinal.current);
        setScrollLeft(scrollLeftFinal.current);
        // isAnimating.current = true;
        // animateToOffset();
      }
    }, [column, animateToOffset]);

    const onScroll = useCallback(({ scrollLeft }: { scrollLeft: number }) => {
      if (!isAnimating) {
        scrollLeftInitial.current = scrollLeft;
      }
    }, []);

    console.log('scrollAnimation', gridRef);

    return (
      <AGrid
        {...gridProps}
        ref={gridRef}
        onScroll={onScroll}
        scrollToColumn={undefined}
        scrollLeft={x.interpolate((x: number) => x)}
      />
    );
  }
);
const AGrid = animated(Grid);
// 1. Wrapping Animated with the Grid animated(Grid) doesnt allow scrollLeft value to hit the state [exhaustingly FAIL]
// 2. animated.div wrapped around grid allows scrollLeft to hit the component, but cannot animate due to the grid
// being virtualized and it needs to control its scrollLeft offset. [FAIL so far]
// 3. is the only way imperatively with requestAnimationFrame? [Only Option?]
