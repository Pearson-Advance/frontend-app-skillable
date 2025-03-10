import React from 'react';
import { Hyperlink } from '@edx/paragon';

import { mfeBaseUrl } from 'constants';

const columns = (courseId, setRosterStudent, history) => {
  /**
   * Displays the expected component when there is a click on the cell where this method is called
   *
   * @param {object} row - the given row from fetched data where the content would be accessed
   */
  const handleUsernameClick = (row) => {
    const student = { user_id: row.original.learner_anonymous_id, username: row.original.learner_name, courseId };
    setRosterStudent(student);
    history.push(`${mfeBaseUrl.replace(':courseId', courseId)}/lab-summary/${student.user_id}`);
  };

  return [
    {
      Header: 'Username',
      accessor: 'learner_name',
      /* eslint-disable react/prop-types */
      Cell: ({ row }) => (
        <Hyperlink
          destination="#"
          onClick={() => handleUsernameClick(row)}
        >
          {row.original.learner_name}
        </Hyperlink>
      ),
    },
    {
      Header: 'Email',
      accessor: 'learner_email',
    },
  ];
};

export { columns };
