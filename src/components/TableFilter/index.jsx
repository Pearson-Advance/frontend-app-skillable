import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Icon } from '@edx/paragon';
import { Button } from 'react-paragon-topaz';
import { Search } from '@edx/paragon/icons';
import './index.scss';

const TableFilter = ({
  filterValue,
  selectedParam,
  filterErrorMessage,
  handleFilterChange,
  handleParamChange,
  handleFilterSubmit,
  handleFilterReset,
}) => (
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
);

TableFilter.propTypes = {
  filterValue: PropTypes.string.isRequired,
  selectedParam: PropTypes.string.isRequired,
  filterErrorMessage: PropTypes.string,
  handleFilterChange: PropTypes.func.isRequired,
  handleParamChange: PropTypes.func.isRequired,
  handleFilterSubmit: PropTypes.func.isRequired,
  handleFilterReset: PropTypes.func.isRequired,
};

TableFilter.defaultProps = {
  filterErrorMessage: null,
};

export default TableFilter;
