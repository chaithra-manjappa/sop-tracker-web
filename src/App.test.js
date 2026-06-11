import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the admin login screen', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});
