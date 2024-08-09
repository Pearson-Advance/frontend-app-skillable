import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import DashboardLaunchButton from '../DashboardLaunchButton';
import TableFilter from '../TableFilter';

import './index.scss';
import Table from '../Table';
import { columns } from './columns';
import { eventManager } from '../../helpers';

const ENROLLMENTS_URL = `${process.env.LMS_BASE_URL}/pearson-core/api/v1/course-enrollments`;

const ClassRoster = ({ componentNavigationHandler }) => {
  const [filterErrorMessage, setFilterErrorMessage] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [filterValue, setFilterValue] = useState('');
  const [selectedParam, setSelectedParam] = useState('username');
  const [isLoading, setIsLoading] = useState(true);

  const handlePagination = (targetPage) => setCurrentPage(targetPage);
  const courseId = window.location.pathname.split('/').filter(Boolean)[1];

  /**
  * Consumes course-enrollments API from pearson-core plugin of Devstack
  *
  * @param {string} apiUrl - URL of the course-enrollment API either base URL or one given por su pagination service
  * @param {number} pageNumber - Consecutive page indentification of the results to be retrieved.
  * @param {obj} filter - string extra field to populate the datatable with filtered data.
  */
  const fetchUsersData = async (apiUrl, pageNumber, filter = {}) => {
    setIsLoading(true);
    try {
      setFilterErrorMessage(null); // Clear any previous error messages at the start
      const requestData = { course_id: courseId, ...filter };
      const response = await getAuthenticatedHttpClient().post(`${apiUrl}?page=${pageNumber}`, requestData);
      const result = await response.data;
      setUsers(result.results);
      if (!result.prev) {
        setPageCount(result.next ? Math.ceil(result.count / result.results.length) : 1);
      }
    } catch (error) {
      logError(error);
      setUsers([]); // Clear the data on error
      const defaultErrorMessage = 'An unexpected error occurred. Please try again later.';
      const errorData = error.response?.data;
      const filterErrorString = typeof errorData === 'string' ? errorData
        : errorData?.email?.[0] || errorData?.username?.[0] || defaultErrorMessage;
      setFilterErrorMessage(filterErrorString);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => setFilterValue(e.target.value);
  const handleParamChange = (e) => setSelectedParam(e.target.value);

  /**
   * Handles the submission of the filter form.
   *
   * This function is called when the filter form is submitted. It prevents
   * the default form submission behavior, constructs a filter object based on
   * the selected parameter and filter value, and calls `fetchUsersData` to
   * fetch and update the data table with the filtered results.
   *
   * @param {Event} e - The event object representing the form submission.
   */
  const handlerFilterSubmit = async (e) => {
    e.preventDefault();
    const filter = { [selectedParam]: filterValue };
    await fetchUsersData(ENROLLMENTS_URL, currentPage, filter);
  };

  /**
   * Handles the reset action of the filter form.
   *
   * This function is called cuando the reset button is clicked. It clears the filter
   * value and error message, and calls `fetchUsersData` to fetch and update the
   * data table with the default (unfiltered) results.
   */
  const handlerFilterReset = async () => {
    setFilterValue('');
    setFilterErrorMessage(null);
    await fetchUsersData(ENROLLMENTS_URL, currentPage);
  };

  const handleFilterSubmit = eventManager(handlerFilterSubmit);
  const handleFilterReset = eventManager(handlerFilterReset);

  useEffect(() => {
    fetchUsersData(ENROLLMENTS_URL, currentPage);
  }, [currentPage]);

  return (
    <div>
      <DashboardLaunchButton courseId={courseId} title="Class Roster" />
      <TableFilter
        filterValue={filterValue}
        selectedParam={selectedParam}
        filterErrorMessage={filterErrorMessage}
        handleFilterChange={handleFilterChange}
        handleParamChange={handleParamChange}
        handleFilterSubmit={handleFilterSubmit}
        handleFilterReset={handleFilterReset}
      />
      <Table
        isLoading={isLoading}
        data={users}
        columns={columns(componentNavigationHandler)}
        emptyMessage="No users found."
        pageCount={pageCount}
        currentPage={currentPage}
        handlePagination={handlePagination}
      />
    </div>
  );
};

ClassRoster.propTypes = {
  componentNavigationHandler: PropTypes.func,
};

export default ClassRoster;
