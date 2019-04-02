import React, { useState, useRef, useEffect } from 'react';
import { useSpring } from 'react-spring';
import { Grid } from 'react-virtualized';
import { GridProps, ScrollOffset } from 'react-virtualized/dist/es/Grid';

/* 
   Handles virtualization via windowing
   Thin wrapper around the Grid component for animations
*/

export interface AnimatedGridProps {
  column: number;
  onAnimationComplete?: () => void;
}

export type CombinedProps = AnimatedGridProps & GridProps;

export const AnimatedGrid: React.FC<CombinedProps> = React.memo(CombinedProps => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const { column, onAnimationComplete, ...gridProps } = CombinedProps;
  const gridRef = useRef<Grid>(null);
  const isAnimating = useRef(false);
  const scrollLeftInitial = useRef<ScrollOffset>({ scrollLeft: 0, scrollTop: 0 });
  const scrollLeftFinal = useRef<ScrollOffset>({ scrollLeft: 0, scrollTop: 0 });

  const onScroll = ({ scrollLeft }: { scrollLeft: number }) => {
    if (isAnimating) {
      return;
    }

    if (scrollLeftInitial.current) {
      scrollLeftInitial.current.scrollLeft = scrollLeft;
    }
  };

  useEffect(() => {
    if (isAnimating) {
      return;
    }

    // handle scroll logic here
  }, [column]);

  return (
    <Grid
      {...gridProps}
      ref={gridRef}
      scrollLeft={scrollLeft}
      onScroll={onScroll}
      scrollToColumn={undefined}
    />
  );
});
