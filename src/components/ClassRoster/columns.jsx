import React from 'react';
import { Hyperlink } from '@edx/paragon';
import { mfeBaseUrl } from '../../constants';

const columns = (courseId, setRosterStudent, history) => {
  /**
   * Displays the expected component when there is a click on the cell where this method is called
   *
   * @param {object} row - the given row from fetched data where the content would be accessed
   */
  const handleUsernameClick = (row) => {
    const student = { user_id: row.original.anonymous_user_id, username: row.original.user, courseId };
    setRosterStudent(student);
    history.push(`${mfeBaseUrl.replace(':courseId', courseId)}/lab-summary/${student.user_id}`);
  };

  return [
    {
      Header: 'Username',
      accessor: 'user',
      /* eslint-disable react/prop-types */
      Cell: ({ row }) => (
        <Hyperlink
          destination="#"
          onClick={() => handleUsernameClick(row)}
        >
          {row.original.user}
        </Hyperlink>
      ),
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
  ];
};

export { columns };
