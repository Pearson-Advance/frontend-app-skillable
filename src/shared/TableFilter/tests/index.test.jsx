import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableFilter from '../index';

const mockOnFilterSubmit = jest.fn();

describe('TableFilter Component', () => {
  beforeEach(() => {
    mockOnFilterSubmit.mockClear();
  });

  it('renders the component with initial state', () => {
    render(<TableFilter onFilterSubmit={mockOnFilterSubmit} />);

    expect(screen.getByPlaceholderText('Search student')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeDisabled();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('updates the filter value when typing in the input field', () => {
    render(<TableFilter onFilterSubmit={mockOnFilterSubmit} />);
    const input = screen.getByPlaceholderText('Search student');

    fireEvent.change(input, { target: { value: 'john' } });

    expect(input.value).toBe('john');
    expect(screen.getByText('Apply')).toBeEnabled();
  });

  it('calls onFilterSubmit with the correct filter value on form submit', () => {
    render(<TableFilter onFilterSubmit={mockOnFilterSubmit} />);
    const input = screen.getByPlaceholderText('Search student');
    const submitButton = screen.getByText('Apply');

    fireEvent.change(input, { target: { value: 'john' } });
    fireEvent.click(submitButton);

    expect(mockOnFilterSubmit).toHaveBeenCalledWith({ learner_name: 'john' });
  });

  it('resets the filter value and error message when the reset button is clicked', () => {
    render(<TableFilter onFilterSubmit={mockOnFilterSubmit} />);
    const input = screen.getByPlaceholderText('Search student');
    const resetButton = screen.getByText('Reset');

    fireEvent.change(input, { target: { value: 'john' } });
    fireEvent.click(resetButton);

    expect(input.value).toBe('');
    expect(screen.queryByText('Please enter a value to search.')).not.toBeInTheDocument();
    expect(mockOnFilterSubmit).toHaveBeenCalledWith({});
  });

  it('displays external error message when provided as prop', () => {
    const errorMessage = 'External error';
    render(<TableFilter onFilterSubmit={mockOnFilterSubmit} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('changes the selected parameter correctly', () => {
    render(<TableFilter onFilterSubmit={mockOnFilterSubmit} />);
    const emailRadio = screen.getByLabelText('Email');

    fireEvent.click(emailRadio);
    const input = screen.getByPlaceholderText('Search student');

    fireEvent.change(input, { target: { value: 'john@example.com' } });
    const submitButton = screen.getByText('Apply');
    fireEvent.click(submitButton);

    expect(mockOnFilterSubmit).toHaveBeenCalledWith({ learner_email: 'john@example.com' });
  });
});
