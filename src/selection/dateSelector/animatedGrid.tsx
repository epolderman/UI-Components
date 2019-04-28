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
      scrollLeft: scrollLeft
    });

    useEffect(() => {
      console.log('column change ag', column);
      if (gridRef.current && scrollLeftFinal.current) {
        const newScrollLeft = gridRef.current.getOffsetForCell({ columnIndex: column })
          .scrollLeft;
        scrollLeftFinal.current.scrollLeft = newScrollLeft;
        console.log('NewScrollLeft', newScrollLeft, scrollLeft);
        console.log('Grid Ref:', gridRef.current);
        //scrollAnimation.scrollLeft.setValue(newColumnIndex * CALENDAR_DIMENSIONS, false);
        setScrollLeft(newScrollLeft);
      }
    }, [column]);

    const onScroll = useCallback(({ scrollLeft }: { scrollLeft: number }) => {
      console.log('OnScroll', scrollLeft);
      if (scrollLeftInitial.current) {
        scrollLeftInitial.current.scrollLeft = scrollLeft;
      }
    }, []);

    console.log(scrollAnimation, scrollLeft);

    return (
      <animated.div {...scrollAnimation}>
        <Grid
          {...gridProps}
          ref={gridRef}
          onScroll={onScroll}
          scrollToColumn={undefined}
          scrollLeft={scrollLeft}
        />
      </animated.div>
    );
  }
);
const AGrid = animated(Grid);
// 1. Wrapping Animated with the Grid animated(Grid) doesnt allow scrollLeft value to hit the state [exhaustingly FAIL]
// 2. animated.div wrapped around grid allows scrollLeft to hit the component, but cannot animate due to the grid
// being virtualized and it needs to control its scrollLeft offset. [FAIL so far]
// 3. is the only way imperatively with requestAnimationFrame? [Only Option?]
