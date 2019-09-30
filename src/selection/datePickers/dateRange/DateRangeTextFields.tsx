import styled from '@emotion/styled';
import { Button, TextField, Typography } from '@material-ui/core';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CalendarToday,
  CalendarViewDay
} from '@material-ui/icons';
import { Flex } from '@rebass/grid/emotion';
import React, { useCallback, useRef, useReducer } from 'react';

export interface DateRangeTextFieldsProps {}

type CombinedProps = DateRangeTextFieldsProps &
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;

export const DateRangeTextFields: React.FC<CombinedProps> = props => {
  const onChange1 = (evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  };

  const onChange2 = (evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  };

  return (
    <Flex alignItems='center' justifyContent='center' flex='1 1 0%'>
      <CalendarToday style={{ marginRight: '8px' }} />
      <TextField
        value={''}
        placeholder={'12/19/99'}
        onChange={onChange1}
        margin='dense'
        autoComplete='on'
        variant='outlined'
        style={{
          margin: 0
        }}
        InputProps={{
          endAdornment: null,
          startAdornment: null,
          style: { width: '150px' }
        }}
      />
      <Typography variant='subtitle1' style={{ margin: '0 8px' }}>
        to
      </Typography>
      <TextField
        value={''}
        placeholder={'12/19/99'}
        onChange={onChange2}
        margin='dense'
        autoComplete='on'
        variant='outlined'
        style={{
          margin: 0
        }}
        InputProps={{
          endAdornment: null,
          startAdornment: null,
          style: { width: '150px' }
        }}
      />
    </Flex>
  );
};
