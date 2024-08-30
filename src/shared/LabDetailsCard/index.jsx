import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@edx/paragon';

import './index.scss';

const LabDetailsCard = ({ details }) => {
  const {
    labProfileName,
    userFirstName,
    userLastName,
    startTime,
    endTime,
    state,
    completionStatus,
    totalRunTime,
    examPassed,
  } = details;

  return (
    <div className="lab-details-card">
      <Card className="mb-2">
        <Card.Body>
          <div className="lab-details">
            <div className="lab-details-row">
              <div className="lab-details-item">
                <strong>LAB PROFILE NAME</strong>
                <span>{labProfileName}</span>
              </div>
              <div className="lab-details-item">
                <strong>USER FIRST NAME</strong>
                <span>{userFirstName}</span>
              </div>
              <div className="lab-details-item">
                <strong>USER LAST NAME</strong>
                <span>{userLastName}</span>
              </div>
            </div>
            <div className="lab-details-row">
              <div className="lab-details-item">
                <strong>START TIME</strong>
                <span>{startTime}</span>
              </div>
              <div className="lab-details-item">
                <strong>END TIME</strong>
                <span>{endTime}</span>
              </div>
              <div className="lab-details-item">
                <strong>STATE</strong>
                <span>{state}</span>
              </div>
            </div>
            <div className="lab-details-row">
              <div className="lab-details-item">
                <strong>COMPLETION STATUS</strong>
                <span>{completionStatus}</span>
              </div>
              <div className="lab-details-item">
                <strong>TOTAL RUN TIME</strong>
                <span>{totalRunTime}</span>
              </div>
              <div className="lab-details-item">
                <strong>EXAM PASSED</strong>
                <span>{examPassed}</span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

LabDetailsCard.defaultProps = {
  details: {
    labProfileName: 'N/A',
    userFirstName: 'N/A',
    userLastName: 'N/A',
    startTime: 'N/A',
    endTime: 'N/A',
    state: 'N/A',
    completionStatus: 'N/A',
    totalRunTime: 'N/A',
    examPassed: 'No',
  },
};

LabDetailsCard.propTypes = {
  details: PropTypes.shape({
    labProfileName: PropTypes.string,
    userFirstName: PropTypes.string,
    userLastName: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    state: PropTypes.string,
    completionStatus: PropTypes.string,
    totalRunTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    examPassed: PropTypes.string,
  }),
};

export default LabDetailsCard;
