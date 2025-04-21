import Link from 'next/link';

const OtomotifLandingPage = () => {
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <div className=' mt-10 text-center'>
        <h1 className='mb-4 text-4xl font-bold'>Lindungi Kendaraan Anda, Lindungi Masa Depan Anda</h1>
        <p className='mb-8 text-lg'>
          Dapatkan perlindungan asuransi yang komprehensif untuk kendaraan Anda dan berkendara dengan tenang.
        </p>
      </div>
      <Link href='/id/polis/register'>
        <button className='z-3 mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'>
          Daftar Polis
        </button>
      </Link>
    </div>
  );
};

export default OtomotifLandingPage;
