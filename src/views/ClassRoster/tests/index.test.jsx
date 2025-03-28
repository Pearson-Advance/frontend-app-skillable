import React from 'react';
import {
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
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

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn().mockReturnValue({
    COURSE_OPERATIONS_API_V2_BASE_URL: 'http://localhost:18000/pearson_course_operation/api/v1',
  }),
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
});
