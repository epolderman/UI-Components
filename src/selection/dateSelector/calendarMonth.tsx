import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  DateMatrix,
  buildDateMatrix,
  CALENDAR_DAY_FORMAT,
  isSameDate,
  DAYS,
  MAX_NUMBER_WEEKS_SHOWN
} from './dateUtils';
import { format, isSameMonth } from 'date-fns';
import { range, map } from 'lodash';
import styled from '@emotion/styled';
import { Button, Typography, withStyles, Fab } from '@material-ui/core';
import { useSpring, animated, config } from 'react-spring';

/* Calculation of calendar month data */

export interface CalendarMonthProps {
  month: Date;
  selectedDate: Date;
  onSelect: (incomingDate: Date) => void;
  skeleton?: boolean;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = React.memo(
  ({ month, selectedDate, skeleton, onSelect }) => {
    // todo: clean into one w/ interpolation
    const fadeSkeleton = useSpring({
      opacity: skeleton ? 1 : 0,
      config: config.gentle
    });
    const fadeMonth = useSpring({
      opacity: skeleton ? 0 : 1,
      config: config.gentle
    });

    const renderWeek = useCallback(
      (week: Date[]) =>
        map(week, (date, index) => {
          const dispatchSelect = () => onSelect(date);
          if (isSameDate(date, selectedDate)) {
            return (
              <SelectedItem key={index} variant='round' color='primary'>
                {format(date, CALENDAR_DAY_FORMAT)}
              </SelectedItem>
            );
          } else if (!isSameMonth(month, date)) {
            return (
              <CalendarItem
                onClick={dispatchSelect}
                key={index}
                style={{ backgroundColor: '#34495e', color: 'white' }}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalendarItem>
            );
          } else {
            return (
              <CalendarItem onClick={dispatchSelect} key={index}>
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalendarItem>
            );
          }
        }),
      [onSelect, selectedDate, month]
    );

    const monthJSX = useMemo(() => {
      const currentMonth: DateMatrix = buildDateMatrix(month);
      return map(currentMonth, (week, index) => (
        <Row key={index}>{renderWeek(week)}</Row>
      ));
    }, [month, renderWeek]);

    const monthTitleJSX = useMemo(
      () => (
        <Row hasText>
          <Typography style={{ fontSize: '20px' }} color='primary'>
            {format(month, 'MMM YYYY')}
          </Typography>
        </Row>
      ),
      [month]
    );

    const skeletonMonthJSX = useMemo(() => {
      const month = getSkeletonMonth();
      return map(month, (week, index) => (
        <Row key={index}>{renderSkeletonWeek(week)}</Row>
      ));
    }, []);

    const dayNamesJSX = useMemo(
      () => (
        <Row>
          {map(DAYS, (day, index) => (
            <DayItem
              key={index}
              color='secondary'
              disableFocusRipple
              disableRipple
            >
              {day.slice(0, 3)}
            </DayItem>
          ))}
        </Row>
      ),
      []
    );

    // todo: cleanup on render after flushing out the component
    return (
      <CalendarMonthWrapper>
        <TopWrapper>
          {monthTitleJSX}
          {dayNamesJSX}
        </TopWrapper>
        <AnimatedWrapper style={fadeMonth}>{monthJSX}</AnimatedWrapper>
        <AnimatedWrapper allowClickThrough style={fadeSkeleton}>
          {skeletonMonthJSX}
        </AnimatedWrapper>
      </CalendarMonthWrapper>
    );
  }
);

const getSkeletonMonth = () => {
  return range(0, MAX_NUMBER_WEEKS_SHOWN).map(() => {
    return new Array(DAYS.length).fill(null);
  });
};

// todo: fab doesnt like children == null?
const renderSkeletonWeek = (week: any[]) => {
  return map(week, (_, index) => (
    <SkeletonItem key={index}>
      <Typography style={{ fontSize: '20px' }} color='primary'>
        {null}
      </Typography>
    </SkeletonItem>
  ));
};

const CalendarMonthWrapper = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: stretch;
  align-content: stretch;
  box-sizing: border-box;
  position: relative;
`;

const TopWrapper = styled.div`
  max-height: 125px;
  flex-direction: column;
  flex: 1 1 0%;
  display: flex;
`;

const AnimatedWrapper = styled(animated.div)<{ allowClickThrough?: boolean }>`
  display: flex;
  flex: 1 1 0%;
  top: 125px;
  flex-direction: column;
  box-sizing: border-box;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: ${({ allowClickThrough }) =>
    allowClickThrough ? 'none' : 'all'};
`;

const Row = styled.div<{ hasText?: boolean }>`
  display: flex;
  flex: 1 1 0%;
  flex-direction: row;
  justify-content: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  align-items: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  box-sizing: border-box;
`;

const CalendarItem = withStyles({
  root: {
    display: 'flex',
    flex: '1 1 0%',
    margin: '0px 8px',
    borderRadius: '2.5px',
    backgroundColor: 'white'
  },
  label: {
    fontSize: '20px'
  }
})(Fab);

const SelectedItem = withStyles({
  root: {
    display: 'flex',
    flex: '1 1 0%',
    margin: '0px 8px',
    borderRadius: '2.5px'
  },
  label: {
    fontSize: '20px'
  }
})(Fab);

const DayItem = withStyles({
  root: {
    display: 'flex',
    flex: '1 1 0%',
    margin: '0px 8px',
    borderRadius: '2.5px'
  },
  label: {
    fontSize: '20px'
  }
})(Fab);

const SkeletonItem = withStyles({
  root: {
    display: 'flex',
    flex: '1 1 0%',
    margin: '0px 8px',
    borderRadius: '2.5px',
    backgroundColor: 'white'
  },
  label: {
    fontSize: '20px'
  }
})(Fab);
