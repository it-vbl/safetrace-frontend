import api from './api';

const WhatsAppService = {
  // Device Management
  getDevices: (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      page_size: params.page_size || 10,
      search: params.search || '',
    };
    return api.get('/whatsapp/devices', { params: queryParams });
  },

  createDevice: (deviceData) => {
    return api.post('/whatsapp/devices', null, deviceData);
  },

  updateDevice: (deviceId, deviceData) => {
    return api.put(`/whatsapp/devices/${deviceId}`, null, deviceData);
  },

  deleteDevice: (deviceId) => {
    return api.delete(`/whatsapp/devices/${deviceId}`);
  },

  getDeviceById: (deviceId) => {
    return api.get(`/whatsapp/devices/${deviceId}`);
  },

  // Device Connection & Status
  connectDevice: (deviceId) => {
    return api.post(`/whatsapp/devices/${deviceId}/connect`);
  },

  disconnectDevice: (deviceId) => {
    return api.post(`/whatsapp/devices/${deviceId}/disconnect`);
  },

  getDeviceStatus: (deviceId) => {
    return api.get(`/whatsapp/devices/${deviceId}/status`);
  },

  generateQRCode: (deviceId) => {
    return api.get(`/whatsapp/devices/${deviceId}/qr`);
  },

  // Device Logs
  getDeviceLogs: (deviceId, params = {}) => {
    const queryParams = {
      page: params.page || 1,
      page_size: params.page_size || 10,
      date_from: params.date_from || '',
      date_to: params.date_to || '',
    };
    return api.get(`/whatsapp/devices/${deviceId}/logs`, {
      params: queryParams,
    });
  },

  // Message Management
  sendMessage: (deviceId, messageData) => {
    return api.post(
      `/whatsapp/devices/${deviceId}/send-message`,
      null,
      messageData
    );
  },

  sendBulkMessage: (deviceId, bulkMessageData) => {
    return api.post(
      `/whatsapp/devices/${deviceId}/send-bulk-message`,
      null,
      bulkMessageData
    );
  },

  getMessageHistory: (deviceId, params = {}) => {
    const queryParams = {
      page: params.page || 1,
      page_size: params.page_size || 10,
      date_from: params.date_from || '',
      date_to: params.date_to || '',
      status: params.status || '',
    };
    return api.get(`/whatsapp/devices/${deviceId}/messages`, {
      params: queryParams,
    });
  },

  getMessageStatus: (deviceId, messageId) => {
    return api.get(
      `/whatsapp/devices/${deviceId}/messages/${messageId}/status`
    );
  },

  // Blast Message Campaign
  createCampaign: (campaignData) => {
    return api.post('/whatsapp/campaigns', null, campaignData);
  },

  getCampaigns: (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      page_size: params.page_size || 10,
      search: params.search || '',
      status: params.status || '',
    };
    return api.get('/whatsapp/campaigns', { params: queryParams });
  },

  getCampaignById: (campaignId) => {
    return api.get(`/whatsapp/campaigns/${campaignId}`);
  },

  updateCampaign: (campaignId, campaignData) => {
    return api.put(`/whatsapp/campaigns/${campaignId}`, null, campaignData);
  },

  deleteCampaign: (campaignId) => {
    return api.delete(`/whatsapp/campaigns/${campaignId}`);
  },

  startCampaign: (campaignId) => {
    return api.post(`/whatsapp/campaigns/${campaignId}/start`);
  },

  pauseCampaign: (campaignId) => {
    return api.post(`/whatsapp/campaigns/${campaignId}/pause`);
  },

  stopCampaign: (campaignId) => {
    return api.post(`/whatsapp/campaigns/${campaignId}/stop`);
  },

  getCampaignReport: (campaignId) => {
    return api.get(`/whatsapp/campaigns/${campaignId}/report`);
  },

  // Contact Management
  getContacts: (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      page_size: params.page_size || 10,
      search: params.search || '',
      group_id: params.group_id || '',
    };
    return api.get('/whatsapp/contacts', { params: queryParams });
  },

  createContact: (contactData) => {
    return api.post('/whatsapp/contacts', null, contactData);
  },

  updateContact: (contactId, contactData) => {
    return api.put(`/whatsapp/contacts/${contactId}`, null, contactData);
  },

  deleteContact: (contactId) => {
    return api.delete(`/whatsapp/contacts/${contactId}`);
  },

  importContacts: (importData) => {
    return api.postData('/whatsapp/contacts/import', importData);
  },

  exportContacts: (params = {}) => {
    return api.get('/whatsapp/contacts/export', { params });
  },

  // Contact Groups
  getContactGroups: (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      page_size: params.page_size || 10,
      search: params.search || '',
    };
    return api.get('/whatsapp/contact-groups', { params: queryParams });
  },

  createContactGroup: (groupData) => {
    return api.post('/whatsapp/contact-groups', null, groupData);
  },

  updateContactGroup: (groupId, groupData) => {
    return api.put(`/whatsapp/contact-groups/${groupId}`, null, groupData);
  },

  deleteContactGroup: (groupId) => {
    return api.delete(`/whatsapp/contact-groups/${groupId}`);
  },

  // Templates
  getTemplates: (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      page_size: params.page_size || 10,
      search: params.search || '',
      category: params.category || '',
    };
    return api.get('/whatsapp/templates', { params: queryParams });
  },

  createTemplate: (templateData) => {
    return api.post('/whatsapp/templates', null, templateData);
  },

  updateTemplate: (templateId, templateData) => {
    return api.put(`/whatsapp/templates/${templateId}`, null, templateData);
  },

  deleteTemplate: (templateId) => {
    return api.delete(`/whatsapp/templates/${templateId}`);
  },

  getTemplateById: (templateId) => {
    return api.get(`/whatsapp/templates/${templateId}`);
  },

  // Media Management
  uploadMedia: (mediaData) => {
    return api.postData('/whatsapp/media/upload', mediaData);
  },

  getMediaList: (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      page_size: params.page_size || 10,
      type: params.type || '', // image, video, audio, document
    };
    return api.get('/whatsapp/media', { params: queryParams });
  },

  deleteMedia: (mediaId) => {
    return api.delete(`/whatsapp/media/${mediaId}`);
  },

  // Webhook & Settings
  getWebhookSettings: () => {
    return api.get('/whatsapp/webhook/settings');
  },

  updateWebhookSettings: (webhookData) => {
    return api.put('/whatsapp/webhook/settings', null, webhookData);
  },

  testWebhook: (webhookUrl) => {
    return api.post('/whatsapp/webhook/test', null, {
      webhook_url: webhookUrl,
    });
  },

  // Analytics & Reports
  getDashboardStats: (params = {}) => {
    const queryParams = {
      date_from: params.date_from || '',
      date_to: params.date_to || '',
      device_id: params.device_id || '',
    };
    return api.get('/whatsapp/analytics/dashboard', {
      params: queryParams,
    });
  },

  getMessageStats: (params = {}) => {
    const queryParams = {
      date_from: params.date_from || '',
      date_to: params.date_to || '',
      device_id: params.device_id || '',
      group_by: params.group_by || 'day', // day, week, month
    };
    return api.get('/whatsapp/analytics/messages', {
      params: queryParams,
    });
  },

  getCampaignStats: (campaignId, params = {}) => {
    const queryParams = {
      date_from: params.date_from || '',
      date_to: params.date_to || '',
    };
    return api.get(`/whatsapp/analytics/campaigns/${campaignId}`, {
      params: queryParams,
    });
  },

  // Auto Reply
  getAutoReplies: (deviceId, params = {}) => {
    const queryParams = {
      page: params.page || 1,
      page_size: params.page_size || 10,
      search: params.search || '',
      status: params.status || '',
    };
    return api.get(`/whatsapp/devices/${deviceId}/auto-replies`, {
      params: queryParams,
    });
  },

  createAutoReply: (deviceId, autoReplyData) => {
    return api.post(
      `/whatsapp/devices/${deviceId}/auto-replies`,
      null,
      autoReplyData
    );
  },

  updateAutoReply: (deviceId, autoReplyId, autoReplyData) => {
    return api.put(
      `/whatsapp/devices/${deviceId}/auto-replies/${autoReplyId}`,
      null,
      autoReplyData
    );
  },

  deleteAutoReply: (deviceId, autoReplyId) => {
    return api.delete(
      `/whatsapp/devices/${deviceId}/auto-replies/${autoReplyId}`
    );
  },

  toggleAutoReply: (deviceId, autoReplyId, status) => {
    return api.put(
      `/whatsapp/devices/${deviceId}/auto-replies/${autoReplyId}/toggle`,
      null,
      { status }
    );
  },
};

export default WhatsAppService;
