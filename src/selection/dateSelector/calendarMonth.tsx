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
import {
  Button,
  Typography,
  withStyles,
  Fab,
  makeStyles,
  WithStyles,
  createStyles,
  Theme,
  Color
} from '@material-ui/core';
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
      opacity: skeleton ? 1 : 0
    });
    const fadeMonth = useSpring({
      opacity: skeleton ? 0 : 1
    });
    const renderWeek = useCallback(
      (week: Date[]) =>
        map(week, (date, index) => {
          const dispatchSelect = () => onSelect(date);
          if (isSameDate(date, selectedDate)) {
            return (
              <ClickableDefault key={index} variant='round' color='primary'>
                {format(date, CALENDAR_DAY_FORMAT)}
              </ClickableDefault>
            );
          } else if (!isSameMonth(month, date)) {
            return (
              <ClickableDefault
                onClick={dispatchSelect}
                key={index}
                style={{ backgroundColor: '#34495e', color: 'white' }}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </ClickableDefault>
            );
          } else {
            return (
              <ClickableWhite onClick={dispatchSelect} key={index}>
                {format(date, CALENDAR_DAY_FORMAT)}
              </ClickableWhite>
            );
          }
        }),
      [onSelect, selectedDate, month]
    );

    const monthJSX = useMemo(() => {
      const currentMonth: DateMatrix = buildDateMatrix(month);
      return map(currentMonth, (week, index) => (
        <FlexRow key={index}>{renderWeek(week)}</FlexRow>
      ));
    }, [month, renderWeek]);

    const monthTitleJSX = useMemo(
      () => (
        <FlexRow hasText>
          <Typography style={{ fontSize: '20px' }} color='primary'>
            {format(month, 'MMM YYYY')}
          </Typography>
        </FlexRow>
      ),
      [month]
    );

    const skeletonMonthJSX = useMemo(() => {
      const month = getSkeletonMonth();
      return map(month, (week, index) => (
        <FlexRow key={index}>{renderSkeletonWeek(week)}</FlexRow>
      ));
    }, []);

    const dayNamesJSX = useMemo(
      () => (
        <FlexRow>
          {map(DAYS, (day, index) => (
            <ClickableDefault
              key={index}
              color='secondary'
              disableFocusRipple
              disableRipple
              disableTouchRipple
            >
              {day.slice(0, 3)}
            </ClickableDefault>
          ))}
        </FlexRow>
      ),
      []
    );

    return (
      <CalendarContainer>
        <CalendarHeader>
          {monthTitleJSX}
          {dayNamesJSX}
        </CalendarHeader>
        <CalendarAnimatedContent style={fadeMonth}>
          {monthJSX}
        </CalendarAnimatedContent>
        <CalendarAnimatedContent
          style={{ opacity: fadeSkeleton.opacity, pointerEvents: 'none' }}
        >
          {skeletonMonthJSX}
        </CalendarAnimatedContent>
      </CalendarContainer>
    );
  }
);

const getSkeletonMonth = () => {
  return range(0, MAX_NUMBER_WEEKS_SHOWN).map(() => {
    return new Array(DAYS.length).fill(null);
  });
};

// todo: fab doesnt like children == null? Investigate
const renderSkeletonWeek = (week: any[]) => {
  return map(week, (_, index) => (
    <ClickableWhite key={index}>
      <Typography style={{ fontSize: '20px' }} color='primary'>
        {null}
      </Typography>
    </ClickableWhite>
  ));
};

const CalendarContainer = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: stretch;
  align-content: stretch;
  box-sizing: border-box;
  position: relative;
`;

const CalendarHeader = styled.div`
  max-height: 125px; /* 2 Rows = 2 * 62.5 */
  flex-direction: column;
  flex: 1 1 0%;
  display: flex;
`;

const CalendarAnimatedContent = styled(animated.div)`
  display: flex;
  flex: 1 1 0%;
  top: 125px; /* 2 Rows = 2 * 62.5 */
  flex-direction: column;
  box-sizing: border-box;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
`;

const FlexRow = styled.div<{ hasText?: boolean }>`
  display: flex;
  flex: 1 1 0%;
  flex-direction: row;
  justify-content: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  align-items: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  box-sizing: border-box;
`;

const ClickableWhite = withStyles({
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

const ClickableDefault = withStyles({
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

// const useStyles = makeStyles({
//   root: {
//     display: 'flex',
//     flex: '1 1 0%',
//     margin: '0px 8px',
//     borderRadius: '2.5px',
//     backgroundColor: 'white'
//   },
//   label: {
//     fontSize: '20px'
//   }
// });

// const styles = (theme: Theme) =>
//   createStyles({
//     root: {
//       /* ... */
//     },
//     paper: {
//       /* ... */
//     },
//     button: {
//       /* ... */
//     }
//   });

// interface Props extends WithStyles<typeof styles> {
//   backgroundColor: Color;
// }

// const GenericButton = withStyles(styles)(({ backgroundColor }: Props) => (
//   <Fab color={backgroundColor} />
// ));
