import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { TestProviders } from './TestProviders';

// Create a custom render function that includes providers
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: TestProviders, ...options });

// Export specific items from testing-library
export { screen, fireEvent, waitFor, within } from '@testing-library/react';
export { customRender as render };
