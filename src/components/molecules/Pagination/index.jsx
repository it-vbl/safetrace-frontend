import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';

import useScreenSize from '@/helpers/utils/useScreenSize';
import { cn } from '@/utils/cn';

import ChevronLeft from '../../atoms/Icons/ChevronLeft';
import ChevronRight from '../../atoms/Icons/ChevronRight';
import ChevronsLeft from '../../atoms/Icons/ChevronsLeft';
import ChevronsRight from '../../atoms/Icons/ChevronsRight';
import TableSizeSelector from '../../molecules/TableSizeSelector';

const Pagination = ({
  totalPages,
  currentPage = 1,
  limit = 10,
  onPageChange = () => {},
  onTableSizeChange = () => {},
  options = [10, 25, 50],
  tableSizeDropdownPosition = 'bottom',
}) => {
  const { isMobile } = useScreenSize();

  const prevToFirstPage = () => {
    onPageChange(1);
  };
  const nextToLastPage = () => {
    onPageChange(totalPages);
  };

  const chevronsStyles = (disabled) => cn('cursor-pointer text-primary', disabled && 'text-neutral-300 cursor-not-allowed');

  return (
    <div
      data-testid='pagination-of-table'
      className='flex items-center justify-between gap-x-5 overflow-x-auto py-3 md:overflow-x-visible md:py-0'
    >
      {!isMobile && (
        <TableSizeSelector
          value={limit}
          onSelectOption={onTableSizeChange}
          options={options}
          dropdownPosition={tableSizeDropdownPosition}
        />
      )}

      <div className='flex items-center gap-x-2'>
        <div
          data-testid='chevrons-left'
          className={chevronsStyles(currentPage === 1)}
          onClick={currentPage === 1 ? null : prevToFirstPage}
        >
          <ChevronsLeft color='currentColor' />
        </div>

        <ReactPaginate
          pageCount={totalPages}
          nextLabel={<ChevronRight color='currentColor' />}
          previousLabel={<ChevronLeft color='currentColor' />}
          forcePage={currentPage - 1}
          onPageChange={(page) => {
            const { selected } = page;
            onPageChange(selected + 1);
          }}
          disableInitialCallback={true}
          renderOnZeroPageCount={null}
          containerClassName='flex gap-2 md:flex-wrap'
          pageLinkClassName='px-3 py-2 rounded-lg text-neutral-700 font-normal text-sm md:text-base'
          activeLinkClassName='px-3 py-2 text-white bg-primary'
          previousClassName={cn('flex items-center justify-center px-3', chevronsStyles(currentPage === 1))}
          nextClassName={cn('flex items-center justify-center px-3', chevronsStyles(currentPage === totalPages))}
          breakClassName='font-bold text-neutral-700'
        />

        <div
          data-testid='chevrons-right'
          className={chevronsStyles(currentPage === totalPages)}
          onClick={currentPage === totalPages ? () => {} : nextToLastPage}
        >
          <ChevronsRight color='currentColor' />
        </div>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onTableSizeChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.number),
  currentPage: PropTypes.number,
  limit: PropTypes.number,
  tableSizeDropdownPosition: PropTypes.oneOf(['top', 'bottom']),
};

export default Pagination;
