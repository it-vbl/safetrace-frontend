import React from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * BreadcrumbDetail component is reusable for any detail page.
 * @param {Array} items - Array of breadcrumb items, each item is an object { label: string, href?: string }
 * The last item is considered the current page and should not have href.
 */
const BreadcrumbDetail = ({ items }) => {
  return (
    <nav
      className="flex items-center text-sm font-semibold text-gray-700"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li className="tracking-[2px] font-bold text-[18px]">
                {isLast ? (
                  <div className="text-black" aria-current="page">
                    {item.label}
                  </div>
                ) : (
                  <a href={item.href} className="hover:underline text-gray-500">
                    {item.label}
                  </a>
                )}
              </li>
              {!isLast && (
                <li>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbDetail;
