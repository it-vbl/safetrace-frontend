import api from './api';

// Mock data for pekerja
const mockPekerjaData = [
  {
    id: 1,
    id_petani: '001-APKS-001-001',
    nama_petani: 'Agustinus Nery',
    jenis_kelamin: 'Laki - Laki',
    kelompok: 'Bepekaek Besamo',
    no_ktp: '6109010805890003',
    no_kk: '6109011711110021',
    luas_kebun: '0.75',
    jumlah_pekerja: 3,
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    id_petani: '001-APKS-001-002',
    nama_petani: 'Maria Sari',
    jenis_kelamin: 'Perempuan',
    kelompok: 'Bepekaek Besamo',
    no_ktp: '6109010805890004',
    no_kk: '6109011711110022',
    luas_kebun: '1.25',
    jumlah_pekerja: 4,
    updated_at: '2024-01-14T14:20:00Z',
  },
  {
    id: 3,
    id_petani: '001-APKS-001-003',
    nama_petani: 'Budi Santoso',
    jenis_kelamin: 'Laki - Laki',
    kelompok: 'Kelompok A',
    no_ktp: '6109010805890005',
    no_kk: '6109011711110023',
    luas_kebun: '2.00',
    jumlah_pekerja: 4,
    updated_at: '2024-01-13T09:15:00Z',
  },
  {
    id: 4,
    id_petani: '001-APKS-001-004',
    nama_petani: 'Siti Rahayu',
    jenis_kelamin: 'Perempuan',
    kelompok: 'Kelompok A',
    no_ktp: '6109010805890006',
    no_kk: '6109011711110024',
    luas_kebun: '1.50',
    jumlah_pekerja: 2,
    updated_at: '2024-01-12T16:45:00Z',
  },
  {
    id: 5,
    id_petani: '001-APKS-001-005',
    nama_petani: 'Ahmad Wijaya',
    jenis_kelamin: 'Laki - Laki',
    kelompok: 'Kelompok B',
    no_ktp: '6109010805890007',
    no_kk: '6109011711110025',
    luas_kebun: '0.90',
    jumlah_pekerja: 1,
    updated_at: '2024-01-11T11:30:00Z',
  },
  {
    id: 6,
    id_petani: '001-APKS-001-006',
    nama_petani: 'Rina Dewi',
    jenis_kelamin: 'Perempuan',
    kelompok: 'Kelompok B',
    no_ktp: '6109010805890008',
    no_kk: '6109011711110026',
    luas_kebun: '1.80',
    jumlah_pekerja: 3,
    updated_at: '2024-01-10T13:20:00Z',
  },
  {
    id: 7,
    id_petani: '001-APKS-001-007',
    nama_petani: 'Eko Prasetyo',
    jenis_kelamin: 'Laki - Laki',
    kelompok: 'Bepekaek Besamo',
    no_ktp: '6109010805890009',
    no_kk: '6109011711110027',
    luas_kebun: '2.25',
    jumlah_pekerja: 4,
    updated_at: '2024-01-09T08:45:00Z',
  },
  {
    id: 8,
    id_petani: '001-APKS-001-008',
    nama_petani: 'Dewi Kartika',
    jenis_kelamin: 'Perempuan',
    kelompok: 'Kelompok A',
    no_ktp: '6109010805890010',
    no_kk: '6109011711110028',
    luas_kebun: '3.00',
    jumlah_pekerja: 5,
    updated_at: '2024-01-08T15:10:00Z',
  },
];

