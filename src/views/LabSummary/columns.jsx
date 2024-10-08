import React from 'react';
import { Hyperlink } from '@edx/paragon';

import { mfeBaseUrl } from 'constants';

const columns = ({
  setSelectedLabDetails,
  rosterStudent,
  courseId,
  history,
}) => {
  /**
   * Displays the expected component when there is a click on the cell where this method is called
   *
   * @param {object} row - the given row from fetched data where the content would be accessed
   */
  const handleLabClick = (row) => {
    const labDetails = {
      labInstanceId: row.original.lab_instance_id,
      labProfileName: row.original.lab_profile_name,
      user_id: rosterStudent.user_id,
    };
    setSelectedLabDetails(labDetails);
    history.push(`${mfeBaseUrl.replace(':courseId', courseId)}/lab-details/${labDetails.labInstanceId}`);
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
      Header: (
        <>
          Number of <br /> Launches
        </>
      ),
      accessor: 'lab_instances_count',
      Cell: ({ value }) => value || 1,
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
        const examPassedLowerCase = examPassed ? examPassed.toLowerCase() : 'n/a';
        return <span className={classStyles[examPassedLowerCase]}>{examPassed ?? 'N/A'}</span>;
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
