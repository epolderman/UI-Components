import styled from '@emotion/styled';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import React, { useCallback } from 'react';

type RangeSpecifierType = 'start' | 'end';

export interface DateRangeFieldProps {
  onDateParse: (dateTyped: string, rangeSpecifier: RangeSpecifierType) => void;
  rangeSpecifier: RangeSpecifierType;
}

type CombinedProps = DateRangeFieldProps & TextFieldProps;

export const DateRangeField: React.FC<CombinedProps> = ({
  onDateParse,
  rangeSpecifier,
  ...textFieldProps
}) => {
  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onDateParse(textFieldProps.value as string, rangeSpecifier);
    },
    [textFieldProps.value]
  );

  return (
    <FormContainer onSubmit={onSubmit}>
      <TextField
        {...textFieldProps}
        margin='dense'
        autoComplete='on'
        variant='outlined'
        fullWidth
        style={{
          margin: 0
        }}
        InputProps={{
          endAdornment: null,
          startAdornment: null
        }}
      />
    </FormContainer>
  );
};

const FormContainer = styled.form`
  display: flex;
  flex: 1 1 0%;
  max-width: 150px;
`;
