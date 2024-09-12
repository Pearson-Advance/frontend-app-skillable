import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { columns } from '../columns';
import '@testing-library/jest-dom';

jest.mock('@edx/paragon', () => ({
  // eslint-disable-next-line react/prop-types
  Hyperlink: ({ destination, onClick, children }) => (
    <a href={destination} onClick={onClick}>
      {children}
    </a>
  ),
}));

jest.mock('constants', () => ({
  mfeBaseUrl: '/base-url/:courseId',
}));

describe('Columns Component', () => {
  const mockSetRosterStudent = jest.fn();
  const mockHistory = { push: jest.fn() };
  const mockCourseId = 'course-v1:edX+DemoX+Demo_Course';
  const columnDefinitions = columns(mockCourseId, mockSetRosterStudent, mockHistory);

  it('renders columns correctly', () => {
    expect(columnDefinitions[0].Header).toBe('Username');
    expect(columnDefinitions[1].Header).toBe('Email');
    expect(columnDefinitions[0].accessor).toBe('user');
    expect(columnDefinitions[1].accessor).toBe('email');
  });

  it('renders a hyperlink and calls handleUsernameClick on click', () => {
    const mockRow = {
      original: {
        user: 'testuser',
        email: 'testuser@example.com',
        anonymous_user_id: 'anon_id_123',
      },
    };

    const CellComponent = columnDefinitions[0].Cell;
    render(<CellComponent row={mockRow} />);

    const hyperlink = screen.getByText('testuser');
    expect(hyperlink).toBeInTheDocument();
    fireEvent.click(hyperlink);

    expect(mockSetRosterStudent).toHaveBeenCalledWith({
      user_id: 'anon_id_123',
      username: 'testuser',
      courseId: mockCourseId,
    });
    expect(mockHistory.push).toHaveBeenCalledWith(
      `/base-url/${mockCourseId}/lab-summary/anon_id_123`,
    );
  });
});
