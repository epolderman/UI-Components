import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { TextField, Typography } from '@material-ui/core';

const ITEM_HEIGHT = 48;

export const optionsBusiness = [
  'Lotus',
  'Havana House',
  'Bobs Burgers',
  'some property',
  'another one',
  'some more',
  'hahahah',
  'owah'
];

export const optionsProperty = ['SomeProp1', 'SomeProp2', 'SomeProp3'];

export const LongMenu: React.FC = () => {
  const [property, setProperty] = useState('Lotus');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleMenuItemClick(
    event: React.MouseEvent<HTMLElement>,
    property: string
  ) {
    setProperty(property);
    setAnchorEl(null);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <TextField
        value={property}
        aria-label='More'
        aria-owns={open ? 'long-menu' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
      >
        <MoreVertIcon />
      </TextField>
      <Menu
        id='long-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200
          }
        }}
      >
        <Typography>Business</Typography>
        {optionsBusiness.map((option, index) => {
          return (
            <MenuItem
              key={option}
              selected={option === property}
              onClick={event => handleMenuItemClick(event, option)}
            >
              {option}
            </MenuItem>
          );
        })}
        <Typography>Property</Typography>
        {optionsProperty.map((option, index) => {
          return (
            <MenuItem
              key={option}
              selected={option === property}
              onClick={event => handleMenuItemClick(event, option)}
            >
              {option}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};
