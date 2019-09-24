import React from 'react';
import { AnimatedGrid } from '../dateSelector/animatedGrid';
import { Flex } from '@rebass/grid/emotion';
import { Typography } from '@material-ui/core';

export interface DateRangeSelector {}

export const DateRangeSelector: React.FC<DateRangeSelector> = props => {
  return (
    <Flex flex='1 1 0%' bg='red'>
      <Typography>Date Range Selector</Typography>
    </Flex>
  );
};
