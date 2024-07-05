import React, { useState, useEffect } from 'react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { DataTable, Pagination } from '@edx/paragon';

import './index.scss';

const ENROLLMENTS_URL = `${process.env.LMS_BASE_URL}/pearson-core/api/v1/course-enrollments`;
const COLUMNS = [
  {
    Header: 'Username',
    accessor: 'user',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
];

const Main = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const courseId = window.location.pathname.split('/').filter(Boolean)[3];
  const handlePagination = (targetPage) => setCurrentPage(targetPage);

  /**
  * Consumes course-enrollments API from pearson-core plugin of Devstack
  *
  * @param {string} apiUrl - URL of the course-enrollment API either base URL or one given by its pagination service
  * @param {number} pageNumber - Consecutive page indentificator of the results to be retrieved.
  */
  const fetchUsersData = async (apiUrl, pageNumber) => {
    try {
      const response = await getAuthenticatedHttpClient().post(`${apiUrl}?page=${pageNumber}`, { course_id: courseId });
      const result = await response.data;
      setData(result.results);
      if (!result.prev) {
        setPageCount(result.next ? Math.ceil(result.count / result.results.length) : 1);
      }
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    fetchUsersData(ENROLLMENTS_URL, currentPage);
  }, [currentPage]);

  return (
    <div>
      <h2>Class Roster</h2>
      <div className="tableWrapper">
        <DataTable
          itemCount={data.length}
          isSortable
          data={data}
          columns={COLUMNS}
        >
          <DataTable.Table />
          <DataTable.EmptyTable content="No users found." />
        </DataTable>
        <Pagination
          paginationLabel="paginationNavigation"
          pageCount={pageCount}
          currentPage={currentPage}
          onPageSelect={handlePagination}
          variant="reduced"
          className="mx-auto pagination-table"
          size="small"
        />
      </div>
    </div>
  );
};

export default Main;
