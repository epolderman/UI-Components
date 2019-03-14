import { FixedSizeGrid } from 'react-window';
import React from 'react';
import { useSpring } from 'react-spring';

/* Handles virtualization with animations */

export interface AnimatedGridProps {
  column: number;
  onAnimationComplete?: () => void;
}

export const AnimatedGrid: React.FC<AnimatedGridProps> = React.memo(
  ({ column, onAnimationComplete }) => {
    return <div>{`${column}`}</div>;
  }
);
