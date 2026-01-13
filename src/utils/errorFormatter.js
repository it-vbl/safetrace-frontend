/**
 * Formats API error response into a user-friendly message
 * Handles both general messages and field-specific errors
 *
 * @param {Object} errorData - The error data from API response
 * @param {string} errorData.message - General error message
 * @param {Object} errorData.errors - Object containing field-specific errors
 * @returns {string} Formatted error message
 *
 * @example
 * const errorData = {
 *   message: "Data tidak valid",
 *   errors: {
 *     "no_registrasi": ["Angkutan dengan no registrasi telah ada."]
 *   }
 * };
 * formatApiErrorMessage(errorData);
 * // Returns: "Data tidak valid\n\nAngkutan dengan no registrasi telah ada."
 */
export const formatApiErrorMessage = (errorData) => {
  if (!errorData) {
    return 'Terjadi kesalahan yang tidak diketahui';
  }

  // Get the general message
  const generalMessage =
    errorData.message || 'Terjadi kesalahan saat menyimpan data';

  // Check if there are field-specific errors
  if (errorData.errors && typeof errorData.errors === 'object') {
    const errorMessages = [];

    // Collect all error messages from the errors object
    Object.keys(errorData.errors).forEach((field) => {
      const fieldErrors = errorData.errors[field];
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        // Add each error message for this field
        fieldErrors.forEach((errorMsg) => {
          errorMessages.push(errorMsg);
        });
      } else if (typeof fieldErrors === 'string') {
        errorMessages.push(fieldErrors);
      }
    });

    // If we have field-specific errors, combine them with the general message
    if (errorMessages.length > 0) {
      return `${generalMessage} : \n\n${errorMessages.join('\n')}`;
    }
  }

  // Return just the general message if no field-specific errors
  return generalMessage;
};
