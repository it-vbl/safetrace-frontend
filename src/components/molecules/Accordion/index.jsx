import PropTypes from 'prop-types';

import AccordionItem from '../../atoms/AccordionItem';

const Accordion = ({ items = [], accordionItemClassName = '' }) => (
  <div data-testid='accordion'>
    {items.map((item, index) => (
      <AccordionItem title={item.title} description={item.description} key={index} className={accordionItemClassName} />
    ))}
  </div>
);

Accordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    })
  ),
};

export default Accordion;
