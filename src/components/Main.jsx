import React, { useState } from 'react';

import ClassRoster from './ClassRoster';
import LabSummary from './LabSummary';

import './Main.scss';

const Main = () => {
  const [showLabSummary, setLabSummary] = useState(false);
  const [rosterStudent, setRosterStudent] = useState(null);

  /**
   * Switch between components to be rendered,
   * When an anonymous User Id is passed, means that its Lab Summary is going to be fetched and shown
   *
   * @param {object} studentReceived - Object with the select student data
   */
  const switchComponents = (studentReceived) => {
    if (studentReceived) {
      setRosterStudent(studentReceived);
      setLabSummary(true);
    } else {
      setLabSummary(false);
    }
  };

  return (
    <div className="main-container">
      {showLabSummary ? (
        <LabSummary rosterStudent={rosterStudent} componentNavigationHandler={switchComponents} />
      ) : (
        <ClassRoster componentNavigationHandler={switchComponents} />
      )}
    </div>
  );
};

export default Main;
