import { css } from '@emotion/core';

export const ELEVATIONS = {
  NONE: 0,
  CARD: 2,
  BUTTON: 2,
  HEADER: 4,
  FLOATING_ACTION_BUTTON: 6,
  MENU: 8,
  NAV_DRAWER: 16,
  MODAL: 24
};

export function makeShadow(elevation: number) {
  // Numbers pulled from a linear regression on sketch material design shadow definitions:
  // https://material.io/guidelines/resources/shadows.html#shadows-sketch
  return css`
    z-index: ${elevation};
    box-shadow: 0px ${elevation}px ${elevation * 1.5}px ${elevation * 0.1}px
        rgba(0, 0, 0, 0.14),
      0px ${elevation * 0.4}px ${elevation * 1.9}px ${elevation * 0.3}px
        rgba(0, 0, 0, 0.12),
      0px ${elevation * 0.5}px ${elevation * 0.75}px rgba(0, 0, 0, 0.2);
  `;
}

export const makeShadowCSS = (elv: number): React.CSSProperties => {
  return {
    zIndex: elv,
    boxShadow: `0px ${elv}px ${elv * 1.5}px ${elv * 0.1}px rgba(0, 0, 0, 0.14),
                0px ${elv * 0.4}px ${elv * 1.9}px ${elv *
      0.3}px rgba(0, 0, 0, 0.12),
                0px ${elv * 0.5}px ${elv * 0.75}px rgba(0, 0, 0, 0.2)`
  };
};
