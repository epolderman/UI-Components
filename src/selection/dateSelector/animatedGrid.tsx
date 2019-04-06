import React, { useState, useRef, useEffect } from 'react';
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
    const isAnimating = useRef(false);
    const scrollLeftInitial = useRef<ScrollOffset>({ scrollLeft: 0, scrollTop: 0 });
    const scrollLeftFinal = useRef<ScrollOffset>({ scrollLeft: 0, scrollTop: 0 });
    const scrollProps = useSpring({ to: { x: scrollLeft } });

    useEffect(() => {
      if (isAnimating) {
        return;
      }
      if (gridRef.current && scrollLeftFinal.current) {
        console.log('USEeFFECT COLUMN');
        scrollLeftFinal.current.scrollLeft =
          gridRef.current.getOffsetForCell({ columnIndex: column }).scrollLeft /
          CALENDAR_DIMENSIONS;

        setScrollLeft(scrollLeftFinal.current.scrollLeft);
      }
    }, [column]);

    const getCurrentColumn = () => {
      if (gridRef.current == null) {
        return null;
      }
      return (
        gridRef.current.getOffsetForCell({ columnIndex: column }).scrollLeft /
        CALENDAR_DIMENSIONS
      );
    };

    useEffect(() => {
      console.log('useEffect', scrollLeft);
    }, [scrollLeft]);

    // const onScroll = ({ scrollLeft }: { scrollLeft: number }) => {
    //   if (isAnimating) {
    //     return;
    //   }

    //   if (scrollLeftInitial.current) {
    //     scrollLeftInitial.current.scrollLeft = scrollLeft;
    //   }
    // };

    return (
      <animated.div style={{ ...scrollProps }}>
        <Grid
          {...gridProps}
          ref={gridRef}
          scrollLeft={undefined}
          onScroll={undefined}
          scrollToColumn={undefined}
        />
      </animated.div>
    );
  }
);
