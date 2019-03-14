import { FixedSizeGrid } from 'react-window';
import React from 'react';

export interface AnimatedGridProps {
  column: number;
  onAnimationComplete?: () => void;
}

export const AnimatedGrid: React.FC<AnimatedGridProps> = ({
  column,
  onAnimationComplete
}) => {
  return <div>{`${column}`}</div>;
};
