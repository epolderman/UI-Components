import React, { useState, useCallback, MouseEvent, useMemo } from 'react';
import {
  TextField,
  Typography,
  MenuItem,
  Menu,
  makeStyles,
  createStyles,
  Theme,
  Button,
  withStyles
} from '@material-ui/core';
import { Check, KeyboardArrowDown } from '@material-ui/icons';
import { map } from 'lodash';

type AnchorElementType = null | HTMLElement;

const ITEM_HEIGHT = 48;

export interface SelectMenuProps {
  parentOptions?: string[];
  businessOptions?: string[];
  propertyOptions?: string[];
}

export const LongMenu: React.FC<SelectMenuProps> = ({
  parentOptions,
  businessOptions,
  propertyOptions
}) => {
  const [currentLogbookSelected, setLogbook] = useState(parentOptions[0]);
  const [anchorElement, setAnchoredElement] = useState<AnchorElementType>(null);
  const isOpen = anchorElement != null;
  const setAnchoredElementOnClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      setAnchoredElement(event.currentTarget);
    },
    []
  );
  const handleSelectionChange = useCallback(
    (event: MouseEvent<HTMLElement>, nextLogbookSelection: string) => {
      setLogbook(nextLogbookSelection);
      setAnchoredElement(null);
    },
    []
  );
  const onCloseMenu = useCallback(() => setAnchoredElement(null), []);

  const logbookOptionsBusinesses = useMemo(
    () =>
      map(businessOptions, business => {
        const dispatchUpdate = event => handleSelectionChange(event, business);
        const isSelected = business === currentLogbookSelected;
        return (
          <MenuItem
            key={business}
            selected={isSelected}
            onClick={dispatchUpdate}
          >
            {isSelected && <Check />}
            {business}
          </MenuItem>
        );
      }),
    [currentLogbookSelected, businessOptions, handleSelectionChange]
  );

  const logbookOptionsParent = useMemo(
    () =>
      map(parentOptions, parent => {
        const dispatchUpdate = event => handleSelectionChange(event, parent);
        const isSelected = parent === currentLogbookSelected;
        return (
          <MenuItem key={parent} selected={isSelected} onClick={dispatchUpdate}>
            {isSelected && <Check />}
            {parent}
          </MenuItem>
        );
      }),
    [currentLogbookSelected, parentOptions, handleSelectionChange]
  );

  const logbookOptionsProperties = useMemo(
    () =>
      map(propertyOptions, property => {
        const dispatchUpdate = event => handleSelectionChange(event, property);
        const isSelected = property === currentLogbookSelected;
        return (
          <MenuItem
            key={property}
            selected={isSelected}
            onClick={dispatchUpdate}
          >
            {isSelected && <Check />}
            {property}
          </MenuItem>
        );
      }),
    [currentLogbookSelected, propertyOptions, handleSelectionChange]
  );

  return (
    <div>
      <StyledButton
        aria-label='More'
        aria-owns={isOpen ? 'logbook-options-menu' : undefined}
        aria-haspopup='true'
        onClick={setAnchoredElementOnClick}
      >
        {currentLogbookSelected}
        <KeyboardArrowDown />
      </StyledButton>
      <Menu
        id='logbook-options-menu'
        anchorEl={anchorElement}
        open={isOpen}
        onClose={onCloseMenu}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200
          }
        }}
      >
        <MenuHeaders headerText='Parent' />
        {logbookOptionsParent}
        <MenuHeaders headerText='Business' />
        {logbookOptionsBusinesses}
        <MenuHeaders headerText='Properties' />
        {logbookOptionsProperties}
      </Menu>
    </div>
  );
};

// todo: cleanup
const MenuHeaders: React.SFC<{ headerText: string }> = ({ headerText }) => (
  <Typography
    variant='subtitle2'
    style={{ color: '#A9A9A9', textAlign: 'center', height: ITEM_HEIGHT / 2 }}
  >
    {headerText}
  </Typography>
);

// todo: cleanup
export const StyledButton = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'teal',
    color: 'white'
  }
})(Button);
