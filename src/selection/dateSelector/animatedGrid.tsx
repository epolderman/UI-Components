import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
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
      to: { scrollLeft: scrollLeft },
      immediate: false
    });

    useLayoutEffect(() => {
      console.log('column change ag');
      if (gridRef.current && scrollLeftFinal.current) {
        const newColumnIndex =
          gridRef.current.getOffsetForCell({ columnIndex: column }).scrollLeft /
          CALENDAR_DIMENSIONS;
        scrollLeftFinal.current.scrollLeft = newColumnIndex * CALENDAR_DIMENSIONS;
        scrollAnimation.scrollLeft.setValue(scrollLeftFinal.current.scrollLeft, false);
        setScrollLeft(scrollLeftFinal.current.scrollLeft);
      }
    }, [column]);

    console.log(scrollAnimation, scrollLeft);

    if (gridRef.current) {
      console.log('GF', gridRef.current);
    }

    return (
      <AnimatedGridz
        {...gridProps}
        ref={gridRef}
        {...scrollAnimation}
        onScroll={undefined}
        scrollToColumn={undefined}
      />
    );
  }
);

const AnimatedGridz = animated(Grid);
