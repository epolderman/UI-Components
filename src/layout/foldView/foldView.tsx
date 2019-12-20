import React from 'react';
import { Flex } from '@rebass/grid/emotion';
import { Typography } from '@material-ui/core';

export interface FoldViewProps {
  leftContent: React.ReactNode;
  middleContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export const FoldView: React.FC<FoldViewProps> = ({
  leftContent,
  middleContent,
  rightContent
}) => (
  <Flex justifyContent='center' alignItems='center' flex='1 1 0%' bg='red'>
    <Typography>FoldView</Typography>
  </Flex>
);
