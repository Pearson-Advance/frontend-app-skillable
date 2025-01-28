import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';

import DashboardLaunchButton from 'shared/DashboardLaunchButton';
import TableFilter from 'shared/TableFilter';
import Table from 'shared/Table';
import { defaultErrorMessage } from 'constants';
import { columns } from './columns';

import './index.scss';

const ENROLLMENTS_URL = `${process.env.LMS_BASE_URL}/pearson-core/api/v1/course-enrollments`;
const TRAINING_LAB_URL = `${process.env.LMS_BASE_URL}/skillable_plugin/course-tab/api/v1/get-enabled-training-lab/`;

const ClassRoster = ({ courseId, setRosterStudent, history }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filterErrorMessage, setFilterErrorMessage] = useState(null);
  const [labType, setLabType] = useState(null);

  /**
   * Fetches the training lab configuration to decide the destination.
   */
  const fetchTrainingLabConfig = async () => {
    try {
      const response = await getAuthenticatedHttpClient().post(TRAINING_LAB_URL, {
        class_id: courseId,
      });

      if (response.status === 200) {
        const { enabled_training_lab: enabledTrainingLab } = response.data;

        if (enabledTrainingLab === 'skillable' || enabledTrainingLab === 'xtreme_labs') {
          setLabType(enabledTrainingLab);
        } else {
          console.error('Unexpected response:', response.data);
          setLabType(null);
        }
      }
    } catch (error) {
      if (error.response?.status === 400) {
        console.error('Error: There must be exactly one enabled plugin.');
        setLabType(null);
      } else {
        logError(error);
        console.error('Error fetching training lab configuration:', error.message || error);
      }
    }
  };

  /**
  * Consumes course-enrollments API from pearson-core plugin of Devstack
  *
  * @param {obj} filter - string extra field to populate the datatable with filtered data.
  */
  const fetchUsersData = async (filter = {}) => {
    setIsLoading(true);
    try {
      const response = await getAuthenticatedHttpClient().post(`${ENROLLMENTS_URL}?page=${currentPage}`, {
        course_id: courseId,
        ...filter,
      });
      const result = await response.data;
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
    fetchTrainingLabConfig();
  }, [currentPage]);

  return (
    <div>
      {labType !== 'xtreme_labs' && (
        <DashboardLaunchButton courseId={courseId} title="Class Roster" />
      )}
      <div className="filterWrapper">
        <TableFilter onFilterSubmit={handleFilterSubmit} error={filterErrorMessage} />
      </div>
      <Table
        isLoading={isLoading}
        data={users}
        columns={columns(courseId, setRosterStudent, labType, history)}
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
