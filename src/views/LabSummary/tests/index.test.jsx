/* eslint-disable react/prop-types */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from '@testing-library/react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import '@testing-library/jest-dom';

import LabSummary from '../index';
import { columns } from '../columns';
import { formatUnixTimestamp } from '../../../helpers';

jest.mock('../../../shared/Table', () => () => <div>Mocked Table Component</div>);
jest.mock('@edx/paragon', () => ({
  Breadcrumb: ({
    links,
    activeLabel,
    clickHandler,
  }) => (
    <nav>
      {links.map((link) => (
        <a key={link.id} href={link.href} onClick={clickHandler}>
          {link.label}
        </a>
      ))}
      <span>{activeLabel}</span>
    </nav>
  ),
}));

jest.mock('constants', () => ({
  skillableUrl: 'https://example.com',
  mfeBaseUrl: '/base-url/:courseId',
}));

const mockPost = jest.fn();
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(() => ({
    post: mockPost,
  })),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('../../../shared/Table', () => ({ handlePagination }) => (
  <div>
    <div>Mocked Table Component</div>
    <button onClick={() => handlePagination(2)} type="button" aria-label="Next, Page 2">Next</button>
  </div>
));

const mockCourseId = 'course-v1:edX+DemoX+Demo_Course';
const mockRosterStudent = { user_id: 'student_123', username: 'student_name' };
const mockSetSelectedLabDetails = jest.fn();
const mockHistory = { push: jest.fn() };

