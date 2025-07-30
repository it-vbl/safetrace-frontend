import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';
import { useState } from 'react';

const ModalConfirmDeletePekebun = ({ open, setOpen, namaPekebun, jumlahKebun, handleSubmit }) => {
  const handleOnClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);

  const handleOnSubmit = async () => {
    try {
      console.log('TEST');
      setLoading(true);
      const res = await handleSubmit();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onclose={handleOnClose} className='!w-[400px]' label='HAPUS PEKEBUN'>
      <div className='gap-6 py-2'>
        <span className='text-[14px]'>
          Apakah Anda tidak ingin menerbitkan STDB atas nama <b>{namaPekebun}</b> dengan{' '}
          <b>jumlah kebun {jumlahKebun}</b>?
        </span>
      </div>
      <div className='mt-4 flex flex-row justify-end gap-2'>
        <Button isLoading={loading} onClick={() => setOpen(false)} className='bg-red-500'>
          Batalkan
        </Button>
        <Button isLoading={loading} onClick={handleOnSubmit}>
          Ya, Hapus Data
        </Button>
      </div>
    </Modal>
  );
};

export default ModalConfirmDeletePekebun;
