/**
 * WhatsApp Utility Functions
 */

// Phone number formatting utilities
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';

  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Handle Indonesian numbers
  if (cleaned.startsWith('08')) {
    return `62${cleaned.substring(1)}`;
  }

  if (cleaned.startsWith('8')) {
    return `62${cleaned}`;
  }

  if (cleaned.startsWith('62')) {
    return cleaned;
  }

  // For other country codes, return as is
  return cleaned;
};

export const displayPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';

  const cleaned = phoneNumber.replace(/\D/g, '');

  // Convert back to Indonesian format for display
  if (cleaned.startsWith('62')) {
    return `0${cleaned.substring(2)}`;
  }

  return phoneNumber;
};

export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;

  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if it's a valid Indonesian number
  if (
    cleaned.startsWith('62') &&
    cleaned.length >= 11 &&
    cleaned.length <= 15
  ) {
    return true;
  }

  if (
    cleaned.startsWith('08') &&
    cleaned.length >= 10 &&
    cleaned.length <= 14
  ) {
    return true;
  }

  return false;
};

// Device status utilities
export const getDeviceStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'connected':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        dot: 'bg-green-500',
      };
    case 'connecting':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        dot: 'bg-yellow-500',
      };
    case 'disconnected':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        dot: 'bg-red-500',
      };
    case 'error':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        dot: 'bg-red-500',
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        dot: 'bg-gray-500',
      };
  }
};

export const getDeviceStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case 'connected':
      return 'Terhubung';
    case 'connecting':
      return 'Menghubungkan';
    case 'disconnected':
      return 'Tidak Terhubung';
    case 'error':
      return 'Error';
    default:
      return 'Unknown';
  }
};

// Message utilities
export const truncateMessage = (message, maxLength = 100) => {
  if (!message) return '';

  if (message.length <= maxLength) return message;

  return message.substring(0, maxLength) + '...';
};

export const validateMessage = (message) => {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Pesan tidak boleh kosong' };
  }

  if (message.length > 4096) {
    return {
      valid: false,
      error: 'Pesan terlalu panjang (maksimal 4096 karakter)',
    };
  }

  return { valid: true, error: null };
};

// QR Code utilities
export const generateDeviceQRData = (device) => {
  return {
    device_id: device.device_id,
    name: device.name,
    phone_number: device.phone_number,
    timestamp: new Date().toISOString(),
    connection_url: `${process.env.NEXT_PUBLIC_WHATSAPP_URL}/connect/${device.device_id}`,
    app_name: process.env.NEXT_PUBLIC_APP_NAME || 'WhatsApp Manager',
  };
};

// Device ID utilities
export const generateDeviceId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `DV-${timestamp}-${random}`;
};

export const validateDeviceId = (deviceId) => {
  if (!deviceId) return false;

  // Device ID should be alphanumeric with dashes, 3-20 characters
  const regex = /^[A-Z0-9\-]{3,20}$/;
  return regex.test(deviceId);
};

// Date/Time utilities
export const formatLastConnected = (dateString) => {
  if (!dateString) return 'Belum pernah';

  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return 'Baru saja';
  if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam lalu`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} hari lalu`;

  return date.toLocaleDateString('id-ID');
};

// Campaign utilities
export const getCampaignStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'running':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
      };
    case 'paused':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
      };
    case 'completed':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
      };
    case 'failed':
    case 'error':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
      };
    case 'draft':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
      };
  }
};

export const getCampaignStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'running':
      return 'Berjalan';
    case 'paused':
      return 'Dijeda';
    case 'completed':
      return 'Selesai';
    case 'failed':
    case 'error':
      return 'Gagal';
    case 'draft':
      return 'Draft';
    default:
      return 'Unknown';
  }
};

// File utilities for media upload
export const validateMediaFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/avi',
    'audio/mpeg',
    'audio/wav',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (!file) {
    return { valid: false, error: 'File tidak boleh kosong' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Ukuran file terlalu besar (maksimal 10MB)' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipe file tidak didukung' };
  }

  return { valid: true, error: null };
};

export const getFileTypeIcon = (fileType) => {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType.startsWith('video/')) return '🎥';
  if (fileType.startsWith('audio/')) return '🎵';
  if (fileType === 'application/pdf') return '📄';
  if (fileType.includes('word')) return '📝';
  return '📎';
};

// Contact utilities
export const validateContactData = (contact) => {
  const errors = {};

  if (!contact.name || contact.name.trim().length === 0) {
    errors.name = 'Nama tidak boleh kosong';
  }

  if (!contact.phone_number || !validatePhoneNumber(contact.phone_number)) {
    errors.phone_number = 'Nomor telepon tidak valid';
  }

  if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    errors.email = 'Format email tidak valid';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Template utilities
export const parseMessageTemplate = (template, variables = {}) => {
  if (!template) return '';

  let message = template;

  // Replace variables in format {{variable_name}}
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    message = message.replace(regex, variables[key] || '');
  });

  return message;
};

export const extractTemplateVariables = (template) => {
  if (!template) return [];

  const matches = template.match(/\{\{([^}]+)\}\}/g) || [];
  return matches.map((match) => match.replace(/\{\{|\}\}/g, ''));
};

// Error handling utilities
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Terjadi kesalahan yang tidak diketahui';
};

// Local storage utilities for device management
export const saveDeviceToLocal = (device) => {
  try {
    const devices = getDevicesFromLocal();
    const existingIndex = devices.findIndex((d) => d.id === device.id);

    if (existingIndex >= 0) {
      devices[existingIndex] = device;
    } else {
      devices.push(device);
    }

    localStorage.setItem('whatsapp_devices', JSON.stringify(devices));
    return true;
  } catch (error) {
    console.error('Error saving device to local storage:', error);
    return false;
  }
};

export const getDevicesFromLocal = () => {
  try {
    const devices = localStorage.getItem('whatsapp_devices');
    return devices ? JSON.parse(devices) : [];
  } catch (error) {
    console.error('Error getting devices from local storage:', error);
    return [];
  }
};

export const removeDeviceFromLocal = (deviceId) => {
  try {
    const devices = getDevicesFromLocal();
    const filteredDevices = devices.filter((d) => d.id !== deviceId);
    localStorage.setItem('whatsapp_devices', JSON.stringify(filteredDevices));
    return true;
  } catch (error) {
    console.error('Error removing device from local storage:', error);
    return false;
  }
};

export default {
  formatPhoneNumber,
  displayPhoneNumber,
  validatePhoneNumber,
  getDeviceStatusColor,
  getDeviceStatusText,
  truncateMessage,
  validateMessage,
  generateDeviceQRData,
  generateDeviceId,
  validateDeviceId,
  formatLastConnected,
  getCampaignStatusColor,
  getCampaignStatusText,
  validateMediaFile,
  getFileTypeIcon,
  validateContactData,
  parseMessageTemplate,
  extractTemplateVariables,
  getErrorMessage,
  saveDeviceToLocal,
  getDevicesFromLocal,
  removeDeviceFromLocal,
};
