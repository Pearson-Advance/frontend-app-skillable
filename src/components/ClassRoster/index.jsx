import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import {
  Col,
  Form,
  Icon,
} from '@edx/paragon';
import { Button } from 'react-paragon-topaz';
import { Search } from '@edx/paragon/icons';
import AlertMessage from '../AlertMessage';

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
   * This function is called when the reset button is clicked. It clears the filter
   * value and error message, and calls `fetchUsersData` to fetch and update the
   * data table with the default (unfiltered) results.
   */
  const handlerFilterReset = async () => {
    setFilterValue('');
    setFilterErrorMessage(null);
    await fetchUsersData(ENROLLMENTS_URL, currentPage);
  };

  const openSkillableDashboard = eventManager(buttonLaunch);
  const handleFilterSubmit = eventManager(handlerFilterSubmit);
  const handleFilterReset = eventManager(handlerFilterReset);

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
            <AlertMessage
              heading="An error occurred while launching the instructor dashboard. Please find details below:"
            >
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
                Please retry and/or contact our support team for assistance in resolving this issue.
              </p>
            </AlertMessage>
          </div>
        )}
      </div>
      <div className="filterWrapper">
        <Form onSubmit={handleFilterSubmit}>
          <Form.Group as={Col} controlId="formGridParam">
            <Form.RadioSet name="selectedParam" onChange={handleParamChange} value={selectedParam}>
              <div className="radio-buttons">
                <Form.Radio value="username" className="form-radio">username</Form.Radio>
                <Form.Radio value="email" className="form-radio">email</Form.Radio>
              </div>
            </Form.RadioSet>
          </Form.Group>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridFilter" isInvalid={!!filterErrorMessage}>
              <Form.Control
                value={filterValue}
                onChange={handleFilterChange}
                placeholder="Search student"
                floatingLabel="Search student"
                className="form-custom-height"
                leadingElement={<Icon src={Search} className="mt-2 icon" />}
              />
              {filterErrorMessage && (
                <Form.Control.Feedback type="invalid">
                  {filterErrorMessage}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="formGridButtons">
              <div className="filter-buttons">
                <Button variant="primary" type="submit" disabled={!filterValue}>
                  Apply
                </Button>
                <Button variant="" type="button" onClick={handleFilterReset}>
                  Reset
                </Button>
              </div>
            </Form.Group>
          </Form.Row>
        </Form>
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