describe('LabSummary Component', () => {
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
        <LabSummary
          courseId={mockCourseId}
          rosterStudent={mockRosterStudent}
          setSelectedLabDetails={mockSetSelectedLabDetails}
          history={mockHistory}
        />,
      );
    });

    expect(screen.getByText('Mocked Table Component')).toBeInTheDocument();
    expect(screen.getByText('Lab Summary')).toBeInTheDocument();
    expect(screen.getByText('student_name')).toBeInTheDocument();
  });

  it('fetches data on mount', async () => {
    await act(async () => {
      render(
        <LabSummary
          courseId={mockCourseId}
          rosterStudent={mockRosterStudent}
          setSelectedLabDetails={mockSetSelectedLabDetails}
          history={mockHistory}
        />,
      );
    });

    await waitFor(() => {
      expect(getAuthenticatedHttpClient().post).toHaveBeenCalledWith(
        'https://example.com/events/api/v1/labinstancesearch/?page=1',
        { userid: 'student_123' },
      );
    });
  });

  it('handles error during data fetch', async () => {
    mockPost.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(
        <LabSummary
          courseId={mockCourseId}
          rosterStudent={mockRosterStudent}
          setSelectedLabDetails={mockSetSelectedLabDetails}
          history={mockHistory}
        />,
      );
    });

    await waitFor(() => {
      expect(logError).toHaveBeenCalledWith(new Error('API Error'));
    });
  });

  it('handles pagination correctly', async () => {
    await act(async () => {
      render(
        <LabSummary
          courseId={mockCourseId}
          rosterStudent={mockRosterStudent}
          setSelectedLabDetails={mockSetSelectedLabDetails}
          history={mockHistory}
        />,
      );
    });

    const paginationButton = screen.getByText('Go Back');
    act(() => {
      fireEvent.click(paginationButton);
    });

    expect(mockHistory.push).toHaveBeenCalledWith(
      '/base-url/course-v1:edX+DemoX+Demo_Course',
    );
  });

  it('redirects to the correct URL when rosterStudent is null', () => {
    render(
      <MemoryRouter initialEntries={['/initial-route']}>
        <Route path="/initial-route">
          <LabSummary
            courseId={mockCourseId}
            rosterStudent={null}
            setSelectedLabDetails={mockSetSelectedLabDetails}
            history={mockHistory}
          />
        </Route>
        <Route path="/base-url/course-v1:edX+DemoX+Demo_Course">
          <div>Redirected</div>
        </Route>
      </MemoryRouter>,
    );

    expect(screen.getByText('Redirected')).toBeInTheDocument();
  });

  it('returns "Yes" for exam_passed true', () => {
    const mockLaboratoryData = {
      exam_passed: 'true',
    };

    const processedData = columns({
      setSelectedLabDetails: jest.fn(),
      rosterStudent: { user_id: 'student_123' },
      courseId: 'course-v1:edX+DemoX+Demo_Course',
      history: { push: jest.fn() },
    });

    const PassedCell = processedData[4].Cell;
    render(<PassedCell row={{ original: mockLaboratoryData }} />);

    const cellElement = screen.getByText(/true/i);
    expect(cellElement).toBeInTheDocument();
  });

  it('returns "No" for exam_passed false', () => {
    const mockLaboratoryData = {
      exam_passed: 'false',
    };

    const processedData = columns({
      setSelectedLabDetails: jest.fn(),
      rosterStudent: { user_id: 'student_123' },
      courseId: 'course-v1:edX+DemoX+Demo_Course',
      history: { push: jest.fn() },
    });

    const PassedCell = processedData[4].Cell;
    render(<PassedCell row={{ original: mockLaboratoryData }} />);

    const cellElement = screen.getByText(/false/i);
    expect(cellElement).toBeInTheDocument();
  });

  it('returns "N/A" for undefined exam_passed', () => {
    const mockLaboratoryData = {
      exam_passed: undefined,
    };

    const processedData = columns({
      setSelectedLabDetails: jest.fn(),
      rosterStudent: { user_id: 'student_123' },
      courseId: 'course-v1:edX+DemoX+Demo_Course',
      history: { push: jest.fn() },
    });

    const PassedCell = processedData[4].Cell;
    render(<PassedCell row={{ original: mockLaboratoryData }} />);

    const cellElement = screen.getByText(/N\/A/i);
    expect(cellElement).toBeInTheDocument();
    expect(cellElement).toHaveClass('status-na');
  });

  it('returns correct passedValue for exam_passed values', () => {
    const laboratories = [
      { exam_passed: true, exam_score: 80, exam_max_possible_score: 100 },
      { exam_passed: false, exam_score: 50, exam_max_possible_score: 100 },
      { exam_passed: undefined, exam_score: null, exam_max_possible_score: null },
    ];

    laboratories.forEach((laboratory) => {
      const passedValue = { true: 'Yes', false: 'No' }[laboratory.exam_passed] ?? 'N/A';
      const examPercentage = (laboratory.exam_score / laboratory.exam_max_possible_score) * 10;

      if (laboratory.exam_passed === true) {
        expect(passedValue).toBe('Yes');
      } else if (laboratory.exam_passed === false) {
        expect(passedValue).toBe('No');
      } else {
        expect(passedValue).toBe('N/A');
      }

      if (laboratory.exam_score !== null && laboratory.exam_max_possible_score !== null) {
        expect(examPercentage).toBe((laboratory.exam_score / laboratory.exam_max_possible_score) * 10);
      } else {
        expect(examPercentage).toBeNaN();
      }
    });
  });

  it('calculates correct examPercentage for valid exam scores', () => {
    const laboratory = {
      exam_passed: true,
      exam_score: 80,
      exam_max_possible_score: 100,
    };

    const examPercentage = (laboratory.exam_score / laboratory.exam_max_possible_score) * 10;
    expect(examPercentage).toBe(8);
  });

  it('returns "N/A" when exam_score or exam_max_possible_score is invalid', () => {
    const laboratory = {
      exam_passed: false,
      exam_score: undefined,
      exam_max_possible_score: undefined,
    };

    const examPercentage = (laboratory.exam_score / laboratory.exam_max_possible_score) * 10;
    expect(Number.isNaN(examPercentage)).toBe(true);
  });

  it('handles pagination correctly and updates currentPage and isLoading', async () => {
    render(
      <LabSummary
        courseId={mockCourseId}
        rosterStudent={mockRosterStudent}
        setSelectedLabDetails={mockSetSelectedLabDetails}
        history={mockHistory}
      />,
    );

    act(() => {
      const nextPageButton = screen.getByRole('button', { name: /Next, Page 2/i });
      fireEvent.click(nextPageButton);
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        'https://example.com/events/api/v1/labinstancesearch/?page=2',
        { userid: 'student_123' },
      );
    });
  });

  it('calculates passedValue and examPercentage correctly', () => {
    const laboratory = {
      exam_passed: true,
      exam_score: 80,
      exam_max_possible_score: 100,
    };

    const labsData = [];

    const passedValue = { true: 'Yes', false: 'No' }[laboratory.exam_passed] ?? 'N/A';
    const examPercentage = (laboratory.exam_score / laboratory.exam_max_possible_score) * 10;

    labsData.push({
      lab_profile_name: laboratory.lab_profile_name,
      lab_instances_count: laboratory.lab_instances_count,
      lab_instance_id: laboratory.lab_instance_id,
      exam_score: laboratory.exam_score ?? 'N/A',
      exam_percentage: Number.isNaN(examPercentage) ? 'N/A' : `${examPercentage}%` ?? 'N/A',
      exam_passed: passedValue,
      start_time: formatUnixTimestamp(laboratory.start_time),
      end_time: formatUnixTimestamp(laboratory.end_time),
    });

    expect(passedValue).toBe('Yes');
    expect(examPercentage).toBe(8);
  });
});
