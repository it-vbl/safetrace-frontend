import type { Preview } from '@storybook/react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    head: (
      <head>
        <style>
          {`
            /* Apply the font to the entire Storybook app */
            body {
              font-family: ${Open_Sans.variable}, sans-serif;
              font-family: ${Raleway.variable}, sans-serif;
            }
          `}
        </style>
      </head>
    ),
  },
};

export default preview;
