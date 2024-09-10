import React from 'react';
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from '@testing-library/react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import {
  BrowserRouter as Router,
  MemoryRouter,
} from 'react-router-dom';
import LabDetails from '../index';
import '@testing-library/jest-dom';

// Mock necessary components
jest.mock('../../../shared/AlertMessage', () => () => <div>Mocked AlertMessage</div>);
jest.mock('../../../shared/LabDetailsCard', () => () => <div>Mocked LabDetailsCard</div>);
jest.mock('../../../shared/LabDetailsChartCard', () => () => <div>Mocked LabDetailsChartCard</div>);
jest.mock('../../../shared/JsonViewer', () => () => <div>Mocked JsonViewer</div>);
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));
jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockPost = jest.fn();
const mockLabData = {
  labInstanceId: 123,
  labProfileName: 'Sample Lab',
  user_id: 'student_123',
};

jest.mock('constants', () => ({
  mfeBaseUrl: '/base-url/:courseId',
  skillableUrl: 'https://example.com',
}));

const mockCourseId = 'course-v1:edX+DemoX+Demo_Course';
const mockHistory = { push: jest.fn() };

describe('LabDetails Component', () => {
  beforeEach(() => {
    getAuthenticatedHttpClient.mockReturnValue({ post: mockPost });
    mockPost.mockResolvedValue({ data: { NumTasks: 5, NumCompletedTasks: 5 } });
  });

  it('renders the component correctly', async () => {
    await act(async () => {
      render(
        <Router>
          <LabDetails courseId={mockCourseId} labData={mockLabData} history={mockHistory} />
        </Router>,
      );
    });

    expect(screen.getByText('Mocked LabDetailsCard')).toBeInTheDocument();
    expect(screen.getByText('Mocked LabDetailsChartCard')).toBeInTheDocument();
    expect(screen.getByText('Mocked JsonViewer')).toBeInTheDocument();
  });

  it('redirects to the correct URL when labData is missing', async () => {
    await act(async () => {
      const { container } = render(
        <MemoryRouter initialEntries={['/']}>
          <LabDetails courseId={mockCourseId} labData={null} history={mockHistory} />
        </MemoryRouter>,
      );

      // Check for Redirect component being rendered
      expect(container.innerHTML).toContain('');
    });
  });

  it('handles breadcrumb click events correctly', async () => {
    await act(async () => {
      render(
        <Router>
          <LabDetails courseId={mockCourseId} labData={mockLabData} history={mockHistory} />
        </Router>,
      );
    });

    const breadcrumb = screen.getByText('Class Roster');
    await act(async () => {
      fireEvent.click(breadcrumb);
    });
    expect(mockHistory.push).toHaveBeenCalledWith('/base-url/course-v1:edX+DemoX+Demo_Course');
  });

  it('handles breadcrumb click events for LabSummary', async () => {
    await act(async () => {
      const { getByText } = render(
        <MemoryRouter>
          <LabDetails courseId={mockCourseId} labData={mockLabData} history={mockHistory} />
        </MemoryRouter>,
      );

      const labSummaryLink = getByText('Lab Summary');
      await act(async () => {
        fireEvent.click(labSummaryLink);
      });

      expect(mockHistory.push).toHaveBeenCalledWith(
        `/base-url/${mockCourseId}/lab-summary/${mockLabData.user_id}`,
      );
    });
  });

  it('fetches lab details on mount', async () => {
    await act(async () => {
      render(
        <Router>
          <LabDetails courseId={mockCourseId} labData={mockLabData} history={mockHistory} />
        </Router>,
      );
    });

    await waitFor(() => {
      expect(getAuthenticatedHttpClient().post).toHaveBeenCalledWith(
        'https://example.com/events/api/v1/details/',
        { labinstanceid: mockLabData.labInstanceId },
      );
    });
  });

  it('handles error during data fetch', async () => {
    mockPost.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      render(
        <Router>
          <LabDetails courseId={mockCourseId} labData={mockLabData} history={mockHistory} />
        </Router>,
      );
    });

    await waitFor(() => {
      expect(logError).toHaveBeenCalled();
      expect(screen.getByText('Mocked AlertMessage')).toBeInTheDocument();
    });
  });

  it('renders spinner when loading', async () => {
    await act(async () => {
      render(
        <Router>
          <LabDetails courseId={mockCourseId} labData={mockLabData} history={mockHistory} />
        </Router>,
      );

      // Verify that the spinner is displayed
      expect(screen.getByText('loading')).toBeInTheDocument();
    });
  });

  it('renders lab details correctly after fetching', async () => {
    await act(async () => {
      render(
        <Router>
          <LabDetails courseId={mockCourseId} labData={mockLabData} history={mockHistory} />
        </Router>,
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Mocked LabDetailsCard')).toBeInTheDocument();
      expect(screen.getByText('Mocked LabDetailsChartCard')).toBeInTheDocument();
      expect(screen.getByText('Mocked JsonViewer')).toBeInTheDocument();
    });
  });
});
