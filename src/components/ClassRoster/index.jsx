import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { Alert, Button } from '@edx/paragon';

import './index.scss';
import Table from '../Table';
import { columns } from './columns';
import { eventManager } from '../../helpers';
import { SKILLABLE_URL } from '../../constants';

const ENROLLMENTS_URL = `${process.env.LMS_BASE_URL}/pearson-core/api/v1/course-enrollments`;
const COURSE_TAB_URL = `${SKILLABLE_URL}/course-tab/api/v1`;

const ClassRoster = ({ componentNavigationHandler }) => {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const handlePagination = (targetPage) => setCurrentPage(targetPage);
  const courseId = window.location.pathname.split('/').filter(Boolean)[3];

  /**
  * Handles button click event to open a URL
  */
  const buttonLaunch = async () => {
    try {
      const response = await getAuthenticatedHttpClient().post(`${COURSE_TAB_URL}/instructor-dashboard-launch/`, {
        class_id: courseId,
      });
      const { url, error: responseError } = response.data;

      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        setErrorMessage({
          courseKey: courseId,
          message: responseError,
        });
      }
    } catch (error) {
      logError('Error fetching URL:', error);
      setErrorMessage({
        courseKey: courseId,
        message: 'An unexpected error occurred. Please try again later.',
      });
    }
  };

  /**
  * Consumes course-enrollments API from pearson-core plugin of Devstack
  *
  * @param {string} apiUrl - URL of the course-enrollment API either base URL or one given by its pagination service
  * @param {number} pageNumber - Consecutive page indentification of the results to be retrieved.
  */
  const fetchUsersData = async (apiUrl, pageNumber) => {
    try {
      const response = await getAuthenticatedHttpClient().post(`${apiUrl}?page=${pageNumber}`, { course_id: courseId });
      const result = await response.data;
      setUsers(result.results);
      if (!result.prev) {
        setPageCount(result.next ? Math.ceil(result.count / result.results.length) : 1);
      }
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(!isLoading);
    }
  };

  const openSkillableDashboard = eventManager(buttonLaunch);

  /**
  * Consumes isccx API to check if the course is a CCX.
  */
  useEffect(() => {
    const checkCcxCourse = async () => {
      try {
        const response = await getAuthenticatedHttpClient().post(`${COURSE_TAB_URL}/is-ccx-course/`, {
          class_id: courseId,
        });
        setIsButtonVisible(response.data.is_ccx_course);
      } catch (error) {
        logError('Error fetching course status:', error);
      }
    };

    checkCcxCourse();
  }, [courseId]);

  useEffect(() => {
    fetchUsersData(ENROLLMENTS_URL, currentPage);
  }, [currentPage]);

  return (
    <div>
      <div>
        <div className="main-header">
          <h2>Class Roster</h2>
          {isButtonVisible && (
            <Button
              className="instructor-dashboard-button"
              variant="outline-primary"
              onClick={openSkillableDashboard}
            >
              <i className="fa-solid fa-arrow-up-right-from-square" />
              &nbsp; Go To Instructor Dashboard
            </Button>
          )}
        </div>
        {errorMessage && (
          <div className="error-container">
            <hr />
            <Alert variant="danger">
              <Alert.Heading>
                An error occurred while launching the instructor dashboard. Please
                find details below:
              </Alert.Heading>
              <ul>
                <li>
                  <b>Course key: </b>
                  {errorMessage.courseKey}
                </li>
                <li>
                  <b>Error message: </b>
                  {errorMessage.message}
                </li>
              </ul>
              <hr />
              <p className="mb-0">
                Please retry and/or contact our support team for assistance in
                resolving this issue.
              </p>
            </Alert>
            <hr />
          </div>
        )}
      </div>
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
