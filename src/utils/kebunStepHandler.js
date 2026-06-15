import { toast } from 'react-toastify';

import {
  createKebun,
  createKebunDetail,
  updateKebun,
  updateKebunPeta,
} from '@/services/kebun';

export const handleStep1 = async (values, idKebun) => {
  if (idKebun) {
    // Update existing kebun
    const kebunData = {
      id_kebun: values.id_kebun,
      petani_id: parseInt(values.petani_id),
      lokasi_kebun: values.lokasi_kebun,
      luas: values.luas,
      luas_peta: values.luas_peta,
      waktu_tanam: `${values.waktu_tanam_year}-${values.waktu_tanam_month}-01`,
      is_rspo: values.rspo === 'sudah',
      is_ispo: values.ispo === 'sudah',
      jenis_legalitas:
        values.jenis_legalitas === 'shm'
          ? '1'
          : values.jenis_legalitas === 'skgr'
          ? '2'
          : '3',
      nomor_legalitas: values.no_legalitas,
      pemilik_legalitas: values.pemilik_legalitas,
      nomor_stdb: values.stdb,
      komoditas: values.komoditas,
      total_prod_per_tahun: parseFloat(values.total_prod_per_tahun),
      tahun_peremajaan: parseInt(values.tahun_peremajaan),
      jumlah_pokok: parseInt(values.jumlah_pokok) || 0,
      pola_tanam: values.pola_tanam,
      jenis_lahan: values.jenis_lahan,
      asal_benih: values.asal_benih,
      jenis_pupuk: values.jenis_pupuk,
      mitra_penjualan: values.mitra_penjualan,
    };

    const response = await updateKebun(idKebun, kebunData);
    toast.success('Data kebun berhasil diperbarui');
    return { success: true, idKebun: response.data.id };
  } else {
    // Create new kebun
    const kebunData = {
      id_kebun: values.id_kebun,
      petani_id: parseInt(values.petani_id),
      lokasi_kebun: values.lokasi_kebun,
      luas: values.luas,
      luas_peta: values.luas_peta,
      waktu_tanam: `${values.waktu_tanam_year}-${values.waktu_tanam_month}-01`,
      is_rspo: values.rspo === 'sudah',
      is_ispo: values.ispo === 'sudah',
      jenis_legalitas:
        values.jenis_legalitas === 'shm'
          ? '1'
          : values.jenis_legalitas === 'skgr'
          ? '2'
          : '3',
      nomor_legalitas: values.no_legalitas,
      pemilik_legalitas: values.pemilik_legalitas,
      nomor_stdb: values.stdb,
      komoditas: values.komoditas,
      total_prod_per_tahun: parseFloat(values.total_prod_per_tahun),
      tahun_peremajaan: parseInt(values.tahun_peremajaan),
      jumlah_pokok: parseInt(values.jumlah_pokok) || 0,
      pola_tanam: values.pola_tanam,
      jenis_lahan: values.jenis_lahan,
      asal_benih: values.asal_benih,
      jenis_pupuk: values.jenis_pupuk,
      mitra_penjualan: values.mitra_penjualan,
    };

    const response = await createKebunDetail(kebunData);
    if (response && response.data) {
      const newKebunId = response.data.data.id;
      toast.success('Data kebun berhasil disimpan');
      return { success: true, idKebun: newKebunId, redirect: true };
    }
  }
};

export const handleStep2 = async () => {
  return { success: true };
};

export const handleStep3 = async (values, idKebun) => {
  toast.success('Data kebun berhasil dilengkapi');
  return { success: true, redirect: true };
};
