'use client'; // if using App Router

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { Polygon, Popup, useMap } from 'react-leaflet';

import Close from '@/components/atoms/Icons/Close';
import STDBStatusChip from '@/components/atoms/STDBStatusChip';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import convertCoordsToDMS from '@/libs/utils/convertCoordToDMS';

function cleanCoordinates(multiPolygon) {
  if (!Array.isArray(multiPolygon)) return [];

  return multiPolygon
    .map((polygon) =>
      Array.isArray(polygon)
        ? polygon
            .map(
              (ring) =>
                ring
                  .filter(
                    (coord) =>
                      Array.isArray(coord) &&
                      coord.length >= 2 &&
                      typeof coord[0] === 'number' &&
                      typeof coord[1] === 'number'
                  )
                  .map((coord) => [coord[0], coord[1]]) // convert [lng, lat] → [lat, lng]
            )
            .filter((ring) => ring.length > 2) // valid ring
        : []
    )
    .filter((polygon) => polygon.length > 0); // valid polygon
}

const colorObject = {
  1: {
    key: 'sipekebun-desa',
    pathOptions: {
      fill: '#C0C0C0',
      fillOpacity: 0,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      weight: 1,
    },
  },
  2: {
    key: 'sipekebun-desa',
    pathOptions: {
      color: `#7A7A7A`,
      dashArray: '2 6',
      dashOffset: '1',
      lineCap: 'square',
      weight: 1,
      fillOpacity: 0,
    },
  },
  3: {
    key: 'sipekebun-kecamatan',
    pathOptions: {
      color: `#7A7A7A`,
      fillOpacity: 0,
      lineCap: 'square',
      lineJoin: 'square',
      dashArray: '2 4 2 4 10 4',
      dashOffset: '1',
      weight: 1,
    },
  },
  4: {
    key: 'sipekebun-kecamatan',
    pathOptions: {
      fillColor: '#9B4E23',
      stroke: true,
      fillOpacity: 1,
      color: `#654230`,
      weight: 1,
    },
  },
  5: {
    key: 'sipekebun-kecamatan',
    pathOptions: {
      fillColor: '#C93D80',
      fillOpacity: 1,
      border: false,
      weight: 0,
    },
  },
};

function ClosePopupButton() {
  const map = useMap();

  const handleClose = () => {
    map.closePopup(); // closes the currently opened popup
  };

  return <Close onClick={handleClose} />;
}

export default function IupMap({ data }) {
  const [polygons, setPolygons] = useState([]);

  useEffect(() => {
    if (typeof data !== 'object' || data == null) return;
    const tempArray = [];
    Object?.keys(data).map((params, idx, array) => {
      tempArray.push({
        ...data[params],
      });
    });

    const tempPolygons = [];
    tempArray.map((staticLayer, idx) => {
      const features = staticLayer?.geom?.features || [];

      const parsedPolygons = features
        .filter((feature) => feature?.geometry)
        .flatMap((feature) => {
          const geometry = feature.geometry;
          if (geometry?.type === 'MultiPolygon' && Array.isArray(geometry.coordinates)) {
            const filteredCoordinates = geometry.coordinates.filter((coord) => Array.isArray(coord));
            return { coordinates: cleanCoordinates(filteredCoordinates), properties: feature.properties };
          }
          return [];
        });

      tempPolygons.push({
        polygons: parsedPolygons,
        id: staticLayer.id,
      });
    });
    console.log('TEMP POLYGON', tempPolygons);
    setPolygons(tempPolygons);
  }, [data]);

  return (
    <>
      {polygons.map((staticLayer, idx) =>
        staticLayer?.polygons?.map((polygon) => {
          console.log('POLYGON', polygon);
          return polygon?.coordinates?.map((ring, ringIdx) => {
            return (
              <Polygon
                key={`${idx}-${ringIdx}`}
                pathOptions={colorObject[staticLayer.id].pathOptions}
                positions={ring?.[0]?.map((coords) => [coords[1], [coords[0]]])}
              >
                <Popup closeButton={false}>
                  <div className='w-full'>
                    <div className='flex h-[32px] items-center justify-between '>
                      <Paragraph className='font-bold ' level={2}>
                        DETAIL
                      </Paragraph>
                      <ClosePopupButton />
                    </div>
                    <div className='w-[500px]'>
                      <div className='grid grid-cols-3'>
                        <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-4'>
                          <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Titik koordinat</Paragraph>
                          <Paragraph className='!m-0 text-[16px]'>
                            {data?.peta?.titik_koordinat?.coordinates?.[0] && data?.peta?.titik_koordinat?.coordinates?.[1]
                              ? convertCoordsToDMS(
                                  data.peta.titik_koordinat.coordinates[0],
                                  data.peta.titik_koordinat.coordinates[1]
                                )
                              : 'N/A'}
                          </Paragraph>
                        </div>
                        <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                          <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>ID Kebun</Paragraph>
                          <Paragraph className='!m-0 text-[14px]'>{polygon?.properties?.nama}</Paragraph>
                        </div>
                        <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                          <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Status Lahan</Paragraph>
                          <Paragraph className='!m-0 text-[14px]'>{ring?.lahan?.status_lahan_label}</Paragraph>
                        </div>
                        <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                          <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Komoditas</Paragraph>
                          <Paragraph className='!m-0 text-[14px]'>{ring?.komoditas_info}</Paragraph>
                        </div>
                        <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                          <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Luas Lahan (m2)</Paragraph>
                          <Paragraph className='!m-0 text-[14px]'>{ring?.lahan?.luas_lahan}</Paragraph>
                        </div>
                        <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                          <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Kecamatan</Paragraph>
                          <Paragraph className='!m-0 text-[14px]'>{ring?.lahan?.kecamatan_label}</Paragraph>
                        </div>
                        <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                          <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Kelurahan</Paragraph>
                          <Paragraph className='!m-0 text-[14px]'>{ring?.lahan?.desa_label}</Paragraph>
                        </div>
                        <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                          <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>ring Peta</Paragraph>
                          <Paragraph
                            className={`!m-0 text-[14px] font-bold ${
                              ring?.peta?.geom?.coordinates?.length > 0 ? 'text-primary' : ' text-red-900'
                            }`}
                          >
                            {ring?.peta?.geom?.coordinates?.length > 0 ? 'Ada' : 'Tidak Ada'}
                          </Paragraph>
                        </div>
                        <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                          <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Pekebun</Paragraph>
                          <Paragraph className='!m-0 text-[14px]'>{ring?.pekebun?.nama}</Paragraph>
                        </div>
                        <div className='border-b-1 flex flex-col items-start gap-1 border-b border-dashed py-4 pr-8'>
                          <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>STDB Terbit</Paragraph>
                          <STDBStatusChip value={ring?.status_stdb} label={ring?.status_stdb_label} />
                        </div>
                      </div>
                      <div className='absolute bottom-6 right-6'>
                        <Link href={`/mapview`}>
                          <div className='flex flex-row items-center gap-2 self-end text-primary'>
                            Lihat selengkapnya
                            <ArrowRightIcon size={12} />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          });
        })
      )}
    </>
  );
}
