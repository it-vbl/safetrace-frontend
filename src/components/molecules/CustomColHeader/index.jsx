import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Sort from '@/components/atoms/Icons/Sort';
import SortDown from '@/components/atoms/Icons/SortDown';
import SortUp from '@/components/atoms/Icons/SortUp';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import { cn } from '@/utils/cn';
import { setSelectedSort } from '@/store/data/actions';

const CustomColHeader = (props) => {
  const dispatch = useDispatch();
  const { selectedSort } = useSelector((state) => state.data);

  const handleSortChange = () => {
    let field;
    let direction = selectedSort.direction === '' ? 'asc' : selectedSort.direction === 'asc' ? 'desc' : '';

    if (!selectedSort.field) {
      field = props.column.colId;
    } else if (selectedSort.field === props.column.colId) {
      field = selectedSort.field;
    } else {
      field = props.column.colId;
      direction = 'asc';
    }

    dispatch(
      setSelectedSort({
        data: {
          field,
          direction,
        },
      })
    );
  };

  useEffect(() => {
    props.column.addEventListener('sortChanged', handleSortChange);
    return () => {
      props.column.removeEventListener('sortChanged', handleSortChange);
    };
  }, []);

  return (
    <div
      data-testid='header-container'
      onClick={props?.enableSorting ? handleSortChange : () => {}}
      className={cn(
        'flex flex-1 cursor-pointer flex-row items-center justify-between',
        props.column.colDef?.headerClassName,
        { '!cursor-default': !props?.enableSorting }
      )}
    >
      <Paragraph level={3} className='font-bold' data-testid='header-text'>
        {props.column.colDef.headerName}
      </Paragraph>
      {props.column.colDef.sortable ? (
        selectedSort?.field === props.column.colId ? (
          selectedSort?.direction === 'asc' ? (
            <SortUp data-testid='sort-icon-asc' />
          ) : selectedSort?.direction === 'desc' ? (
            <SortDown data-testid='sort-icon-desc' />
          ) : (
            <Sort data-testid='sort-icon-default' />
          )
        ) : (
          <Sort data-testid='sort-icon-default' />
        )
      ) : null}
    </div>
  );
};

export default CustomColHeader;
