import React from 'react';
import PropTypes from 'prop-types';

// Temporary module to have the prepared view
const StudentUsageReport = ({ studentId, courseId }) => {
  console.log('Received studentId:', studentId); // DEBUG
  console.log('Received courseId:', courseId); // DEBUG
  return (
    <div>
      <h1>Student Usage Report</h1>
      <p>
        The student ID is: <strong>{studentId}</strong>
      </p>
      <p>
        The course ID is: <strong>{courseId}</strong>
      </p>
    </div>
  );
};

StudentUsageReport.propTypes = {
  studentId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default StudentUsageReport;
