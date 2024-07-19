import React from 'react';
import PropTypes, { object } from 'prop-types';
import {
  DataTable,
  Pagination,
} from '@edx/paragon';

import './index.scss';

/**
 * Main component to render into a Paragon's datatable the data fetched by each view
 *
 * @param {boolean} isLoading - Refers if the data has been already fetched and ready to show
 * @param {arrayOf(object)} data - Array that contains each object to be shown into table's rows
 * @param {arrayOf(object)} columns - Array with the columns data to be displayed such column name, column's field
 * @param {string} emptyMessage - String to be shown when there are no data fetched
 * @param {number} pageCount - Number of pages into the data is splited
 * @param {number} currentPage - Refers of which page of the whole data is shown
 * @param {func} handlePagination - func passed  by parent that manages the navigation between views
 * @returns {HTMLElement} - Component to be rendered
 */
const Table = ({
  isLoading,
  data,
  columns,
  emptyMessage,
  pageCount,
  currentPage,
  handlePagination,
}) => (
  <div className="tableWrapper">
    <DataTable
      isLoading={isLoading}
      itemCount={data.length}
      isSortable
      data={data}
      columns={columns}
    >
      <DataTable.Table />
      <DataTable.EmptyTable content={emptyMessage} />
    </DataTable>
    <Pagination
      paginationLabel="paginationNavigation"
      pageCount={pageCount}
      currentPage={currentPage}
      onPageSelect={handlePagination}
      variant="reduced"
      className="mx-auto pagination-table"
      size="small"
    />
  </div>
);

Table.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.arrayOf(object),
  columns: PropTypes.arrayOf(object),
  emptyMessage: PropTypes.string,
  pageCount: PropTypes.number,
  currentPage: PropTypes.number,
  handlePagination: PropTypes.func,
};

export default Table;
