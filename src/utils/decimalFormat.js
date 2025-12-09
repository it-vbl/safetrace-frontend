/**
 * Formats a number with decimal separator (comma) - no thousand separators
 * Example: 1000.123 -> "1000,123"
 */
export const formatDecimalInput = (value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  // Convert to string and replace decimal point with comma
  let str = String(value).replace(/\./g, ',');
  
  // Handle empty or just separators
  if (str === '' || str === ',' || str === '-') {
    return str;
  }

  // Check if negative
  const isNegative = str.startsWith('-');
  if (isNegative) {
    str = str.substring(1);
  }

  // Split integer and decimal parts (using comma now)
  const parts = str.split(',');
  const integerPart = parts[0] || '';
  const decimalPart = parts[1] || '';

  // Combine with decimal part (comma separator) - no thousand separators
  let formatted = decimalPart ? `${integerPart},${decimalPart}` : integerPart;
  
  if (isNegative && formatted) {
    formatted = `-${formatted}`;
  }

  return formatted;
};

/**
 * Parses formatted number back to standard format
 * Example: "1000,123" -> "1000.123"
 */
export const parseDecimalInput = (value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  // Replace decimal separator (comma) with dot
  const cleaned = String(value).replace(/,/g, '.');

  return cleaned;
};

/**
 * Validates and formats decimal input while typing
 * Allows only numbers, one comma (decimal), and one negative sign
 * No thousand separators
 */
export const formatDecimalOnChange = (value) => {
  if (value === '') return '';
  if (value === '-') return '-';
  if (value === ',') return ',';

  // Allow only numbers, comma (decimal separator), and negative sign
  // Remove dots (no thousand separators)
  let cleaned = value.replace(/[^0-9,.-]/g, '').replace(/\./g, '');

  // Handle negative sign - only at the beginning
  const isNegative = cleaned.startsWith('-');
  if (isNegative) {
    cleaned = '-' + cleaned.substring(1).replace(/-/g, '');
  } else {
    cleaned = cleaned.replace(/-/g, '');
  }

  // Check if there's a comma (decimal separator) - preserve it
  const hasComma = cleaned.includes(',');
  
  // Split by comma to get integer and decimal parts
  let integerPart = '';
  let decimalPart = '';
  
  if (hasComma) {
    const parts = cleaned.split(',');
    integerPart = parts[0];
    // Only take the first part after comma as decimal (ignore additional commas)
    decimalPart = parts.length > 1 ? parts[1].replace(/,/g, '') : '';
  } else {
    integerPart = cleaned;
  }

  // If no integer part and no comma, return empty or just negative sign
  if (integerPart === '' && !hasComma) {
    return isNegative ? '-' : '';
  }

  // Combine with decimal part (comma separator) - no thousand separators
  let formatted = '';
  if (hasComma) {
    // Always include comma if it was in the input
    if (integerPart === '') {
      formatted = ',' + decimalPart;
    } else {
      formatted = integerPart + ',' + decimalPart;
    }
  } else {
    formatted = integerPart;
  }
  
  if (isNegative && formatted) {
    formatted = `-${formatted}`;
  }

  // Final check: if original value had a comma at the end and formatted doesn't, add it back
  if (value.endsWith(',') && !formatted.endsWith(',')) {
    formatted = formatted + ',';
  }

  return formatted;
};

