import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@edx/paragon';

import './index.scss';

const AlertMessage = ({
  variant,
  heading,
  message,
  children,
}) => (
  <div className="error-container">
    <Alert variant={variant}>
      <Alert.Heading>{heading}</Alert.Heading>
      {message && (
        <>
          <hr />
          <p className="mb-0">{message}</p>
        </>
      )}
      {children}
      <hr />
    </Alert>
  </div>
);

AlertMessage.propTypes = {
  variant: PropTypes.string,
  heading: PropTypes.string.isRequired,
  message: PropTypes.string,
  children: PropTypes.node,
};

AlertMessage.defaultProps = {
  variant: 'danger',
  message: null,
  children: null,
};

export default AlertMessage;
