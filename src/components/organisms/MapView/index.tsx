// src/components/Map.tsx
import { MapContainer, Polygon, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import Close from '@/components/atoms/Icons/Close';
import { useEffect, useMemo, useRef, useState } from 'react';
import '@/styles/globals.css';
import './map.css';

function ClosePopupButton() {
  const map = useMap();

  const handleClose = () => {
    map.closePopup(); // closes the currently opened popup
  };

  return <Close onClick={handleClose} />;
}

function MapCenterUpdater({ position, zoom = 12 }: { position: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, zoom);
  }, [position, map]);

  return null;
}

export default function MyMap(props: any) {
  const mapRef = useRef(null);
  const { position = [-0.5, 114.9], zoom = 7, data = [], activeDataId } = props;
  const [openPopupId, setOpenPopupId] = useState<string | null>(null);

  const closePopup = () => {
    if (!mapRef.current) return;
    mapRef.current.popupclose();
    // map.closePopup();
  };

  return (
    <MapContainer /// <reference path="" />
      className='h-[calc(100dvh-72px)] w-full'
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      ref={mapRef}
    >
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      <MapCenterUpdater position={position} />
      {data?.map((data: any) => {
        return (
          <Polygon
            key={data?.id}
            eventHandlers={{
              click: () => setOpenPopupId(data?.id),
            }}
            positions={data?.polygonCoords}
            pathOptions={{ color: data.id == activeDataId ? 'green' : 'red', fillOpacity: 0.4 }}
          >
            <Popup closeButton={false}>
              <div className='w-full'>
                {/* Header */}
                <div className='flex w-full items-center justify-between'>
                  <Paragraph>DETAIL</Paragraph>
                  <ClosePopupButton />
                </div>
                <div className='w-[400px]'>
                  <div className='grid grid-cols-3'>
                    <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-4'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Titik koordinat</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>{data?.coordinate}</Paragraph>
                    </div>
                    <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-8'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>ID Kebun</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>{data?.id}</Paragraph>
                    </div>
                    <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-8'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Status Lahan</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>3°5'18"N, 103°15'12"E</Paragraph>
                    </div>
                    <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-8'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Komoditas</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>{data?.komoditas}</Paragraph>
                    </div>
                    <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-8'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Luas Lahan (m2)</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>{data?.luas_lahan}</Paragraph>
                    </div>
                    <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-8'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Kecamatan</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>{data?.kecamatan}</Paragraph>
                    </div>
                    <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-8'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Kelurahan</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>{data?.kelurahan}</Paragraph>
                    </div>
                    <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-8'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Data Peta</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>{data?.data_peta}</Paragraph>
                    </div>
                    <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-8'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Pekebun</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>{data?.pekebun}</Paragraph>
                    </div>
                  </div>
                </div>
                {/* <div className='flex flex-col gap-4'>
                  <div className='flex gap-4'>
                    <div className='flex flex-col gap-1'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Titik koordinat</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>{data?.coordinate}</Paragraph>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>ID Kebun</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>{data?.id}</Paragraph>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Status Lahan</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>3°5'18"N, 103°15'12"E</Paragraph>
                    </div>
                  </div>
                  <div className='flex gap-4'>
                    <div className='flex flex-col gap-1'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Komoditas</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>3°5'18"N, 103°15'12"E</Paragraph>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Luas Lahan (m2)</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>3°5'18"N, 103°15'12"E</Paragraph>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Kecamatan</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>3°5'18"N, 103°15'12"E</Paragraph>
                    </div>
                  </div>
                  <div className='flex gap-4'>
                    <div className='flex flex-col gap-1'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Kelurahan</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>3°5'18"N, 103°15'12"E</Paragraph>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Data Peta</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>3°5'18"N, 103°15'12"E</Paragraph>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <Paragraph className='!m-0 text-[12px] font-bold'>Pekebun</Paragraph>
                      <Paragraph className='!m-0 text-[16px]'>3°5'18"N, 103°15'12"E</Paragraph>
                    </div>
                  </div>
                </div> */}
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </MapContainer>
  );
}
