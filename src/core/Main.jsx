import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
} from 'react-router-dom';

import ClassRoster from 'common/ClassRoster';
import LabSummary from 'views/LabSummary';
import LabDetails from 'views/LabDetails';
// eslint-disable-next-line import/no-unresolved
import StudentUsageReport from 'xtremeLabsViews/StudentUsageReport';
import { mfeBaseUrl } from 'constants';

import './Main.scss';

const Main = () => {
  const [rosterStudent, setRosterStudent] = useState(null);
  const [selectedLabDetails, setSelectedLabDetails] = useState(null);

  useEffect(() => {
    const sendHeight = () => {
      // Send height to the parent window
      const height = document.body.scrollHeight;
      const message = { type: 'iframeHeight', height };
      const originUrl = window.location.origin;
      window.parent.postMessage(message, originUrl);
    };

    const observer = new MutationObserver(() => {
      sendHeight();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [useLocation()]);

  return (
    <Router>
      <div className="main-container">
        <Switch>
          {/* Common Routes */}
          <Route
            exact
            path={`${mfeBaseUrl}`}
            render={(props) => (
              <ClassRoster
                {...props}
                courseId={props.match.params.courseId}
                setRosterStudent={setRosterStudent}
              />
            )}
          />
          {/* Skillable Routes */}
          <Route
            path={`${mfeBaseUrl}/lab-summary/:studentId`}
            render={(props) => (
              <LabSummary
                {...props}
                courseId={props.match.params.courseId}
                rosterStudent={rosterStudent}
                setSelectedLabDetails={setSelectedLabDetails}
              />
            )}
          />
          <Route
            path={`${mfeBaseUrl}/lab-details/:labInstanceId`}
            render={(props) => (
              <LabDetails
                {...props}
                courseId={props.match.params.courseId}
                labData={selectedLabDetails}
                rosterStudent={rosterStudent}
              />
            )}
          />
          {/* Xtreme Labs Routes */}
          <Route
            path={`${mfeBaseUrl}/student-usage-report/:studentId`}
            render={({ match }) => (
              <StudentUsageReport
                studentId={match.params.studentId}
                courseId={match.params.courseId}
              />
            )}
          />
          <Redirect from="/" to={`${mfeBaseUrl}`} />
        </Switch>
      </div>
    </Router>
  );
};

Main.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
      studentId: PropTypes.string,
      labInstanceId: PropTypes.string,
    }).isRequired,
  }),
};

export default Main;
