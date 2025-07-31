import { useState } from 'react';

import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';
const ModalKonfirmasiRekomendasiTerbitSTDB = ({ open, setOpen, onSubmit, namaPekebun, jumlahKebun }) => {
  const [loading, setLoading] = useState(false);

  const handleOnClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await onSubmit();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal className='!w-[400px]' open={open} onclose={handleOnClose} label='UBAH KE PENDATAAN'>
      <div className='flex flex-col gap-4 pt-4'>
        <span className='text-[14px]'>
          Apakah Anda ingin mengubah data <b>{namaPekebun}</b> dengan <b>jumlah kebun {jumlahKebun}</b> kembali ke{' '}
          <b>Pendataan</b>?
        </span>
      </div>
      <div className='mt-4 flex flex-row justify-end gap-2'>
        <Button isLoading={loading} onClick={() => setOpen(false)} className='bg-red-500'>
          Batalkan
        </Button>
        <Button isLoading={loading} onClick={handleSubmit}>
          Ya, Ubah ke Pendataan
        </Button>
      </div>
    </Modal>
  );
};

export default ModalKonfirmasiRekomendasiTerbitSTDB;
