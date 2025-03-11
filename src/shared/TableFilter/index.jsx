import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Col,
  Form,
  Icon,
} from '@edx/paragon';
import { Search } from '@edx/paragon/icons';

const TableFilter = ({ onFilterSubmit, error }) => {
  const [filterValue, setFilterValue] = useState('');
  const [selectedParam, setSelectedParam] = useState('learner_name');
  const [filterErrorMessage, setFilterErrorMessage] = useState(null);

  const handleFilterChange = (e) => setFilterValue(e.target.value);
  const handleParamChange = (e) => setSelectedParam(e.target.value);

  /**
   * Handles the submission of the filter form.
   *
   * This function is called when the filter form is submitted. It prevents
   * the default form submission behavior, constructs a filter object based on
   * the selected parameter and filter value, and calls `fetchUsersData` to
   * fetch and update the data table with the filtered results.
   *
   * @param {Event} e - The event object representing the form submission.
   */
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (!filterValue) {
      setFilterErrorMessage('Please enter a value to search.');
      return;
    }
    setFilterErrorMessage(null);
    onFilterSubmit({ [selectedParam]: filterValue });
  };

  /**
   * Handles the reset action of the filter form.
   *
   * This function is called cuando the reset button is clicked. It clears the filter
   * value and error message, and calls `fetchUsersData` to fetch and update the
   * data table with the default (unfiltered) results.
   */
  const handleFilterReset = () => {
    setFilterValue('');
    setFilterErrorMessage(null);
    onFilterSubmit({});
  };

  return (
    <Form onSubmit={handleFilterSubmit}>
      <Form.Group as={Col} controlId="formGridParam">
        <Form.RadioSet name="selectedParam" onChange={handleParamChange} value={selectedParam}>
          <div className="radio-buttons">
            <Form.Radio value="learner_name" className="form-radio">Name</Form.Radio>
            <Form.Radio value="learner_email" className="form-radio">Email</Form.Radio>
          </div>
        </Form.RadioSet>
      </Form.Group>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridFilter" isInvalid={!!filterErrorMessage || !!error}>
          <Form.Control
            value={filterValue}
            onChange={handleFilterChange}
            placeholder="Search student"
            floatingLabel="Search student"
            className="form-custom-height"
            leadingElement={<Icon src={Search} className="mt-2 icon" />}
          />
          {(filterErrorMessage || error) && (
            <Form.Control.Feedback type="invalid">
              {filterErrorMessage || error}
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
  );
};

TableFilter.propTypes = {
  onFilterSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default TableFilter;
