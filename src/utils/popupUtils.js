export function getPopupHtml(layerId, featureProperties) {
  // Define the mapping from display text to attribute keys
  const fieldMappings = [
    { displayText: 'Wilayah Administrasi Kabupaten', key: 'NAMOBJ' },
    { displayText: 'Wilayah Administrasi Kecamatan', key: 'DistrictID' },
    { displayText: 'Wilayah Administrasi Desa', key: 'VillageID' },
    { displayText: 'Kawasan Hutan', key: 'Deskripsi' },
    { displayText: 'Perizinan Perkebunan Sawit (ILOK/IUP)', key: 'name' },
    { displayText: 'Hak Guna Usaha (HGU)', key: 'NAMA' },
    {
      displayText: 'Wilayah Izin Usaha Pertambangan (WIUP)',
      key: 'Nama Perusahaan',
    },
    {
      displayText: 'Perizinan Berusaha Pemanfaatan Hutan (PBPH)',
      key: 'namobj',
    },
    { displayText: 'Pabrik Sawit', key: 'mill_name' },
    { displayText: 'Lahan Gambut', key: 'LANDFORM' },
  ];

  // Generate grid items for each field mapping
  const gridItems = fieldMappings
    .map(({ displayText, key }) => {
      const value = featureProperties?.[key] || '-';
      return `
        <div class="border-b border-dashed pr-6 !mb-2">
          <p class="!m-0 !mb-2 !p-0 text-[12px] font-bold text-gray-400">${displayText}</p>
          <p class="!m-0 !mb-4 !p-0 text-[14px]">${value}</p>
        </div>
      `;
    })
    .join('');

  return `
    <div class="w-full">
      <div class="flex h-[32px] items-center justify-between mb-2">
        <p class="font-bold text-lg">DETAIL</p>
      </div>
      <div class="w-[600px]">
        <div class="grid grid-cols-3 gap-0">
          ${gridItems}
        </div>
      </div>
    </div>
  `;
}
