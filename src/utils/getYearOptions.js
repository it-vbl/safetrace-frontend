/**
 * Generate year options from a start year to the current year
 * @param {number} startYear - The starting year (e.g., 2000)
 * @returns {Array} Array of year options in format [{ label: '2000', value: '2000' }, ...]
 */
const getYearOptions = (startYear) => {
  const currentYear = new Date().getFullYear();
  const options = [];

  // Validate startYear
  if (!startYear || typeof startYear !== 'number' || startYear > currentYear) {
    throw new Error(
      `Invalid startYear: ${startYear}. Must be a number less than or equal to ${currentYear}`
    );
  }

  // Generate options from startYear to currentYear (inclusive)
  for (let year = startYear; year <= currentYear; year++) {
    options.push({
      label: year.toString(),
      value: year.toString(),
    });
  }

  // Return in descending order (most recent year first)
  return options.reverse();
};

export default getYearOptions;

