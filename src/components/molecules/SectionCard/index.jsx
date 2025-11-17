import React from 'react';

const SectionCard = ({
  title = '',
  actionLabel = 'Ubah Data',
  onAction,
  actionDisabled = false,
  children,
  className = '',
  headerRight,
}) => {
  const showAction = typeof onAction === 'function' && actionLabel;

  return (
    <section
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex flex-col gap-2 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {title ? (
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {headerRight}
          {showAction ? (
            <button
              type="button"
              onClick={onAction}
              disabled={actionDisabled}
              className="text-sm font-medium text-blue-700 underline transition hover:text-blue-900 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
};

export default SectionCard;

