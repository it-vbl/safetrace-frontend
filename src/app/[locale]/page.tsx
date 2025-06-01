'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';

const OtomotifLandingPage = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/organisms/MapView'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div className='m-0 h-screen w-screen'>
      <Map />
    </div>
  );
};

export default OtomotifLandingPage;
