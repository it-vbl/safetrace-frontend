'use client'; // if using App Router

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { Polygon, Popup, useMap } from 'react-leaflet';

import Close from '@/components/atoms/Icons/Close';
import STDBStatusChip from '@/components/atoms/STDBStatusChip';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import convertCoordsToDMS from '@/libs/utils/convertCoordToDMS';
import { getColorOptions } from './colorConfig';

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
          if (
            geometry?.type === 'MultiPolygon' &&
            Array.isArray(geometry.coordinates)
          ) {
            const filteredCoordinates = geometry.coordinates.filter((coord) =>
              Array.isArray(coord)
            );
            return {
              coordinates: cleanCoordinates(filteredCoordinates),
              properties: feature.properties,
            };
          }
          return [];
        });

      tempPolygons.push({
        polygons: parsedPolygons,
        id: staticLayer.id,
      });
    });
    setPolygons(tempPolygons);
  }, [data]);

  return (
    <>
      {polygons.map((staticLayer, idx) =>
        staticLayer?.polygons?.map((polygon) => {
          return polygon?.coordinates?.map((ring, ringIdx) => {
            return (
              <Polygon
                key={`${idx}-${ringIdx}`}
                pathOptions={getColorOptions(staticLayer.id).pathOptions}
                positions={ring?.[0]?.map((coords) => [coords[1], [coords[0]]])}
              >
                <Popup closeButton={false}>
                  <div className="w-full">
                    <div className="flex h-[32px] items-center justify-between ">
                      <Paragraph className="font-bold " level={2}>
                        DETAIL
                      </Paragraph>
                      <ClosePopupButton />
                    </div>
                    <div className="w-[500px]">
                      <div className="grid grid-cols-3">
                        <div className="border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8">
                          <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                            Nama
                          </Paragraph>
                          <Paragraph className="!m-0 text-[14px]">
                            {polygon?.properties?.nama || '-'}
                          </Paragraph>
                        </div>
                        <div className="border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8">
                          <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                            Nomor SK
                          </Paragraph>
                          <Paragraph className="!m-0 text-[14px]">
                            {polygon?.properties?.NOMORSK || '-'}
                          </Paragraph>
                        </div>
                        <div className="border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8">
                          <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                            Komoditas
                          </Paragraph>
                          <Paragraph className="!m-0 text-[14px]">
                            {polygon?.properties?.KOMODITAS || '-'}
                          </Paragraph>
                        </div>
                        <div className="border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8">
                          <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                            Luas Lahan (m2)
                          </Paragraph>
                          <Paragraph className="!m-0 text-[14px]">
                            {polygon?.properties?.ha || '-'}
                          </Paragraph>
                        </div>
                        <div className="border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8">
                          <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                            Kecamatan
                          </Paragraph>
                          <Paragraph className="!m-0 text-[14px]">
                            {polygon?.properties?.disctrict_id || '-'}
                          </Paragraph>
                        </div>
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
