import { toast } from 'react-toastify';

import { createKebun,createKebunDetail, updateKebun, updateKebunPeta } from '@/services/kebun';

export const handleStep1 = async (values, idKebun) => {
  if (idKebun) {
    // Update existing kebun
    const kebunData = {
      id_kebun: values.id_kebun,
      petani_id: parseInt(values.petani_id),
      lokasi_kebun: values.lokasi_kebun,
      luas: values.luas,
      waktu_tanam: `${values.waktu_tanam_year}-${values.waktu_tanam_month}-01`,
      jumlah_pokok: parseInt(values.jumlah_pokok),
      is_rspo: values.rspo === 'sudah',
      is_ispo: values.ispo === 'sudah',
      jenis_legalitas: values.jenis_legalitas === 'shm' ? '1' : values.jenis_legalitas === 'skgr' ? '2' : '3',
      nomor_legalitas: values.no_legalitas,
      pemiliki_legalitas: values.pemilik_legalitas,
      nomor_stdb: values.stdb
    };

    const response = await updateKebun(idKebun, kebunData);
    console.log("RESPONSE STEP 1", response);
    toast.success('Data kebun berhasil diperbarui');
    return { success: true, idKebun: response.data.id };
  } else {
    // Create new kebun
    const kebunData = {
      id_kebun: values.id_kebun,
      petani_id: parseInt(values.petani_id),
      lokasi_kebun: values.lokasi_kebun,
      luas: values.luas,
      waktu_tanam: `${values.waktu_tanam_year}-${values.waktu_tanam_month}-01`,
      jumlah_pokok: parseInt(values.jumlah_pokok),
      is_rspo: values.rspo === 'sudah',
      is_ispo: values.ispo === 'sudah',
      jenis_legalitas: values.jenis_legalitas === 'shm' ? '1' : values.jenis_legalitas === 'skgr' ? '2' : '3',
      nomor_legalitas: values.no_legalitas,
      pemiliki_legalitas: values.pemilik_legalitas,
      nomor_stdb: values.stdb
    };

    const response = await createKebunDetail(kebunData);
    console.log("RESPONSE STEP 1", response);
    if (response && response.data) {
      const newKebunId = response.data.data.id;
      toast.success('Data kebun berhasil disimpan');
      return { success: true, idKebun: newKebunId, redirect: true };
    }
  }
};

export const handleStep2 = async (values, idKebun) => {
  if (idKebun && values.peta && values.peta.length > 0) {
    // Create polygon coordinates - map to [longitude, latitude] and close the polygon
    const polygonCoords = values.peta.map(coord => [coord.lng, coord.lat]);
    // Close the polygon by adding the first coordinate at the end
    if (polygonCoords.length > 0) {
      polygonCoords.push(polygonCoords[0]);
    }

    const petaData = {
      petani_id: parseInt(values.petani_id),
      geom: {
        type: "Polygon",
        coordinates: [polygonCoords]
      }
    };

    await updateKebunPeta(idKebun, petaData);
    toast.success('Data pemetaan berhasil disimpan');
    return { success: true };
  }
};

export const handleStep3 = async (values, idKebun) => {
  if (idKebun) {
    const formData = new FormData();
    formData.append('kebun_id', idKebun);
    
    // Add coordinates data if available
    if (values.peta && values.peta.length > 0) {
      formData.append('coordinates', JSON.stringify(values.peta));
    }

    if (values.petaFile) formData.append('file_peta', values.petaFile);
    if (values.legalitasFile) formData.append('file_legalitas', values.legalitasFile);
    if (values.stdbFile) formData.append('file_stdb', values.stdbFile);

    await createKebun(formData);
    toast.success('Data kebun berhasil dilengkapi');
    return { success: true, redirect: true };
  }
};

