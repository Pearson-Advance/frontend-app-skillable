import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { Breadcrumb } from '@edx/paragon';

import './index.scss';
import Table from '../Table';
import { columns } from './columns';
import { formatUnixTimestamp } from '../../helpers';
import { SKILLABLE_URL } from '../../constants';

const LabSummary = ({ rosterStudent, componentNavigationHandler }) => {
  const [labs, setLabs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const handlePagination = (targetPage) => {
    setCurrentPage(targetPage);
    setIsLoading(true);
  };

  const handleBreadcrumbClick = () => componentNavigationHandler(null);

  /**
* Consumes course-enrollments API from pearson-core plugin of Devstack
*
* @param {string} apiUrl - URL of the course-enrollment API either base URL or one given by its pagination service
* @param {number} pageNumber - Consecutive page indentificator of the results to be retrieved.
*/
  const fetchLabsData = async (apiUrl, pageNumber) => {
    setIsLoading(true);
    try {
      const labsData = [];
      const response = await getAuthenticatedHttpClient().post(`${apiUrl}/?page=${pageNumber}`, { userid: rosterStudent.user_id });
      const result = await response.data;
      const laboratories = result.results;
      laboratories.forEach(laboratory => {
        const passedValue = { true: 'Yes', false: 'No' }[laboratory.exam_passed] ?? 'N/A';
        const examPercentage = (laboratory.exam_score / laboratory.exam_max_possible_score) * 10;

        labsData.push({
          lab_profile_name: laboratory.lab_profile_name,
          lab_instance_id: laboratory.lab_instance_id,
          exam_score: laboratory.exam_score ?? 'N/A',
          exam_percentage: Number.isNaN(examPercentage) ? 'N/A' : `${examPercentage}%` ?? 'N/A',
          exam_passed: passedValue,
          start_time: formatUnixTimestamp(laboratory.start_time),
          end_time: formatUnixTimestamp(laboratory.end_time),
        });
      });
      setLabs(labsData);
      if (!result.prev) {
        setPageCount(result.next ? Math.ceil(result.count / laboratories.length) : 1);
      }
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLabsData(`${SKILLABLE_URL}/events/api/v1/labinstancesearch`, currentPage);
  }, [currentPage]);

  return (
    <div>
      <div className="breadcrumb-container">
        <Breadcrumb
          links={[
            { label: 'Go Back', href: '#', id: 'goBack' },
          ]}
          activeLabel="Lab Summary"
          spacer={<span className="custom-spacer">/</span>}
          clickHandler={handleBreadcrumbClick}
        />
      </div>
      <div className="title-container">
        <h2>{ rosterStudent.username }</h2>
      </div>
      <Table
        isLoading={isLoading}
        data={labs}
        columns={columns()}
        emptyMessage="No Labs found."
        pageCount={pageCount}
        currentPage={currentPage}
        handlePagination={handlePagination}
      />
    </div>
  );
};

LabSummary.propTypes = {
  rosterStudent: PropTypes.objectOf(PropTypes.string),
  componentNavigationHandler: PropTypes.func,
};

export default LabSummary;
