import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

import DashboardLaunchButton from 'shared/DashboardLaunchButton';
import TableFilter from 'shared/TableFilter';
import Table from 'shared/Table';
import { defaultErrorMessage } from 'constants';
import { columns } from './columns';

import './index.scss';

const ENROLLMENTS_URL = `${process.env.LMS_BASE_URL}/pearson-core/api/v1/course-enrollments`;

const ClassRoster = ({ courseId, setRosterStudent, history }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filterErrorMessage, setFilterErrorMessage] = useState(null);

  /**
  * Consumes course-enrollments API from pearson-core plugin of Devstack
  *
  * @param {obj} filter - string extra field to populate the datatable with filtered data.
  */
  const fetchUsersData = async (filter = {}) => {
    setIsLoading(true);
    try {
      let response;

      if (courseId.startsWith('course-v1:')) { // Request from course
        response = await getAuthenticatedHttpClient().post(`${ENROLLMENTS_URL}?page=${currentPage}`, {
          course_id: courseId,
          ...filter,
        });
      } else if (courseId.startsWith('ccx-v1:')) { // Request from class
        const params = {
          class_id: courseId,
          page: currentPage,
          ...filter,
        };
        response = await getAuthenticatedHttpClient().get(
          `${getConfig().COURSE_OPERATIONS_API_V2_BASE_URL}/students/`,
          { params },
        );
      }

      const result = response.data;
      setUsers(result.results);
      if (!result.prev) {
        setPageCount(result.next ? Math.ceil(result.count / result.results.length) : 1);
      }
    } catch (error) {
      logError(error);
      setUsers([]); // Clear the data on error
      const errorData = error.response?.data;
      const filterErrorString = typeof errorData === 'string' ? errorData
        : errorData?.email?.[0] || errorData?.username?.[0] || defaultErrorMessage;
      setFilterErrorMessage(filterErrorString);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the submission of the filter form.
   *
   * This function is called when the filter form is submitted.
   * It clears any previous filter error messages and then triggers
   * the fetchUsersData function with the provided filter criteria.
   *
   * @param {Object} filter - An object containing the filter criteria,
   *                          where the key is the selected filter parameter
   *                          (e.g., 'username' or 'email') and the value is
   *                          the user's input.
   */
  const handleFilterSubmit = (filter) => {
    setFilterErrorMessage(null);
    fetchUsersData(filter);
  };

  useEffect(() => {
    fetchUsersData();
  }, [currentPage]);

  return (
    <div>
      <DashboardLaunchButton courseId={courseId} title="Class Roster" />
      <div className="filterWrapper">
        <TableFilter onFilterSubmit={handleFilterSubmit} error={filterErrorMessage} />
      </div>
      <Table
        isLoading={isLoading}
        data={users}
        columns={columns(courseId, setRosterStudent, history)}
        emptyMessage="No users found."
        pageCount={pageCount}
        currentPage={currentPage}
        handlePagination={setCurrentPage}
      />
    </div>
  );
};

ClassRoster.propTypes = {
  courseId: PropTypes.string.isRequired,
  setRosterStudent: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default ClassRoster;
