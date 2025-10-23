'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputMessage from '@/components/molecules/InputMessage';
import Select from '@/components/molecules/Select';
import { getDeviceList } from '@/services/device';
import { getKontakList } from '@/services/kontak';
import { createPesan } from '@/services/pesan';
import WhatsAppService from '@/services/whatsapp';
import { formatPhoneNumber } from '@/utils/whatsapp';

const PesanBaruKirimPesanPage = () => {
  const router = useRouter();

  const breadcrumbItems = [
    { label: 'KIRIM PESAN', href: '/kabar-tani/kirim-pesan' },
    { label: 'PESAN BARU' },
  ];

  const [deviceOptions, setDeviceOptions] = useState([]);
  const [kontakOptions, setKontakOptions] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [loadingKontak, setLoadingKontak] = useState(false);

  const [noPengirim, setNoPengirim] = useState('');
  const [noPenerima, setNoPenerima] = useState('');

  // Tambahkan data mentah untuk pemetaan ID
  const [deviceData, setDeviceData] = useState([]);
  const [kontakData, setKontakData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(
    `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`
  );

  const fetchDevices = async () => {
    setLoadingDevices(true);
    try {
      const params = new URLSearchParams({ page: '1', page_size: '100' });
      const res = await getDeviceList(params);
      const data = res?.data?.data || res?.data || {};
      const results = data?.results || [];

      const mappedDevices = results.map((item) => ({
        id: item.id,
        id_device: item.id_device,
        nama: item.nama,
        no_wa: item.no_wa,
        terhubung: !!item.terhubung,
      }));

      const options = mappedDevices.map((d) => ({
        value: d.id_device,
        label: `${d?.nama ?? '-'} - ${d?.no_wa ?? '-'}`,
      }));

      setDeviceData(mappedDevices);
      setDeviceOptions(options);
      if (options.length > 0 && !noPengirim) {
        setNoPengirim(options[0].value);
      }
    } catch (err) {
      setDeviceData([]);
      setDeviceOptions([]);
      toast.error('Gagal mengambil daftar device');
    } finally {
      setLoadingDevices(false);
    }
  };

  const fetchKontak = async () => {
    setLoadingKontak(true);
    try {
      const res = await getKontakList({ page: 1, page_size: 100 });
      const data = res?.data?.data || res?.data || {};
      const results = data?.results || [];

      const mappedKontak = results
        .map((k) => ({
          id: k?.id ?? k?.id_kontak ?? k?.kontak_id,
          nama: k?.nama,
          no_wa: k?.no_wa || '',
        }))
        .filter((k) => k.id !== undefined && k.id !== null);

      const options = mappedKontak.map((k) => ({
        value: k.id,
        label: `${k?.nama ?? '-'} - ${k?.no_wa ?? '-'}`,
      }));

      setKontakData(mappedKontak);
      setKontakOptions(options);
      if (options.length > 0 && !noPenerima) {
        setNoPenerima(options[0].value);
      }
    } catch (err) {
      setKontakData([]);
      setKontakOptions([]);
      toast.error('Gagal mengambil daftar kontak');
    } finally {
      setLoadingKontak(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchKontak();
  }, []);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === 'no_pengirim') setNoPengirim(value);
    if (name === 'no_penerima') setNoPenerima(value);
  };

  const handleCancel = () => router.back();

  const handleSend = async () => {
    try {
      if (!noPengirim) {
        toast.error('Pilih No. Pengirim terlebih dahulu');
        return;
      }
      if (!noPenerima) {
        toast.error('Pilih No. Penerima terlebih dahulu');
        return;
      }
      if (!message || !message.trim()) {
        toast.error('Isi pesan tidak boleh kosong');
        return;
      }

      setIsSubmitting(true);

      const selectedDevice = deviceData.find(
        (d) => String(d.id_device) === String(noPengirim)
      );
      const selectedKontak = kontakData.find(
        (k) => String(k.id) === String(noPenerima)
      );

      const payload = {
        kontak: selectedKontak?.id,
        pesan: message,
        device: selectedDevice?.id,
        terkirim: true,
      };

      const response = await createPesan(payload);
      const ok =
        response?.status === 200 ||
        response?.status === 201 ||
        String(response?.data?.status || '').toLowerCase() === 'success';

      if (!ok) {
        const msg = response?.data?.message || 'Gagal membuat pesan';
        const errors = response?.data?.errors || {};
        const errText =
          errors?.kontak?.[0] || errors?.device?.[0] || errors?.pesan?.[0];
        toast.error(errText ? `${msg} - ${errText}` : msg);
        setIsSubmitting(false);
        return;
      }

      toast.success('Berhasil membuat pesan. Mengirim WhatsApp...');

      const formattedNumber = formatPhoneNumber(selectedKontak?.no_wa || '');

      const resWa = await WhatsAppService.sendPrivateMessage({
        deviceId: noPengirim,
        number: formattedNumber,
        message,
      });

      const status = resWa?.data?.status ?? resWa?.status;
      const sent =
        status === true ||
        String(status || '').toLowerCase() === 'success' ||
        String(status || '').toLowerCase() === 'sent';

      toast[sent ? 'success' : 'error'](
        sent ? 'Pesan WhatsApp terkirim' : 'Gagal mengirim pesan WhatsApp'
      );
      router.push('/kabar-tani/kirim-pesan');
    } catch (error) {
      console.error('Gagal kirim WhatsApp:', error);
      toast.error(
        error?.response?.data?.message ||
          'Terjadi kesalahan saat mengirim pesan'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full bg-gray-50">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-6 p-2">
        {/* Breadcrumb */}
        <BreadcrumbDetail items={breadcrumbItems} />

        {/* DETAIL Card */}
        <div className="rounded-[4px] border border-gray-200 bg-white">
          <Heading
            level={3}
            className="mb-4 mt-6 px-6 text-lg font-semibold text-gray-800"
          >
            DETAIL
          </Heading>

          <div className="mb-6 space-y-4 px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Select
                  label="No. Pengirim"
                  name="no_pengirim"
                  placeholder={
                    loadingDevices
                      ? 'Memuat perangkat...'
                      : 'Pilih device WhatsApp'
                  }
                  options={deviceOptions}
                  value={noPengirim}
                  onChange={handleSelectChange}
                  disabled={loadingDevices}
                />
                <span className="text-xs text-gray-400">
                  Pilih device WhatsApp yang akan digunakan untuk mengirim pesan
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <Select
                  label="No. Penerima"
                  name="no_penerima"
                  placeholder={
                    loadingKontak ? 'Memuat kontak...' : 'Pilih kontak penerima'
                  }
                  options={kontakOptions}
                  value={noPenerima}
                  onChange={handleSelectChange}
                  disabled={loadingKontak}
                  showSearchBar={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* PESAN Card */}
        <div className="rounded-[4px] border border-gray-200 bg-white">
          <Heading
            level={3}
            className="mb-4 mt-6 px-6 text-lg font-semibold text-gray-800"
          >
            PESAN
          </Heading>

          <div className="mb-6   px-6">
            <InputMessage
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              showCharCount
              charCountMax={160}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="danger" onClick={handleCancel}>
            Batalkan
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={isSubmitting}
            className={isSubmitting ? 'opacity-75' : ''}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Mengirim...
              </div>
            ) : (
              'Kirim Pesan'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PesanBaruKirimPesanPage;
