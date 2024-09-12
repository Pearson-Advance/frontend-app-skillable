import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LabDetailsChartCard from '../index';

describe('LabDetailsChartCard Component', () => {
  it('renders with default props', () => {
    render(<LabDetailsChartCard />);

    expect(screen.getByText('NUMBER OF TASKS')).toBeInTheDocument();
    expect(screen.getAllByText('COMPLETED TASKS')).toHaveLength(2);
    expect(screen.getByText('SCORE')).toBeInTheDocument();

    const numberOfTasks = screen.getByText('NUMBER OF TASKS').nextSibling;
    const completedTasksElements = screen.getAllByText('COMPLETED TASKS');
    const completedTasksFirstInstance = completedTasksElements[0].closest('.lab-details-item').querySelector('span');
    const defaultGauges = screen.getAllByRole('meter'); // Get all gauges

    expect(numberOfTasks).toHaveTextContent('0');
    expect(completedTasksFirstInstance).toHaveTextContent('0');
    expect(defaultGauges).toHaveLength(2); // Expecting 2 gauges
    expect(defaultGauges[0]).toHaveAttribute('aria-valuenow', '0');
  });

  it('renders with provided props', () => {
    const mockDetails = {
      NumTasks: 10,
      NumCompletedTasks: 7,
      ExamMaxPossibleScore: 100,
      ExamScore: 85,
    };

    render(<LabDetailsChartCard details={mockDetails} />);

    expect(screen.getByText('NUMBER OF TASKS')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getAllByText('COMPLETED TASKS')).toHaveLength(2);
    expect(screen.getByText('SCORE')).toBeInTheDocument();
  });

  it('renders the Gauge charts correctly', () => {
    const mockDetails = {
      NumTasks: 8,
      NumCompletedTasks: 5,
      ExamMaxPossibleScore: 50,
      ExamScore: 30,
    };

    render(<LabDetailsChartCard details={mockDetails} />);

    // Check for the presence of the Gauge charts by role
    const gauges = screen.getAllByRole('meter'); // 'meter' is the role for gauge elements
    expect(gauges).toHaveLength(2);
  });

  it('handles missing details correctly', () => {
    const partialDetails = {
      NumTasks: 5,
    };

    render(<LabDetailsChartCard details={partialDetails} />);

    expect(screen.getByText('5')).toBeInTheDocument();

    const completedTasksElements = screen.getAllByText('COMPLETED TASKS');
    const completedTasksItem = completedTasksElements[0].closest('.lab-details-item');
    const completedTasksSpan = completedTasksItem.querySelector('span');

    const defaultGauges = screen.getAllByRole('meter'); // Get all gauges

    expect(completedTasksItem).not.toBeNull();
    expect(completedTasksSpan).not.toBeNull();
    expect(completedTasksSpan).toHaveTextContent('');
    expect(defaultGauges).toHaveLength(2); // Expecting 2 gauges
    expect(defaultGauges[0].hasAttribute('aria-valuenow')).toBe(false);
  });
});
