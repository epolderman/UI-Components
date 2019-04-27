import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSpring, animated, config, interpolate } from 'react-spring';
import { Grid } from 'react-virtualized';
import { GridProps, ScrollOffset } from 'react-virtualized/dist/es/Grid';
import { CALENDAR_DIMENSIONS } from './dateUtils';

/* 
   Handles virtualization via windowing
   Thin wrapper around the Grid component for animations
*/

export interface AnimatedGridProps {
  column: number;
  onAnimationComplete?: () => void;
}

export type CombinedProps = AnimatedGridProps & GridProps;

export const AnimatedGrid: React.FC<CombinedProps> = React.memo(
  ({ column, onAnimationComplete, ...gridProps }) => {
    const [scrollLeft, setScrollLeft] = useState(column * CALENDAR_DIMENSIONS);
    const gridRef = useRef<Grid>(null);
    const scrollLeftInitial = useRef<ScrollOffset>({ scrollLeft: 0, scrollTop: 0 });
    const scrollLeftFinal = useRef<ScrollOffset>({ scrollLeft: 0, scrollTop: 0 });
    const scrollAnimation = useSpring({
      left: scrollLeft,
      immediate: false
    });

    useEffect(() => {
      console.log('grid: useEffect column: ', column);
      if (gridRef.current && scrollLeftFinal.current) {
        const newColumnIndex =
          gridRef.current.getOffsetForCell({ columnIndex: column }).scrollLeft /
          CALENDAR_DIMENSIONS;
        console.log('newScrollOffest', newColumnIndex);
        scrollLeftFinal.current.scrollLeft = newColumnIndex * CALENDAR_DIMENSIONS;
        scrollAnimation.left.setValue(scrollLeftFinal.current.scrollLeft, false);
        setScrollLeft(scrollLeftFinal.current.scrollLeft);
        console.log(scrollLeft);
      }
    }, [column]);

    return (
      <animated.div {...scrollAnimation}>
        <Grid
          {...gridProps}
          ref={gridRef}
          scrollLeft={scrollAnimation.left.value}
          onScroll={undefined}
          scrollToColumn={undefined}
        />
      </animated.div>
    );
  }
);
