import { FixedSizeGrid, FixedSizeGridProps } from 'react-window';
import React from 'react';
import { useSpring } from 'react-spring';

/* Handles virtualization with animations via windowing */

export interface AnimatedGridProps {
  column: number;
  onAnimationComplete?: () => void;
}

export type CombinedProps = AnimatedGridProps & FixedSizeGridProps;

export const AnimatedGrid: React.FC<AnimatedGridProps> = React.memo(CombinedProps => {
  const { column, onAnimationComplete, ...gridProps } = CombinedProps;
  return (
    <FixedSizeGrid
      {...gridProps}
      //@ts-ignore TODO: look into how rendering is handles in react-window fix-sized-grid vs react-virtualization grid
      children={<div />}
    />
  );
});
