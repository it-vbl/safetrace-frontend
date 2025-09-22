import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import WhatsAppService from '../services/whatsapp';
import {
  getErrorMessage,
  saveDeviceToLocal,
  getDevicesFromLocal,
  removeDeviceFromLocal,
} from '@/utils/whatsapp';

const useDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalDevices, setTotalDevices] = useState(0);
  const [connectingDevices, setConnectingDevices] = useState(new Set());
  const [disconnectingDevices, setDisconnectingDevices] = useState(new Set());

  // Fetch devices from API or local storage
  const fetchDevices = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await WhatsAppService.getDevices(params);

      if (response?.data?.results) {
        setDevices(response.data.results);
        setTotalDevices(response.data.count || 0);

        // Save to local storage for offline access
        response.data.results.forEach((device) => {
          saveDeviceToLocal(device);
        });
      } else {
        // Fallback to local storage
        const localDevices = getDevicesFromLocal();
        const { page = 1, page_size = 10, search = '' } = params;

        let filteredDevices = localDevices;
        if (search) {
          filteredDevices = localDevices.filter(
            (device) =>
              device.name?.toLowerCase().includes(search.toLowerCase()) ||
              device.device_id?.toLowerCase().includes(search.toLowerCase()) ||
              device.phone_number?.includes(search)
          );
        }

        const startIndex = (page - 1) * page_size;
        const pagedDevices = filteredDevices.slice(
          startIndex,
          startIndex + page_size
        );

        setDevices(pagedDevices);
        setTotalDevices(filteredDevices.length);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast.error(getErrorMessage(error));

      // Fallback to local storage
      const localDevices = getDevicesFromLocal();
      setDevices(localDevices);
      setTotalDevices(localDevices.length);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new device
  const createDevice = useCallback(async (deviceData) => {
    try {
      const response = await WhatsAppService.createDevice(deviceData);

      if (response?.data) {
        const newDevice = {
          ...response.data,
          status: 'disconnected',
          is_active: false,
        };

        setDevices((prev) => [newDevice, ...prev]);
        setTotalDevices((prev) => prev + 1);

        // Save to local storage
        saveDeviceToLocal(newDevice);
        toast.success('Device created successfully');
      }
    } catch (error) {
      console.error('Error creating device:', error);
      toast.error(getErrorMessage(error));
    }
  }, []);

  // Connect device
  const connectDevice = useCallback(async (deviceId) => {
    setConnectingDevices((prev) => new Set(prev).add(deviceId));
    try {
      const response = await WhatsAppService.connectDevice(deviceId);
      if (response?.data) {
        setDevices((prev) =>
          prev.map((device) =>
            device.id === deviceId
              ? {
                  ...device,
                  ...response.data,
                  status: 'connected',
                  is_active: true,
                }
              : device
          )
        );
        toast.success('Device connected successfully');
      }
    } catch (error) {
      console.error('Error connecting device:', error);
      toast.error(getErrorMessage(error));
    } finally {
      setConnectingDevices((prev) => {
        const updated = new Set(prev);
        updated.delete(deviceId);
        return updated;
      });
    }
  }, []);

  // Disconnect device
  const disconnectDevice = useCallback(async (deviceId) => {
    setDisconnectingDevices((prev) => new Set(prev).add(deviceId));
    try {
      const response = await WhatsAppService.disconnectDevice(deviceId);
      if (response?.data) {
        setDevices((prev) =>
          prev.map((device) =>
            device.id === deviceId
              ? {
                  ...device,
                  ...response.data,
                  status: 'disconnected',
                  is_active: false,
                }
              : device
          )
        );
        toast.success('Device disconnected successfully');
      }
    } catch (error) {
      console.error('Error disconnecting device:', error);
      toast.error(getErrorMessage(error));
    } finally {
      setDisconnectingDevices((prev) => {
        const updated = new Set(prev);
        updated.delete(deviceId);
        return updated;
      });
    }
  }, []);

  // Delete device
  const deleteDevice = useCallback(async (deviceId) => {
    try {
      await WhatsAppService.deleteDevice(deviceId);
      setDevices((prev) => prev.filter((device) => device.id !== deviceId));
      setTotalDevices((prev) => prev - 1);

      // Remove from local storage
      removeDeviceFromLocal(deviceId);
      toast.success('Device deleted successfully');
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error(getErrorMessage(error));
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    loading,
    totalDevices,
    connectingDevices,
    disconnectingDevices,
    fetchDevices,
    createDevice,
    connectDevice,
    disconnectDevice,
    deleteDevice,
  };
};

export default useDevices;
