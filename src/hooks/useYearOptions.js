import { useMemo } from 'react';

const useYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 100;
  const yearOptions = useMemo(() => {
    const options = [];
    for (let year = currentYear; year >= startYear; year--) {
      options.push({ value: year, label: year.toString() });
    }
    return options;
  }, [currentYear, startYear]);

  return yearOptions;
};

export default useYearOptions;
