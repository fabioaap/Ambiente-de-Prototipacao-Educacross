import type { Preview } from '@storybook/react';
import '../src/tokens.css';
export const parameters: Preview['parameters'] = {
  controls: { expanded: true },
  a11y: { element: '#root' }
};