const mockPekerjaDetail = {
  id: 1,
  id_petani: '001-APKS-001-001',
  nama_petani: 'Agustinus Nery',
  jenis_kelamin: 'Laki - Laki',
  kelompok: 'Bepekaek Besamo',
  no_ktp: '6109010805890003',
  no_kk: '6109011711110021',
  luas_kebun: '0.75',
  jumlah_pekerja: 3,
  alamat: 'Dusun Gonis Rabu Desa Rangkang Sungkung',
  tempat_lahir: 'Sanggau',
  tanggal_lahir: '1989-05-08',
  status_perkawinan: 'Kawin',
  updated_at: '2024-01-15T10:30:00Z',
  identitas_pekerja: [
    {
      id: 1,
      nama: 'Agustinus Nery',
      jenis_kelamin: 'Laki - Laki',
      alamat: 'Dusun Gonis Rabu Desa Rangkang Sungkung',
      no_ktp: '6109010805890003',
      tempat_lahir: 'Sanggau',
      tanggal_lahir: '1989-05-08',
      no_kk: '6109011711110021',
      status_perkawinan: 'Kawin',
      ktp_file: '/images/sample-ktp.jpg',
      kk_file: '/images/sample-kk.jpg',
    },
    {
      id: 2,
      nama: 'Maria Sari',
      jenis_kelamin: 'Perempuan',
      alamat: 'Dusun Gonis Rabu Desa Rangkang Sungkung',
      no_ktp: '6109010805890004',
      tempat_lahir: 'Sanggau',
      tanggal_lahir: '1990-03-15',
      no_kk: '6109011711110022',
      status_perkawinan: 'Kawin',
      ktp_file: '/images/sample-ktp.jpg',
      kk_file: '/images/sample-kk.jpg',
    },
  ],
};

const PekerjaService = {
  // Get list of pekerja with pagination and filters
  getListPekerja: async (params = '') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Parse query parameters
    const urlParams = new URLSearchParams(params);
    const page = parseInt(urlParams.get('page') || '1');
    const pageSize = parseInt(urlParams.get('page_size') || '10');
    const search = urlParams.get('search') || '';
    const kelompok = urlParams.get('kelompok') || '';
    
    // Filter data based on search and kelompok
    let filteredData = [...mockPekerjaData];
    
    if (search) {
      filteredData = filteredData.filter(item =>
        item.nama_petani.toLowerCase().includes(search.toLowerCase()) ||
        item.id_petani.toLowerCase().includes(search.toLowerCase()) ||
        item.kelompok.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (kelompok) {
      filteredData = filteredData.filter(item =>
        item.kelompok.toLowerCase().includes(kelompok.toLowerCase())
      );
    }
    
    // Calculate pagination
    const totalCount = filteredData.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const results = filteredData.slice(startIndex, endIndex);
    
    return {
      data: {
        status: 'success',
        data: {
          results,
          count: totalCount,
          page,
          page_size: pageSize,
          total_pages: Math.ceil(totalCount / pageSize),
        },
      },
    };
  },

  // Get pekerja by ID
  getPekerjaById: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const pekerja = mockPekerjaData.find(p => p.id === parseInt(id));
    if (!pekerja) {
      throw new Error('Pekerja not found');
    }
    
    return {
      data: {
        status: 'success',
        data: {
          ...pekerja,
          identitas_pekerja: mockPekerjaDetail.identitas_pekerja,
        },
      },
    };
  },

  // Create new pekerja
  createPekerja: async (pekerjaData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      data: {
        status: 'success',
        data: {
          id: mockPekerjaData.length + 1,
          ...pekerjaData,
          updated_at: new Date().toISOString(),
        },
      },
    };
  },

  // Update pekerja
  updatePekerja: async (id, pekerjaData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      data: {
        status: 'success',
        data: {
          id: parseInt(id),
          ...pekerjaData,
          updated_at: new Date().toISOString(),
        },
      },
    };
  },

  // Delete pekerja
  deletePekerja: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: {
        status: 'success',
        message: 'Pekerja deleted successfully',
      },
    };
  },

  // Export pekerja data
  exportPekerja: async (params = '') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock blob for Excel export
    const csvContent = 'Id Petani,Nama Petani,Jenis Kelamin,Kelompok,No. KTP,No. KK,Luas Kebun,Jumlah Pekerja\n' +
      mockPekerjaData.map(p => 
        `${p.id_petani},${p.nama_petani},${p.jenis_kelamin},${p.kelompok},${p.no_ktp},${p.no_kk},${p.luas_kebun},${p.jumlah_pekerja}`
      ).join('\n');
    
    return new Blob([csvContent], { type: 'text/csv' });
  },
};

export default PekerjaService;
