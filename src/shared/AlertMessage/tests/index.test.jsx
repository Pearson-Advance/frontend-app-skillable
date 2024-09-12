import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertMessage from '../index';

describe('AlertMessage Component', () => {
  it('renders with default props', () => {
    render(<AlertMessage heading="Test Heading" />);

    expect(screen.getByText('Test Heading')).toBeInTheDocument();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert-danger');
  });

  it('renders with a custom variant, heading, and message', () => {
    render(
      <AlertMessage variant="warning" heading="Custom Heading" message="Custom message" />,
    );

    expect(screen.getByText('Custom Heading')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert-warning');
  });

  it('renders children correctly', () => {
    render(
      <AlertMessage heading="Test Heading">
        <button type="button">Click me</button>
      </AlertMessage>,
    );

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
});
