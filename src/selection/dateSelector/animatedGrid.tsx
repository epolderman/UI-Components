import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSpring, animated, config } from 'react-spring';
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
    const [scrollLeftValue, setScrollLeft] = useState(column * CALENDAR_DIMENSIONS);
    const gridRef = useRef<Grid>(null);
    const scrollLeftInitial = useRef<ScrollOffset>({ scrollLeft: 0, scrollTop: 0 });
    const scrollLeftFinal = useRef<ScrollOffset>({ scrollLeft: 0, scrollTop: 0 });
    const [scrollLeft, setX] = useSpring(() => ({
      immediate: false,
      config: config.stiff,
      scrollLeft: scrollLeftValue
    }));

    useEffect(() => {
      console.log('grid: useEffect column: ', column);
      if (gridRef.current && scrollLeftFinal.current) {
        const newColumnIndex =
          gridRef.current.getOffsetForCell({ columnIndex: column }).scrollLeft /
          CALENDAR_DIMENSIONS;
        console.log('newScrollOffest', newColumnIndex);
        scrollLeftFinal.current.scrollLeft = newColumnIndex * CALENDAR_DIMENSIONS;
        setScrollLeft(scrollLeftFinal.current.scrollLeft);
        setX({
          immediate: false,
          config: config.stiff,
          scrollLeft: scrollLeftFinal.current.scrollLeft
        });
        console.log(scrollLeft);
      }
    }, [column]);

    useEffect(() => {
      console.log('useEffect SCROLLLEFT:', scrollLeft);
    }, [scrollLeft]);

    if (gridRef.current != null) {
      console.log(
        'GridRef information',
        gridRef.current.getOffsetForCell({ columnIndex: column }).scrollLeft,
        gridRef.current.getOffsetForCell({ columnIndex: column }).scrollLeft /
          CALENDAR_DIMENSIONS
      );
    }

    // TODO: animate to a value, figure out react spring

    return (
      <Grid
        {...gridProps}
        ref={gridRef}
        scrollLeft={scrollLeft.scrollLeft}
        onScroll={undefined}
        scrollToColumn={undefined}
      />
    );
  }
);
