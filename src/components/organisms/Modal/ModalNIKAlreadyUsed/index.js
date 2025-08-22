import { useRouter } from 'next/navigation';

import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';

const ModalNIKAlreadyUsed = ({ open, setOpen, nik, idPekebun }) => {
  const router = useRouter();
  const handleOnClose = () => setOpen(false);

  const handleLihatDetail = () => {
    setOpen(false);
    router.push(`/stdb/pendataan/${idPekebun}/detail`);
  };

  return (
    <Modal open={open} onclose={handleOnClose} className="!w-[400px]" label="DATA PEKEBUN SUDAH ADA">
      <div className="gap-6 py-2 text-[14px]">
        <p>
          Data pekebun dengan <b>NIK {nik}</b> sudah ada di dalam sistem.
        </p>
        <p className="mt-4">
          Pilih <b>Lihat Detail</b> untuk memastikan apakah data tersebut sesuai dengan yang kamu cari.
        </p>
        <p className="mt-4">
          Pilih <b>Batalkan</b> dan Cek NIK jika kamu ingin memverifikasi atau memasukkan NIK yang berbeda.
        </p>
      </div>
      <div className="mt-4 flex flex-row justify-end gap-2">
        <Button onClick={handleOnClose} className="bg-red-500">
          Batalkan
        </Button>
        <Button onClick={handleLihatDetail} className="bg-green-700">
          Lihat Detail
        </Button>
      </div>
    </Modal>
  );
};

export default ModalNIKAlreadyUsed;
