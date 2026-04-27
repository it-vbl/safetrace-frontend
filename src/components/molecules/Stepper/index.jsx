import React from 'react';
import PropTypes from 'prop-types';

import { cn } from '@/utils/cn';

const Stepper = ({
  steps,
  currentStep,
  lastStep,
  onStepClick,
  className = '',
  completedSteps = [],
}) => {
  return (
    <div
      className={cn(
        'flex w-full overflow-x-auto items-center justify-start md:justify-center gap-2 border border-gray-300 p-2 rounded-[4px] bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
        className
      )}
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = completedSteps.includes(stepNumber);
        const isCurrent = stepNumber === currentStep;
        const isLastStep = stepNumber === lastStep;
        const isFuture = stepNumber > currentStep;

        return (
          <div
            key={stepNumber}
            className={cn(
              'flex flex-shrink-0 items-center cursor-pointer px-3 md:px-4 py-2 transition-all duration-200 whitespace-nowrap',
              isCurrent && 'bg-gray-100 rounded-lg ',
              isFuture && !isLastStep && 'cursor-not-allowed'
            )}
            onClick={() => onStepClick && onStepClick(stepNumber)}
          >
            {/* Step Icon */}
            <div
              className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full border mr-3',
                isCompleted && 'border-blue-600 bg-blue-600 text-white',
                isCurrent && 'border-blue-600 text-blue-600',
                isCompleted && isCurrent && ' text-white',
                isFuture &&
                  !isCompleted &&
                  'border-gray-300 bg-white text-gray-500'
              )}
            >
              {isCompleted ? (
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-xs font-bold">{stepNumber}</span>
              )}
            </div>

            {/* Step Text */}
            <span
              className={cn(
                'text-sm font-bold',
                (isCompleted || isCurrent) && 'text-blue-600',
                isFuture && 'text-black'
              )}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

Stepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
  onStepClick: PropTypes.func,
  className: PropTypes.string,
};

export default Stepper;
