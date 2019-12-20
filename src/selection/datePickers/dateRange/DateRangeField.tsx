import styled from '@emotion/styled';
import { TextField, Typography, withStyles } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import React, { useCallback } from 'react';

/*
  Handles submission of date ranges. 
  RangeSpecifier is acting as the textfield Id & HtmlFor for the label to link them. 
*/

type RangeSpecifierType = 'start' | 'end';

type TextFieldPropsWithoutLabel = Omit<TextFieldProps, 'label'>;

type CombinedProps = DateRangeFieldProps & TextFieldPropsWithoutLabel;

export interface DateRangeFieldProps {
  onDateParse: (dateTyped: string, rangeSpecifier: RangeSpecifierType) => void;
  rangeSpecifier: RangeSpecifierType;
  fieldLabel?: string;
}

export const DateRangeField: React.FC<CombinedProps> = React.forwardRef(
  ({ onDateParse, rangeSpecifier, fieldLabel, ...textFieldProps }, ref) => {
    const onSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        onDateParse(textFieldProps.value as string, rangeSpecifier);
      },
      [textFieldProps.value, onDateParse, rangeSpecifier]
    );

    return (
      <FormContainer onSubmit={onSubmit}>
        {fieldLabel && (
          <FieldLabel htmlFor={rangeSpecifier}>{fieldLabel}</FieldLabel>
        )}
        <TextField
          {...textFieldProps}
          inputRef={ref}
          id={rangeSpecifier}
          margin='dense'
          autoComplete='off'
          variant='outlined'
          fullWidth
          /* PlaceHolder and Input */
          InputProps={{ style: { fontSize: '14px' } }}
          style={{ margin: '0 0' }}
        />
      </FormContainer>
    );
  }
);

const FormContainer = styled.form`
  display: flex;
  flex: 1 1 0%;
  position: relative;
`;

const FieldLabel: React.FC<
  React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
> = props => (
  <Typography
    variant='caption'
    //@ts-ignore
    color='textSecondary'
    component='label'
    style={{ position: 'absolute', top: '-18px', left: '14px' }}
    {...props}
  ></Typography>
);
