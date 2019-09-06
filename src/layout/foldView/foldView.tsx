import React from 'react';
import { Flex } from '@rebass/grid/emotion';
import { Typography } from '@material-ui/core';

export interface FoldViewProps {
  /* props */
}

export const FoldView: React.FC<FoldViewProps> = () => (
  <Flex justifyContent='center' alignItems='center' flex='1 1 0%' bg='red'>
    <Typography>FoldView</Typography>
  </Flex>
);
