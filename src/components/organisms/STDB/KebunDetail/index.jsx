'use client';

import { useEffect, useState } from 'react';

import Accordion from '@/components/molecules/Accordion';
import useDetailKebun from '@/hooks/useDetailKebun';

import DataKebun from '../DataKebun';

const KebunDetail = ({ index, item }) => {
  const [detailKebun, setDetailKebun] = useState(item);

  const { fetchDetailKebun } = useDetailKebun();

  const getDetailKebun = async () => {
    const response = await fetchDetailKebun(item?.id);
    const tempData = {
      ...response,
      peta: {
        ...response?.peta,
        geom: {
          ...response?.peta?.geom,
          coordinates: response?.peta?.geom?.coordinates?.[0]?.map((coord) => [coord[1], coord[0]]),
        },
        titik_koordinat: {
          ...response?.peta?.titik_koordinat,
          coordinates: [
            response?.peta?.titik_koordinat?.coordinates[1],
            response?.peta?.titik_koordinat?.coordinates[0],
          ],
        },
      },
    };
    setDetailKebun(tempData);
  };

  useEffect(() => {
    getDetailKebun();
  }, []);

  return (
    <Accordion key={index} title={`KEBUN KE - ${index + 1}`}>
      <DataKebun detailKebun={detailKebun} />
    </Accordion>
  );
};

export default KebunDetail;
