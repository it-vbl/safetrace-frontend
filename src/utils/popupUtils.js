export function getPopupHtml(layerId, featureProperties) {
  if (layerId == '1') {
    // Peta IUP
    return `
      <div class="w-full">
        <div class="flex h-[32px] items-center justify-between">
          <p class="font-bold text-lg">DETAIL IUP</p>
        </div>
        <div class="w-[600px]">
          <div class="grid grid-cols-3">
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Nama</p>
              <p class="m-0 text-[14px]">${featureProperties?.nama || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Nomor SK</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.NOMORSK || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Komoditas</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.KOMODITAS || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Luas Lahan (ha)</p>
              <p class="m-0 text-[14px]">${featureProperties?.ha || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kecamatan</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.distric_id || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kabupaten</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.distric_en || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Provinsi</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.prov_en || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Pulau</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.island_en || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Nama Perusahaan</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.NAME_HGU || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Nama IUP</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.NAME_IUP || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Tanggal Terbit</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.TANGGAL_2 || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Berakhir</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.BERAKHIR || '-'
              }</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (layerId == '2') {
    // Batas Desa
    return `
      <div class="w-full">
        <div class="flex h-[32px] items-center justify-between">
          <p class="font-bold text-lg">DETAIL BATAS DESA</p>
        </div>
        <div class="w-[500px]">
          <div class="grid grid-cols-3">
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Provinsi</p>
              <p class="m-0 text-[14px]">${featureProperties?.ProvEN || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kabupaten</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.DistrictEN || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kecamatan</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.SubdistEN || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Desa</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.VillageEN || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kode Provinsi</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.ProvCode || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kode Kabupaten</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.DistCode || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kode Kecamatan</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.SubdisCode || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kode Desa</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.VillCode || '-'
              }</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (layerId == '3') {
    // Batas Kecamatan
    return `
      <div class="w-full">
        <div class="flex h-[32px] items-center justify-between">
          <p class="font-bold text-lg">DETAIL BATAS KECAMATAN</p>
        </div>
        <div class="w-[500px]">
          <div class="grid grid-cols-3">
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Provinsi</p>
              <p class="m-0 text-[14px]">${featureProperties?.ProvEN || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kabupaten</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.DistrictEN || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kecamatan</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.SubdistEN || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kode Provinsi</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.ProvCode || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kode Kabupaten</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.DistCode || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kode Kecamatan</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.SubdisCode || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Num</p>
              <p class="m-0 text-[14px]">${featureProperties?.Num || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (layerId == '4') {
    // Kawasan Hutan
    return `
      <div class="w-full">
        <div class="flex h-[32px] items-center justify-between">
          <p class="font-bold text-lg">DETAIL KAWASAN HUTAN</p>
        </div>
        <div class="w-[500px]">
          <div class="grid grid-cols-3">
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Fungsi</p>
              <p class="m-0 text-[14px]">${featureProperties?.Fungsi || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Luas (ha)</p>
              <p class="m-0 text-[14px]">${featureProperties?.Luas || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Nomor SK</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.noskkws || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Tanggal SK</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.tglskkws || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Remark</p>
              <p class="m-0 text-[14px]">${featureProperties?.remark || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kode Provinsi</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.kode_prov || '-'
              }</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (layerId == '5') {
    // Peta Bidang Sawit
    return `
      <div class="w-full">
        <div class="flex h-[32px] items-center justify-between">
          <p class="font-bold text-lg">DETAIL PETA BIDANG SAWIT</p>
        </div>
        <div class="w-[500px]">
          <div class="grid grid-cols-3">
            <div class="border-b border-dashed  pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Nama</p>
              <p class="m-0 text-[14px]">${featureProperties?.NAMA || '-'}</p>
            </div>
            <div class="border-b border-dashed  pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">No KTP</p>
              <p class="m-0 text-[14px]">${featureProperties?.NO_KTP || '-'}</p>
            </div>
            <div class="border-b border-dashed  pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">TTL</p>
              <p class="m-0 text-[14px]">${featureProperties?.TTL || '-'}</p>
            </div>
            <div class="border-b border-dashed  pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Provinsi</p>
              <p class="m-0 text-[14px]">${featureProperties?.PROV || '-'}</p>
            </div>
            <div class="border-b border-dashed  pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kabupaten</p>
              <p class="m-0 text-[14px]">${featureProperties?.KAB || '-'}</p>
            </div>
            <div class="border-b border-dashed  pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kecamatan</p>
              <p class="m-0 text-[14px]">${featureProperties?.KEC || '-'}</p>
            </div>
            <div class="border-b border-dashed  pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Desa</p>
              <p class="m-0 text-[14px]">${featureProperties?.DESA || '-'}</p>
            </div>
            <div class="border-b border-dashed  pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Alamat</p>
              <p class="m-0 text-[14px]">${featureProperties?.ALAMAT || '-'}</p>
            </div>
            <div class="border-b border-dashed  pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Komoditas</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.KOMODITAS || '-'
              }</p>
            </div>
            <div class="border-b border-dashed  pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Luas Areal (ha)</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.LUAS_AREAL || '-'
              }</p>
            </div>
            <div class="border-b border-dashed  pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Tahun Tanam</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.THN_TANAM || '-'
              }</p>
            </div>
            <div class="border-b border-dashed  pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Jumlah Pohon</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.JMLH_POHON || '-'
              }</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (layerId == '6') {
    // HGU
    return `
      <div class="w-full">
        <div class="flex h-[32px] items-center justify-between">
          <p class="font-bold text-lg">DETAIL HGU</p>
        </div>
        <div class="w-[500px]">
          <div class="grid grid-cols-3">
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Pemegang Hak</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.PEMEGANGHA || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Nomor Hak</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.NOMORHAK || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Nomor SK</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.NOMORSK || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Tanggal</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.TANGGAL || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Berakhir</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.BERAKHIR || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Luas (ha)</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.luas_ha || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Grup Usaha</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.Grup_Usaha || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Bentuk Usaha</p>
              <p class="m-0 text-[14px]">${featureProperties?.BU || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (layerId == '7') {
    // Lahan Gambut
    return `
      <div class="w-full">
        <div class="flex h-[32px] items-center justify-between">
          <p class="font-bold text-lg">DETAIL LAHAN GAMBUT</p>
        </div>
        <div class="w-[500px]">
          <div class="grid grid-cols-3">
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Wadah Pu</p>
              <p class="m-0 text-[14px]">${featureProperties?.WADMPU || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Landform</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.LANDFORM || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Bahan Induk</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.BHNINDK || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Relief</p>
              <p class="m-0 text-[14px]">${featureProperties?.RELIEF || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kelas Tanah 1</p>
              <p class="m-0 text-[14px]">${featureProperties?.KTN1 || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kelas Tanah 2</p>
              <p class="m-0 text-[14px]">${featureProperties?.KTN2 || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">USDA 1</p>
              <p class="m-0 text-[14px]">${featureProperties?.USDA1 || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">USDA 2</p>
              <p class="m-0 text-[14px]">${featureProperties?.USDA2 || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Luas Area</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.Shape_Area || '-'
              }</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (layerId == '8') {
    // Pabrik Sawit
    return `
      <div class="w-full">
        <div class="flex h-[32px] items-center justify-between">
          <p class="font-bold text-lg">DETAIL PABRIK SAWIT</p>
        </div>
        <div class="w-[500px]">
          <div class="grid grid-cols-3">
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Nama Pabrik</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.mill_name || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Perusahaan</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.company || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Grup</p>
              <p class="m-0 text-[14px]">${featureProperties?.group_ || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kapasitas</p>
              <p class="m-0 text-[14px]">${featureProperties?.cap || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Aktif</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.active === 1 ? 'Ya' : 'Tidak'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Tahun Mulai</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.earliest_y || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Provinsi</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.prov_ENG || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kabupaten</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.dist_ENG || '-'
              }</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // Default popup
    return `
      <div class="w-full">
        <div class="flex h-[32px] items-center justify-between">
          <p class="font-bold text-lg">DETAIL</p>
        </div>
        <div class="w-[500px]">
          <div class="grid grid-cols-3">
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Nama</p>
              <p class="m-0 text-[14px]">${featureProperties?.nama || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Nomor SK</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.NOMORSK || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Komoditas</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.KOMODITAS || '-'
              }</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Luas Lahan (m2)</p>
              <p class="m-0 text-[14px]">${featureProperties?.ha || '-'}</p>
            </div>
            <div class="border-b border-dashed pr-8">
              <p class="m-0 text-[12px] font-bold text-gray-400">Kecamatan</p>
              <p class="m-0 text-[14px]">${
                featureProperties?.disctrict_id || '-'
              }</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
