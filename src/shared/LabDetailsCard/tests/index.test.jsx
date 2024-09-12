import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LabDetailsCard from '../index';

describe('LabDetailsCard Component', () => {
  it('renders with default props', () => {
    render(<LabDetailsCard />);

    expect(screen.getByText('LAB PROFILE NAME')).toBeInTheDocument();
    expect(screen.getByText('USER FIRST NAME')).toBeInTheDocument();
    expect(screen.getByText('USER LAST NAME')).toBeInTheDocument();
    expect(screen.getByText('START TIME')).toBeInTheDocument();
    expect(screen.getByText('END TIME')).toBeInTheDocument();
    expect(screen.getByText('STATE')).toBeInTheDocument();
    expect(screen.getByText('COMPLETION STATUS')).toBeInTheDocument();
    expect(screen.getByText('TOTAL RUN TIME')).toBeInTheDocument();
    expect(screen.getByText('EXAM PASSED')).toBeInTheDocument();

    expect(screen.getAllByText('N/A')).toHaveLength(8);
  });

  it('renders with provided props', () => {
    const details = {
      labProfileName: 'Sample Lab',
      userFirstName: 'John',
      userLastName: 'Doe',
      startTime: '01/01/2023 10:00 AM',
      endTime: '01/01/2023 12:00 PM',
      state: 'Completed',
      completionStatus: 'Success',
      totalRunTime: '2 hours',
      examPassed: 'Yes',
    };

    render(<LabDetailsCard details={details} />);

    expect(screen.getByText('Sample Lab')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('01/01/2023 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('01/01/2023 12:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('2 hours')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('renders correctly when some props are missing', () => {
    const details = {
      labProfileName: 'Partial Lab',
      userFirstName: 'Jane',
    };

    render(<LabDetailsCard details={details} />);

    expect(screen.getByText('Partial Lab')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();

    const emptySpans = document.querySelectorAll('.lab-details-item span:empty');
    expect(emptySpans.length).toBe(7);
  });
});
