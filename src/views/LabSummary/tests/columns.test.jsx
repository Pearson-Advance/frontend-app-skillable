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

describe('Columns Component for LabSummary', () => {
  const mockSetSelectedLabDetails = jest.fn();
  const mockHistory = { push: jest.fn() };
  const rosterStudent = { user_id: 'mockUserId' };
  const courseId = 'mockCourseId';

  const columnDefinitions = columns({
    setSelectedLabDetails: mockSetSelectedLabDetails,
    rosterStudent,
    courseId,
    history: mockHistory,
  });

  it('renders columns correctly', () => {
    expect(columnDefinitions[0].Header).toBe('Lab Name');
    expect(columnDefinitions[1].Header).toStrictEqual(
      <>
        Number of <br /> Launches
      </>,
    );
    expect(columnDefinitions[2].Header).toBe('Score');
    expect(columnDefinitions[3].Header).toBe('Percentage');
    expect(columnDefinitions[4].Header).toBe('Passed');
  });

  it('renders a hyperlink and calls handleLabClick on click', () => {
    const mockRow = {
      original: {
        lab_instance_id: 'mockLabId',
        lab_profile_name: 'Mock Lab Name',
      },
    };

    const CellComponent = columnDefinitions[0].Cell;
    render(<CellComponent row={mockRow} />);

    const hyperlink = screen.getByText('Mock Lab Name');
    expect(hyperlink).toBeInTheDocument();
    fireEvent.click(hyperlink);

    expect(mockSetSelectedLabDetails).toHaveBeenCalledWith({
      labInstanceId: 'mockLabId',
      labProfileName: 'Mock Lab Name',
      user_id: rosterStudent.user_id,
    });
    expect(mockHistory.push).toHaveBeenCalledWith(
      `/base-url/${courseId}/lab-details/mockLabId`,
    );
  });

  it('renders Passed cell with correct class', () => {
    const passedRow = { original: { exam_passed: 'yes' } };
    const PassedCellComponent = columnDefinitions[4].Cell;
    render(<PassedCellComponent row={passedRow} />);

    const passedElement = screen.getByText('yes');
    expect(passedElement).toBeInTheDocument();
    expect(passedElement).toHaveClass('status-yes');

    const failedRow = { original: { exam_passed: 'no' } };
    render(<PassedCellComponent row={failedRow} />);

    const failedElement = screen.getByText('no');
    expect(failedElement).toBeInTheDocument();
    expect(failedElement).toHaveClass('status-no');
  });

  it('renders lab_instances_count with default value 1 when value is empty', () => {
    const columnDefinition = columns({
      setSelectedLabDetails: jest.fn(),
      rosterStudent: {},
      courseId: 'course-v1:edX+DemoX+Demo_Course',
      history: { push: jest.fn() },
    });

    const LabInstancesCountCell = columnDefinition[1].Cell;

    render(<LabInstancesCountCell value={undefined} />);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders Passed cell with "n/a" class when exam_passed is not "yes" or "no"', () => {
    const columnDefinitio = columns({
      setSelectedLabDetails: jest.fn(),
      rosterStudent: {},
      courseId: 'course-v1:edX+DemoX+Demo_Course',
      history: { push: jest.fn() },
    });
    const PassedCell = columnDefinitio[4].Cell;
    const mockRow = {
      original: {
        exam_passed: '', // anything different from 'yes' or 'no'
      },
    };
    render(<PassedCell row={mockRow} />);

    const cellElement = document.querySelector('.status-na');
    expect(cellElement).toBeInTheDocument();
  });
});
