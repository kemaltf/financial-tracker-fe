import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { resolver, theme } from '../theme';
import StoreProvider from './StoreProvider';

import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import './global.css';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        {/* https://mantine.dev/styles/css-variables/#css-variables-resolver */}
        <MantineProvider theme={theme} cssVariablesResolver={resolver}>
          <Notifications />
          <StoreProvider>
            <ModalsProvider>{children}</ModalsProvider>
          </StoreProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
