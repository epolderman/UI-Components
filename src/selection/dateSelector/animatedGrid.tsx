import React, { useState } from 'react';
import { useSpring } from 'react-spring';
import { Grid } from 'react-virtualized';
import { GridProps, ScrollOffset } from 'react-virtualized/dist/es/Grid';
import { FixedSizeGrid, FixedSizeGridProps } from 'react-window';

/* Handles virtualization with animations via windowing */

export interface AnimatedGridProps {
  column: number;
  onAnimationComplete?: () => void;
}

export type CombinedProps = AnimatedGridProps & GridProps;

export const AnimatedGrid: React.FC<AnimatedGridProps> = React.memo(CombinedProps => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const { column, onAnimationComplete, ...gridProps } = CombinedProps;
  const onScroll = () => {};
  const cellRenderer = () => {
    return <div />;
  };
  return (
    <Grid
      cellRenderer={cellRenderer}
      height={300}
      width={300}
      rowHeight={300}
      rowCount={1}
      columnCount={1000}
      columnWidth={300}
      style={{ overflow: 'hidden' }}
      /* Everything above this wil be in the date selector then passed in */
      {...gridProps}
      scrollLeft={scrollLeft}
      onScroll={onScroll}
      scrollToColumn={undefined}
    />
  );
});
