const numberFormat = (value, options = {}) => {
  const { locale = 'id-ID', minimumFractionDigits = 0, maximumFractionDigits = 2 } = options;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
};

export default numberFormat;
