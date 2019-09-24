import styled from '@emotion/styled';
import { Flex } from '@rebass/grid/emotion';
import { Button, Typography } from '@material-ui/core';
import { MAX_NUMBER_WEEKS_SHOWN, DAYS } from '../dateUtils';
import { range, map } from 'lodash';
import React from 'react';

/* Shared Function / Styled Components between Calender Renderers */

export const Container = styled(Flex)`
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: stretch;
  align-content: stretch;
  position: relative;
`;

/* Contains Month Name Row + Day Names Row */
export const CalendarHeader = styled(Flex)`
  max-height: 75px; /* 2 Rows = 2 * 37.5 */
  flex-direction: column;
  flex: 1 1 0%;
`;

export const CalendarContents = styled(Flex)`
  flex: 1 1 0%;
  top: 75px; /* 2 Rows = 2 * 37.5 */
  flex-direction: column;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
`;

export const CalendarRow = styled(Flex)<{ hasText?: boolean }>`
  flex: 1 1 0%;
  flex-direction: row;
  justify-content: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  align-items: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  padding: 2px 0;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1 0%;
    min-width: 0;
    padding: 0 0;
    margin: 0 2px;
    border-radius: 2.5px;
  }
`;

export const DayNameBlocks = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex: 1 1 0%;
  min-width: 0;
  padding: 0 0;
  margin: 0 2px;
  border-radius: 2.5px;
`;

export const getSkeletonMonth = () => {
  return range(0, MAX_NUMBER_WEEKS_SHOWN).map(() =>
    new Array(DAYS.length).fill(null)
  );
};

export const renderSkeletonWeek = (week: any[]) => {
  return map(week, (_, index) => (
    <Button style={{ backgroundColor: BACKGROUND_EMPTY }} key={index}>
      <Typography color='primary'>{null}</Typography>
    </Button>
  ));
};

export const BACKGROUND_EMPTY = 'rgb(238,238,238)';
export const BRAND_PRIMARY = 'rgb(74,175,227)';
