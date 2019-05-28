import React, { useState, useCallback } from 'react';
import {
  Select,
  Typography,
  Input,
  withStyles,
  MenuItem
} from '@material-ui/core';

export interface SelectProps {
  business: string[];
  properties: string[];
}

export const optionsBusiness = ['Lotus', 'Havana House', 'Bobs Burgers'];
export const optionsProperty = ['SomeProp', 'SomeProp2', 'SomeProp3'];

export const SelectComponent: React.FC<SelectProps> = ({
  business,
  properties
}) => {
  const [property, setProperty] = useState(business[0]);
  const handleChange = (event: React.ChangeEvent<{ value: string }>) =>
    setProperty(event.target.value);

  return (
    <div
      style={{
        display: 'flex',
        marginTop: '24px',
        flex: '1 1 0%'
      }}
    >
      <StyledSelect value={property} onChange={handleChange}>
        <Typography>Business</Typography>
        {business.map(business => (
          <MenuItem key={business} value={business}>
            {business}
          </MenuItem>
        ))}
        <Typography>Property</Typography>
        {properties.map(property => (
          <MenuItem key={property} value={property}>
            {property}
          </MenuItem>
        ))}
      </StyledSelect>
    </div>
  );
};

const StyledSelect = withStyles({
  root: {
    '& .MuiInput-input': {
      backgroundColor: 'inherit'
    },
    select: {
      backgroundColor: 'green'
    }
  }
})(Select);
