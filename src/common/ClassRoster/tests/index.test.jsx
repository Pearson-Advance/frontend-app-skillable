import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import ClassRoster from '../index';
import '@testing-library/jest-dom';

jest.mock('../../../shared/Table', () => () => <div>Mocked Table Component</div>);
jest.mock('../../../shared/DashboardLaunchButton', () => () => <div>Mocked DashboardLaunchButton</div>);
jest.mock('../../../shared/AlertMessage', () => () => <div>Mocked AlertMessage</div>);

const mockPost = jest.fn();
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(() => ({
    post: mockPost,
  })),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockCourseId = 'course-v1:edX+DemoX+Demo_Course';
const mockSetRosterStudent = jest.fn();
const mockHistory = { push: jest.fn() };

describe('ClassRoster Component', () => {
  beforeEach(() => {
    mockPost.mockResolvedValue({
      data: {
        results: [],
        count: 0,
        prev: null,
        next: null,
      },
    });
  });

  it('renders the component correctly', async () => {
    await act(async () => {
      render(
        <ClassRoster
          courseId={mockCourseId}
          setRosterStudent={mockSetRosterStudent}
          history={mockHistory}
        />,
      );
    });

    expect(screen.getByText('Mocked Table Component')).toBeInTheDocument();
    expect(screen.getByText('Mocked DashboardLaunchButton')).toBeInTheDocument();
  });

  it('fetches data on mount', async () => {
    render(<ClassRoster courseId="course-v1:edX+DemoX+Demo_Course" setRosterStudent={jest.fn()} history={mockHistory} />);

    await waitFor(() => {
      expect(getAuthenticatedHttpClient().post).toHaveBeenCalledWith(
        'undefined/pearson-core/api/v1/course-enrollments?page=1',
        { course_id: 'course-v1:edX+DemoX+Demo_Course' },
      );
    });
  });

  it('handles filter submission', async () => {
    await act(async () => {
      render(
        <ClassRoster
          courseId={mockCourseId}
          setRosterStudent={mockSetRosterStudent}
          history={mockHistory}
        />,
      );
    });

    const filterButton = screen.getByRole('button', { name: /Apply/i });
    act(() => {
      fireEvent.click(filterButton);
    });

    expect(mockSetRosterStudent).not.toHaveBeenCalled();
  });

  it('handles error during data fetch', async () => {
    mockPost.mockRejectedValueOnce({
      response: {
        data: {
          email: ['Invalid email format'],
        },
      },
    });

    render(<ClassRoster courseId={mockCourseId} setRosterStudent={mockSetRosterStudent} history={mockHistory} />);

    await waitFor(() => {
      expect(logError).toHaveBeenCalled();
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });
  it('resets error message and calls fetchUsersData on filter submission', async () => {
    getAuthenticatedHttpClient.mockReturnValue({ post: mockPost });
    render(
      <ClassRoster
        courseId={mockCourseId}
        setRosterStudent={mockSetRosterStudent}
        history={mockHistory}
      />,
    );
    const filterButton = screen.getByRole('button', { name: /Apply/i });
    fireEvent.click(filterButton);
    expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('/pearson-core/api/v1/course-enrollments'),
        expect.any(Object),
      );
    });
  });
});
