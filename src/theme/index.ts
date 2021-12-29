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
  layoutBlack: string;

  globalBlack: string;
  globalWhite: string;
  globalGrey: string;
  globalGreen: string;

  globalGreyOp04: string;
  globalGreyOp02: string;
  globalGreyOp01: string;

  black: string;
  white: string;

  yellowHapi: string;
  greyText: string;
  greyCard: string;
  greyCardShadow: string;
  greyFooterLogo: string;
  greySocialNetworkBg: string;
  blackCardBg: string
  blackCardText: string;
  blackCardShadow: string
  redBorder: string;
  darkGreenBg: string;
  greenText: string;
  greyBorder: string;

  pink: string;
  greyButton: string;
  backgroundCard: string;
  boxShadowCard: string;
  specialBorderCard: string;
}

export const colors: ThemeColors = {
  layoutBlack: 'rgba(0, 0, 0, 0.6)',

  globalBlack: '#131313',
  globalWhite: '#FFFFFF',
  globalGrey: '#8991A3',
  globalGreen: '#84DA18',

  globalGreyOp04: '#4A515F',
  globalGreyOp02: '#353B49',
  globalGreyOp01: '#2A313D',

  black: '#000000',
  white: '#ffffff',

  yellowHapi: '#FDEE2D',
  greyText: '#91949D',
  greyCard: '#5A5E6D',
  greyCardShadow: 'rgba(19, 19, 19, 0.6)',
  greyFooterLogo: '#6A6D76',
  greySocialNetworkBg: '#2B2B2B',
  greyBorder: '#727272',
  blackCardBg: 'rgba(19, 19, 19, 0.9)',
  blackCardText: '#A1A4AC',
  blackCardShadow: '#41444d',
  redBorder: '#FE2C55',
  darkGreenBg: '#212C1E;',
  greenText: '#8EF46A',

  pink: '#FE2C55',
  greyButton: '#454D5C',
  backgroundCard: '#202632',
  boxShadowCard: 'rgba(10, 12, 18, 0.2)',
  specialBorderCard: 'linear-gradient(180deg, rgb(53, 60, 73), rgba(137, 145, 163, 0) 100%)',
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
