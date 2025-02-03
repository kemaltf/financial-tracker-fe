'use client';

import { createTheme, CSSVariablesResolver, rem } from '@mantine/core';

export const theme = createTheme({
  colors: {
    // Add your color
    deepBlue: [
      '#eef3ff',
      '#dce4f5',
      '#b9c7e2',
      '#94a8d0',
      '#748dc1',
      '#5f7cb8',
      '#5474b4',
      '#44639f',
      '#39588f',
      '#2d4b81',
    ],
    // or replace default theme color
    blue: [
      '#eef3ff',
      '#dee2f2',
      '#bdc2de',
      '#98a0ca',
      '#7a84ba',
      '#6672b0',
      '#5c68ac',
      '#4c5897',
      '#424e88',
      '#364379',
    ],
  },

  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },

  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },

  // breakpoints: {
  //   xs: '30em',
  //   sm: '48em',
  //   md: '64em',
  //   lg: '74em',
  //   xl: '90em',
  // },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--app-header-height': rem(60),
  },
  dark: {
    '--app-header-height': rem(60),
  },
  light: {
    '--app-header-height': rem(60),
  },
});
