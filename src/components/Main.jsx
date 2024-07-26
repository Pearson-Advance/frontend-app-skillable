import React, { useState } from 'react';

import ClassRoster from './ClassRoster';
import LabSummary from './LabSummary';
import LabDetails from './LabDetails';

import './Main.scss';

const Main = () => {
  const [rosterStudent, setRosterStudent] = useState(null);
  const [showLabSummary, setShowLabSummary] = useState(false);
  const [showLabDetails, setShowLabDetails] = useState(false);
  const [labDetails, setLabDetails] = useState({ labInstanceId: null, labProfileName: '' });

  /**
   * Switch between components to be rendered,
   * When an anonymous User Id is passed, means that its Lab Summary is going to be fetched and shown
   *
   * @param {object} studentReceived - Object with the select student data
   * @param {object | null} labDetailsReceived - Object containing labInstanceId and labProfileName (if applicable)
   */
  const switchComponents = (studentReceived, labDetailsReceived = null) => {
    if (studentReceived) {
      setRosterStudent(studentReceived);
      setShowLabSummary(true);
      setShowLabDetails(false);
      return setShowLabSummary(true);
    }
    if (labDetailsReceived) {
      setLabDetails(labDetailsReceived);
      setShowLabSummary(false);
      setShowLabDetails(true);
      return setShowLabDetails(true);
    }
    setShowLabSummary(false);
    setShowLabDetails(false);
    return false;
  };

  /**
   * Renders the appropriate component based on the current state.
   * If `showLabDetails` is true, it renders the LabDetails component.
   * If `showLabSummary` is true, it renders the LabSummary component.
   * Otherwise, it renders the ClassRoster component.
   *
   * @returns {React.Element} The component to be rendered.
   */
  const renderComponent = () => {
    if (showLabDetails) {
      return (
        <LabDetails
          labInstanceId={String(labDetails.labInstanceId)}
          labProfileName={labDetails.labProfileName}
          labData={labDetails}
          rosterStudent={rosterStudent}
          componentNavigationHandler={switchComponents}
        />
      );
    }
    if (showLabSummary) {
      return (
        <LabSummary
          rosterStudent={rosterStudent}
          componentNavigationHandler={switchComponents}
        />
      );
    }
    return <ClassRoster componentNavigationHandler={switchComponents} />;
  };

  return (
    <div className="main-container">
      {renderComponent()}
    </div>
  );
};

export default Main;
