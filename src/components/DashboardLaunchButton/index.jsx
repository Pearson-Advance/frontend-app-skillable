import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { Button } from 'react-paragon-topaz';

import AlertMessage from '../AlertMessage';
import { SKILLABLE_URL, defaultErrorMessage } from '../../constants';
import { eventManager } from '../../helpers';
import './index.scss';

const COURSE_TAB_URL = `${SKILLABLE_URL}/course-tab/api/v1`;

const DashboardLaunchButton = ({ courseId, title }) => {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  /**
  * Handles button click event to open a URL
  */
  const buttonLaunch = async () => {
    setErrorMessage(null);
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
        message: defaultErrorMessage,
      });
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

  return (
    <div className="dashboard-launch-container">
      <div className="main-header">
        <h2>{title}</h2>
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
  );
};

DashboardLaunchButton.propTypes = {
  courseId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default DashboardLaunchButton;
