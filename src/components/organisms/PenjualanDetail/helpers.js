import moment from 'moment';

export const formatDateID = (dateValue) => {
  if (!dateValue) return '-';
  const parsed = moment(dateValue);
  if (!parsed.isValid()) {
    return dateValue;
  }
  return parsed.format('DD MMMM YYYY');
};

export const formatNumberID = (value, options = {}) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return value;
  }

  return numericValue.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  });
};

export const formatCurrencyID = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return value;
  }

  return numericValue.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });
};

export const getKelompokName = (kelompok) => {
  if (!kelompok) return '-';
  if (typeof kelompok === 'string') return kelompok;
  return (
    kelompok.nama ||
    kelompok.label ||
    kelompok.kelompok_penyetor ||
    kelompok.name ||
    '-'
  );
};

export const getKelompokLink = (kelompok) => {
  if (!kelompok || typeof kelompok === 'string') return null;
  return (
    kelompok.href ||
    kelompok.url ||
    null
  );
};

export const getAnggotaNames = (anggotaList = []) => {
  if (!Array.isArray(anggotaList) || anggotaList.length === 0) {
    return '-';
  }

  const names = anggotaList
    .map((anggota) => {
      if (!anggota) return null;
      if (typeof anggota === 'string') return anggota;
      return (
        anggota.nama ||
        anggota.nama_petani ||
        anggota.label ||
        anggota.id_petani ||
        null
      );
    })
    .filter(Boolean);

  return names.length > 0 ? names.join(', ') : '-';
};

