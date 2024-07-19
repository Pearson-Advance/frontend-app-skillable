import React, { useState } from 'react';

import ClassRoster from './ClassRoster';
import LabSummary from './LabSummary';

import './Main.scss';

const Main = () => {
  const [showLabSummary, setLabSummary] = useState(false);
  const [anonymousUserId, setAnonymousUserId] = useState(null);

  /**
   * Switch between components to be rendered,
   * When an anonymous User Id is passed, means that its Lab Summary is going to be fetched and shown
   *
   * @param {string} anonymousUserIdReceived - Anonymous User Id of a selected student
   */
  const switchComponents = (anonymousUserIdReceived) => {
    if (anonymousUserIdReceived) {
      setAnonymousUserId(anonymousUserIdReceived);
      setLabSummary(true);
    } else {
      setLabSummary(false);
    }
  };

  return (
    <div className="main-container">
      {showLabSummary ? (
        <LabSummary anonymousUserId={anonymousUserId} componentNavigationHandler={switchComponents} />
      ) : (
        <ClassRoster componentNavigationHandler={switchComponents} />
      )}
    </div>
  );
};

export default Main;
