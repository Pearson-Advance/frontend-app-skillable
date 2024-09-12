import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Table from '../index';

const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

const mockColumns = [
  { Header: 'Name', accessor: 'name' },
  { Header: 'Email', accessor: 'email' },
];

const mockHandlePagination = jest.fn();

describe('Table Component', () => {
  it('renders the table component with data', () => {
    render(
      <Table
        isLoading={false}
        data={mockData}
        columns={mockColumns}
        emptyMessage="No data available"
        pageCount={5}
        currentPage={1}
        handlePagination={mockHandlePagination}
      />,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('displays loading state when isLoading is true', () => {
    render(
      <Table
        isLoading
        data={mockData}
        columns={mockColumns}
        emptyMessage="No data available"
        pageCount={5}
        currentPage={1}
        handlePagination={mockHandlePagination}
      />,
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows empty message when there is no data', () => {
    render(
      <Table
        isLoading={false}
        data={[]}
        columns={mockColumns}
        emptyMessage="No data available"
        pageCount={1}
        currentPage={1}
        handlePagination={mockHandlePagination}
      />,
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('handles pagination correctly', () => {
    render(
      <Table
        isLoading={false}
        data={mockData}
        columns={mockColumns}
        emptyMessage="No data available"
        pageCount={5}
        currentPage={1}
        handlePagination={mockHandlePagination}
      />,
    );

    const paginationButton = screen.getByRole('button', { name: /2/i });
    fireEvent.click(paginationButton);

    expect(mockHandlePagination).toHaveBeenCalledWith(2);
  });
});
