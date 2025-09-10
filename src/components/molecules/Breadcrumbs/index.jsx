import Link from 'next/link';
import PropTypes from 'prop-types';

const Breadcrumb = ({ crumbs = [], className, ...props }) => {
  return (
    <nav aria-label="breadcrumb" className={className} {...props}>
      <ol className="flex list-none flex-wrap rounded text-base font-bold uppercase tracking-wide">
        {crumbs.map((item, index) => (
          <li
            key={index}
            className={`flex items-center text-base ${
              index === crumbs.length - 1 ? 'text-blue8' : ''
            }`}
            data-testid="breadcrumb-item"
          >
            {index === crumbs.length - 1 ? (
              item.name
            ) : item.url ? (
              <Link className="text-base text-neutral8" href={item.url}>
                {item.name}
              </Link>
            ) : (
              item.name
            )}
            {index < crumbs.length - 1 && (
              <span className="mx-2 text-[#6c757d]">{`>`}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string,
    })
  ),
  className: PropTypes.string,
};

export default Breadcrumb;
