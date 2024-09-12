import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import DashboardLaunchButton from '../index';
import '@testing-library/jest-dom';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));
jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));
jest.mock('shared/AlertMessage', () => () => <div>Mocked AlertMessage</div>);

const mockPost = jest.fn();
const mockCourseId = 'course-v1:edX+DemoX+Demo_Course';

describe('DashboardLaunchButton Component', () => {
  beforeEach(() => {
    getAuthenticatedHttpClient.mockReturnValue({ post: mockPost });
    jest.clearAllMocks();
  });

  it('renders the component correctly with the given title', () => {
    render(<DashboardLaunchButton courseId={mockCourseId} title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('does not show the button initially if is_ccx_course is false', async () => {
    mockPost.mockResolvedValueOnce({ data: { is_ccx_course: false } });

    render(<DashboardLaunchButton courseId={mockCourseId} title="Test Title" />);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Go To Instructor Dashboard/i })).not.toBeInTheDocument();
    });
  });

  it('shows the button if is_ccx_course is true', async () => {
    mockPost.mockResolvedValueOnce({ data: { is_ccx_course: true } });

    render(<DashboardLaunchButton courseId={mockCourseId} title="Test Title" />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Go To Instructor Dashboard/i })).toBeInTheDocument();
    });
  });

  it('handles button click and opens the dashboard URL if present', async () => {
    mockPost.mockResolvedValueOnce({ data: { is_ccx_course: true } });
    mockPost.mockResolvedValueOnce({ data: { url: 'https://example.com/dashboard' } });

    render(<DashboardLaunchButton courseId={mockCourseId} title="Test Title" />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Go To Instructor Dashboard/i })).toBeInTheDocument();
    });

    window.open = jest.fn();

    fireEvent.click(screen.getByRole('button', { name: /Go To Instructor Dashboard/i }));

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith('https://example.com/dashboard', '_blank', 'noopener,noreferrer');
    });
  });

  it('handles error when button is clicked and no URL is present', async () => {
    mockPost.mockResolvedValueOnce({ data: { is_ccx_course: true } });
    mockPost.mockResolvedValueOnce({ data: { url: '', error: 'Error message' } });

    render(<DashboardLaunchButton courseId={mockCourseId} title="Test Title" />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Go To Instructor Dashboard/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Go To Instructor Dashboard/i }));

    await waitFor(() => {
      expect(screen.getByText('Mocked AlertMessage')).toBeInTheDocument();
    });
  });
});
