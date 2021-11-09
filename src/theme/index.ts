import { css, DefaultTheme } from 'styled-components/macro';

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
};

const mediaWidthTemplates: {
  [width in keyof typeof MEDIA_WIDTHS]: typeof css;
} = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  (accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `;
  return accumulator;
}, {}) as any;

export interface ThemeColors {
  globalBlack: string;
  globalWhite: string;
  black: string;
  white: string;
  yellowHapi: string;
  greyText: string;
  greyCard: string;
  greyCardShadow: string;
}

export const colors: ThemeColors = {
  globalBlack: '#131313',
  globalWhite: '#FFFFFF',
  black: '#000000',
  white: '#ffffff',
  yellowHapi: '#FDEE2D',
  greyText: '#91949D',
  greyCard: '#5A5E6D',
  greyCardShadow: 'rgba(19, 19, 19, 0.6)',
};

function theme(): DefaultTheme {
  return {
    ...colors,

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  };
}

export default theme;
