import PropTypes from 'prop-types';

import RemoveRedEye from '@/components/atoms/Icons/RemoveRedEye';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import theme from '@/utils/tailwindTheme';

const CustomTableColSeeAction = ({ onClick = () => {} }) => {
  return (
    <div className='flex h-full items-center justify-center'>
      <div className='flex cursor-pointer flex-row gap-1' onClick={onClick}>
        <RemoveRedEye size={16} color={theme.colors.blue9} data-testid='remove-red-eye-icon' />
        <Paragraph className='text-primary' level={4}>
          Lihat
        </Paragraph>
      </div>
    </div>
  );
};

CustomTableColSeeAction.propTypes = {
  onClick: PropTypes.func,
};

export default CustomTableColSeeAction;
