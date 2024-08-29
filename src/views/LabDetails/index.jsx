import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { Breadcrumb, Spinner } from '@edx/paragon';

import AlertMessage from 'shared/AlertMessage';
import LabDetailsCard from 'shared/LabDetailsCard';
import LabDetailsChartCard from 'shared/LabDetailsChartCard';
import JsonViewer from 'shared/JsonViewer';
import { formatTime } from 'helpers';
import { skillableUrl, mfeBaseUrl } from 'constants';

import './index.scss';

const LabDetails = ({ courseId, labData, history }) => {
  const [labDetails, setLabDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!labData) {
    return <Redirect to={`${mfeBaseUrl.replace(':courseId', courseId)}`} />;
  }

  /**
   * Handles click events on the breadcrumb links.
   * Navigates back to the Class Roster or Lab Summary based on the clicked link's ID.
   *
   * @param {object} event - The click event object
   */
  const handleBreadcrumbClick = (event) => {
    if (event.target.id === 'goBackToClassRoster') {
      history.push(`${mfeBaseUrl.replace(':courseId', courseId)}`);
    } else if (event.target.id === 'goBackToLabSummary') {
      history.push(`${mfeBaseUrl.replace(':courseId', courseId)}/lab-summary/${labData.user_id}`);
    }
  };

  useEffect(() => {
    /**
     * Fetches lab details for the given lab instance ID.
     * Makes a POST request to the details API endpoint and updates the state with the response data.
     * Logs any errors encountered during the request.
     */
    const fetchLabDetails = async () => {
      try {
        const response = await getAuthenticatedHttpClient().post(`${skillableUrl}/events/api/v1/details/`, {
          labinstanceid: labData.labInstanceId,
        });
        if (response.data) {
          setLabDetails(response.data);
        } else {
          setErrorMessage(`No details found for this lab ${labData.labProfileName}`);
        }
      } catch (error) {
        logError(error);
        setErrorMessage('An error occurred while fetching lab details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabDetails();
  }, [labData.labInstanceId]);

  return (
    <div>
      <div className="breadcrumb-container">
        <Breadcrumb
          links={[
            { label: 'Class Roster', href: '#', id: 'goBackToClassRoster' },
            { label: 'Lab Summary', href: '#', id: 'goBackToLabSummary' },
          ]}
          activeLabel="Lab Details"
          spacer={<span className="custom-spacer">/</span>}
          clickHandler={handleBreadcrumbClick}
        />
      </div>
      <div className="title-container"><h2>{labData.labProfileName} Summary</h2></div>
      { isLoading && (
        <div className="spinner-container">
          <Spinner animation="border" className="mie-3" screenReaderText="loading" />
        </div>
      )}
      {!isLoading && errorMessage && (
        <div className="error-container">
          <AlertMessage
            heading={errorMessage}
            message="Please retry and/or contact our support team for assistance in
                resolving this issue."
          />
        </div>
      )}
      {!isLoading && labDetails && (
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-7">
            <LabDetailsCard
              details={{
                labProfileName: labDetails.LabProfileName,
                userFirstName: labDetails.UserFirstName,
                userLastName: labDetails.UserLastName,
                startTime: formatTime(labDetails.StartTime),
                endTime: formatTime(labDetails.EndTime),
                state: labDetails.State,
                completionStatus: labDetails.CompletionStatus,
                totalRunTime: labDetails.TotalRunTime,
                examPassed: labDetails.exam_passed ? 'Yes' : 'No',
              }}
            />
          </div>
          <div className="col-12 col-md-5">
            <LabDetailsChartCard
              details={{
                NumTasks: labDetails.NumTasks,
                NumCompletedTasks: labDetails.NumCompletedTasks,
                ExamMaxPossibleScore: labDetails.ExamMaxPossibleScore,
                ExamScore: labDetails.ExamScore,
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12">
            <JsonViewer labName={labData.labProfileName} labData={labDetails} />
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

LabDetails.propTypes = {
  courseId: PropTypes.string.isRequired,
  labData: PropTypes.shape({
    labInstanceId: PropTypes.number.isRequired,
    labProfileName: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default LabDetails;
