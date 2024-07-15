import React from 'react';
import { Hyperlink } from '@edx/paragon';

const columns = (componentNavigationHandler) => {
  /**
   * Displays the expected component when there is a click on the cell where this method is called
   *
   * @param {object} row - the given row from fetched data where the content would be accessed
   */
  const handleUsernameClick = (row) => {
    componentNavigationHandler(row.original.anonymous_user_id);
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
