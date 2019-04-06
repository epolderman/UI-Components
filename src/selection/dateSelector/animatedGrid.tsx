import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
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
    // const isAnimating = useRef<boolean>(false);
    // const scrollLeftInitial = useRef<ScrollOffset>({ scrollLeft: 0, scrollTop: 0 });
    const scrollLeftFinal = useRef<ScrollOffset>({ scrollLeft: 0, scrollTop: 0 });
    // const scrollProps = useSpring({
    //   to: { x: scrollLeftFinal.current.scrollLeft }
    // });
    // const [{ scroll }, set] = useSpring(() => ({ scroll: scrollLeft }))
    // const onScroll = useCallback((value:number) => void set(value), []);

    useEffect(() => {
      // if (isAnimating) {
      //   return;
      // }
      console.log('grid: useEffect column: ', column);
      if (gridRef.current && scrollLeftFinal.current) {
        const newColumnIndex =
          gridRef.current.getOffsetForCell({ columnIndex: column }).scrollLeft /
          CALENDAR_DIMENSIONS;
        console.log('newScrollOffest', newColumnIndex);
        scrollLeftFinal.current.scrollLeft = newColumnIndex * CALENDAR_DIMENSIONS;
        setScrollLeft(scrollLeftFinal.current.scrollLeft);
        // setScrollLeft(scrollLeftFinal.current.scrollLeft);
        // set(scrollLeftFinal.current.scrollLeft);
      }
    }, [column]);

    useEffect(() => {
      console.log('useEffect SCROLLLEFT:', scrollLeft);
    }, [scrollLeft]);

    console.log('Grid: ', scrollLeft);

    if (gridRef.current != null) {
      console.log(
        'GridRef information',
        gridRef.current.getOffsetForCell({ columnIndex: column }).scrollLeft,
        gridRef.current.getOffsetForCell({ columnIndex: column }).scrollLeft /
          CALENDAR_DIMENSIONS
      );
    }

    // todo: animate to a value pass it to the grid

    return (
      <Grid
        {...gridProps}
        ref={gridRef}
        scrollX
        scrollLeft={scrollLeft}
        onScroll={undefined}
        scrollToColumn={undefined}
      />
    );
  }
);
