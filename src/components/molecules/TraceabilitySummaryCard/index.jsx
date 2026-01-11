import PropTypes from 'prop-types';
import numberFormat from '@/libs/utils/numberFormat';

const TraceabilitySummaryCard = ({ title, headers, data }) => {
  return (
    <div className="flex flex-1 flex-col rounded-[4px] border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">
        {title}
      </h3>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="pb-2 text-xs font-bold text-gray-900"></th>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="pb-2 text-center text-xs font-bold text-gray-900"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-2 pr-4 text-xs font-medium text-gray-600">
                Jumlah
              </td>
              {data.map((item, index) => (
                <td
                  key={index}
                  className="py-2 text-center text-xs font-medium text-gray-900"
                >
                  {numberFormat(item.jumlah)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 text-xs font-medium text-gray-600">
                Presentase
              </td>
              {data.map((item, index) => (
                <td
                  key={index}
                  className="py-2 text-center text-xs font-medium text-gray-900"
                >
                  {item.presentase}%
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

TraceabilitySummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      jumlah: PropTypes.number.isRequired,
      presentase: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
};

export default TraceabilitySummaryCard;
