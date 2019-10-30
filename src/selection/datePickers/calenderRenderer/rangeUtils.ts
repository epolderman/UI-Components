import styled from '@emotion/styled';
import { Flex } from '@rebass/grid/emotion';
import {
  BRAND_PRIMARY,
  BRAND_PRIMARY_LIGHT,
  text
} from '../../../common/colors';

/* 
    https://material.io/components/pickers/#specs 
*/

// Calendar Rows: 36 * 6 = 216 + 36 (Month Name Header Row) + 36 (Day Names Row) = 288
export const CALENDAR_CONTENTS_HEIGHT = 288;
export const CALENDAR_DIMENSIONS_RANGE_WIDTH = 512;
export const CALENDAR_DIMENSIONS_RANGE_HEIGHT = 304;

// HasText is a flag to signify this is the header (Left Arrow - Month Name - Right Arrow)
export const CalendarRowRange = styled(Flex)<{ hasText?: boolean }>`
  flex: 1 1 0%;
  flex-direction: row;
  justify-content: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  align-items: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  padding: 2px 0;
  width: 224px;
  height: 36px;
  max-height: 36px;
  button {
    display: flex;
    flex: 1 1 0%;
    min-width: 0;
    padding: 0 0;
  }
`;

export const MonthContainer = styled(Flex)`
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: stretch;
  align-content: stretch;
  position: relative;
  margin: 0 16px;
  max-height: ${CALENDAR_CONTENTS_HEIGHT}px;
`;

/* Contains Month Name Row + Day Names Row */
export const CalendarHeader = styled(Flex)`
  max-height: 72px; /*  36 + 36 = 72 */
  flex-direction: column;
  flex: 1 1 0%;
`;

export const CalendarContents = styled(Flex)`
  flex: 1 1 0%;
  top: 72px; /*  36 + 36 = 72 */
  flex-direction: column;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  align-items: stretch;
  justify-content: stretch;
  height: 216px; /* 36 * 6 */
  max-height: 216px; /* 36 * 6 */
`;

export const DayNameBlocks = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex: 1 1 0%;
  min-width: 0;
  padding: 0 0;
  margin: 0 0;
  border-radius: 2.5px;
`;

/* Day marker styles / See mockups */
export const RIGHT_RADIUS_STYLE: React.CSSProperties = {
  backgroundColor: BRAND_PRIMARY_LIGHT,
  borderTopRightRadius: '50%',
  borderBottomRightRadius: '50%',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0
};

export const LEFT_RADIUS_STYLE: React.CSSProperties = {
  backgroundColor: BRAND_PRIMARY_LIGHT,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderTopLeftRadius: '50%',
  borderBottomLeftRadius: '50%'
};

export const SQUARE_STYLE: React.CSSProperties = {
  backgroundColor: BRAND_PRIMARY_LIGHT,
  borderRadius: 0
};

export const FULL_RADIUS_STYLE: React.CSSProperties = {
  backgroundColor: BRAND_PRIMARY,
  borderRadius: '50%',
  color: 'white'
};

export const TODAY_STYLE: React.CSSProperties = {
  color: `${text.black.primary}`,
  borderRadius: '50%',
  border: `1px solid ${text.black.secondary}`
};

export const RANGE_BUTTON_STYLE: React.CSSProperties = {
  zIndex: 3,
  position: 'absolute',
  width: '100%',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
};
