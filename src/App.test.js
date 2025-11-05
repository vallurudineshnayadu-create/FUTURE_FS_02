import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Home page title', () => {
  render(<App />);
  expect(
    screen.getByText(/Product Listing Page \(Home\)/i)
  ).toBeInTheDocument();
});

