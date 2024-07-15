import React from 'react';
import { Hyperlink } from '@edx/paragon';

const columns = () => {
  /**
   * Displays the expected component when there is a click on the cell where this method is called
   *
   * @param {object} row - the given row from fetched data where the content would be accessed
   */
  const handleLabClick = (row) => {
    // TODO: update with expected behavior
    console.log(row.original.lab_instance_id); // eslint-disable-line no-console
  };

  return [
    {
      Header: 'Lab Name',
      accessor: 'lab_profile_name',
      /* eslint-disable react/prop-types */
      Cell: ({ row }) => (
        <Hyperlink
          destination="#"
          onClick={() => handleLabClick(row)}
        >
          {row.original.lab_profile_name}
        </Hyperlink>
      ),
    },
    {
      Header: 'Score',
      accessor: 'exam_score',
    },
    {
      Header: 'Percentage',
      accessor: 'exam_percentage',
    },
    {
      Header: 'Passed',
      accessor: 'exam_passed',
      /* eslint-disable react/prop-types */
      Cell: ({ row }) => {
        const classStyles = {
          yes: 'status-yes',
          no: 'status-no',
          'n/a': 'status-na',
        };
        const examPassed = row.original.exam_passed;

        return <span className={classStyles[examPassed.toLowerCase() || 'n/a']}>{examPassed}</span>;
      },
    },
    {
      Header: 'Start Time',
      accessor: 'start_time',
    },
    {
      Header: 'End Time',
      accessor: 'end_time',
    },
  ];
};

export { columns };
