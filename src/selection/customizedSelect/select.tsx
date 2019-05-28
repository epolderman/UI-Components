import React, { useState, useCallback } from 'react';
import {
  Select,
  Typography,
  Input,
  withStyles,
  MenuItem
} from '@material-ui/core';

const optionsBusiness = ['Lotus', 'Havana House', 'Bobs Burgers'];
const optionsProperty = ['SomeProp', 'SomeProp2', 'SomeProp3'];

export const SelectComponent: React.FC = () => {
  const [property, setProperty] = useState('Lotus');
  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    console.log('HandleChange()');
    setProperty(event.target.value);
  };

  console.log('state call motherfucker', property);

  return (
    <div
      style={{
        display: 'flex',
        marginTop: '24px',
        flex: '1 1 0%'
      }}
    >
      <StyledSelect>
        value={property}
        onChange={handleChange}
        input={<Input />}
        <Typography>Business</Typography>
        {optionsBusiness.map(business => (
          <MenuItem key={business} value={business}>
            {business}
          </MenuItem>
        ))}
        <Typography>Property</Typography>
        {optionsProperty.map(property => (
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
      backgroundColor: 'red'
    }
  }
})(Select);
