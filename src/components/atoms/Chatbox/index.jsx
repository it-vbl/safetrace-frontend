import PropTypes from 'prop-types';

import theme from '@/utils/tailwindTheme';

import Bell from '../Icons/Bell';

const Chatbox = ({ total = 0, color = theme.colors.neutral10 }) => {
  return (
    <div className='relative w-max' data-testid='chatbox'>
      <Bell color={color} data-testid='bell-icon' />
      {typeof total === 'number' && total > 0 && (
        <div className='absolute right-[-5px] top-[-5px] flex size-4 items-center justify-center rounded-full bg-primary'>
          <p className='text-[8px] font-semibold leading-[8px] text-[#FDEBED]'>{total}</p>
        </div>
      )}
    </div>
  );
};

Chatbox.propTypes = {
  total: PropTypes.number,
  color: PropTypes.string,
};

export default Chatbox;
