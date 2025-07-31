// src/components/Map.tsx
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import L from 'leaflet';
import { ArrowRightIcon } from 'lucide-react';
import { FeatureGroup, MapContainer, Polygon, Popup, TileLayer, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

import Close from '@/components/atoms/Icons/Close';
import STDBStatusChip from '@/components/atoms/STDBStatusChip';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import convertCoordsToDMS from '@/libs/utils/convertCoordToDMS';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import '@/styles/globals.css';
import './map.css';
import 'leaflet.pm/dist/leaflet.pm.css';

import 'leaflet-defaulticon-compatibility';
import 'leaflet.pm';

const tileLayers = {
  osm: {
    name: 'OpenStreetMap',
    type: 'base',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  light: {
    name: 'Light',
    type: 'base',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  dark: {
    name: 'Dark',
    type: 'base',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  satellite: {
    name: 'Satellite',
    type: 'base',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
};

const DrawControl = ({
  onCreate = (e) => {},
  onEditPath = (e) => {},
  onDeleted = (e) => {},
  disableDrawPolygon = true,
  disableEditDeletePath = true,
  polygons = [],
}) => {
  const editRef = useRef(null);
  const featureGroupRef = useRef(null);
  const setEditRef = (e) => {
    editRef.current = e;
  };

  function removeAllEditControlLayers() {
    var layerContainer = editRef.current.options.edit.featureGroup,
      layers = layerContainer._layers,
      layer_ids = Object.keys(layers),
      layer;

    layer_ids.forEach((id) => {
      console.log('LAYER ID', id);
      layer = layers[id];
      layerContainer.removeLayer(layer);
    });
  }

  useEffect(() => {
    // removeAllEditControlLayers();
  }, [disableDrawPolygon, disableEditDeletePath]);

  const drawPolygon = (polygons) => {
    if (!polygons || polygons.length == 0) return;
    if (featureGroupRef.current) {
      const layerGroup = featureGroupRef.current;
      removeAllEditControlLayers();
      polygons.forEach((coords) => {
        const layer = L.polygon(coords.coordinates);
        layerGroup.addLayer(layer);
      });
    }
  };

  useEffect(() => {
    drawPolygon(polygons);
  }, [polygons, featureGroupRef?.current]);

  return (
    <FeatureGroup onMounted={(a) => {}} ref={featureGroupRef}>
      <EditControl
        onMounted={setEditRef}
        position='topleft'
        onEditVertex={(e) => {
          console.log('EDITED VERTEXT', e);
          //   const tempCoords = Object.keys(e?.layers?._layers).map((key) => {
          //     return {
          //       lat: e?.layers?._layers?.[key]?._latlng?.lat,
          //       lng: e?.layers?._layers?.[key]?._latlng?.lng,
          //     };
          //   });
        }}
        draw={{
          polygon: !disableDrawPolygon
            ? {
                allowIntersection: false,
                showArea: true,
                shapeOptions: {
                  color: 'green', // set the border color
                  fillColor: 'rgba(0, 0, 255)', // optional fill color
                  fillOpacity: 0.9,
                  weight: 0.5,
                },
              }
            : false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false,
        }}
        onEdited={(e) => {
          console.log('POLYGON EDITED', e);
          const latLngs = [];
          const layers = e.layers;
          layers.eachLayer((layer) => {
            latLngs.push(layer.getLatLngs());
          });

          console.log('CHECK LAT LNG', layers);

          // onEditPath(
          //   e?.layers?._layers?.[Object.keys(e?.layers?._layers)?.[0]]?._latlngs?.[0].map((coord) => ({
          //     lat: coord.lat,
          //     lng: coord.lng,
          //   }))
          // );
          removeAllEditControlLayers();
          onEditPath(latLngs?.[0]?.[0]);
        }}
        onCreated={(e) => {
          onCreate(e?.layer?._latlngs?.[0].map((coord) => ({ lat: coord.lat, lng: coord.lng })));
        }}
        onDeleted={(e) => {
          if (Object.keys(e?.layers?._layers)?.length > 0) {
            onDeleted(e?.layer?._latlngs?.[0].map((coord) => ({ lat: coord.lat, lng: coord.lng })));
          }
        }}
        edit={{
          edit: !disableEditDeletePath || true,
          remove: !disableEditDeletePath,
        }}
      />
      {/* {polygons &&
        polygons?.map((polygon) => {
          return (
            polygon?.coordinates?.length > 0 && (
              <Polygon
                key={`polygon-${polygon?.id}`}
                positions={polygon?.coordinates}
                pathOptions={{
                  color: 'blue',
                }}
              />
            )
          );
        })} */}
    </FeatureGroup>
  );
};

function CustomButtonControl({ onFilterChange = (e) => {}, activeFilter = '' }) {
  const map = useMap();

  useEffect(() => {
    const createControl = (title, innerHTML, position, onClick) => {
      const Control = L.Control.extend({
        onAdd: function () {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
          container.style.backgroundColor = 'white';
          container.style.width = '34px';
          container.style.height = '34px';
          container.style.fontSize = '16px';
          container.style.display = 'flex';
          container.style.alignItems = 'center';
          container.style.justifyContent = 'center';
          container.style.cursor = 'pointer';
          container.style.borderColor = activeFilter === title ? 'green' : '';
          container.title = title;

          container.innerHTML = innerHTML;

          container.onclick = onClick;

          return container;
        },
      });

      const control = new Control({ position });
      map.addControl(control);

      return () => map.removeControl(control);
    };

    const controls = [
      createControl('Filter Komoditas', '🥬', 'topleft', () => onFilterChange('komoditas')),
      createControl('Filter Kecamatan', '📍', 'topleft', () => onFilterChange('kecamatan')),
      createControl('Tile Layer', '🗺️', 'topleft', () => onFilterChange('tilelayer')),
    ];

    return () => controls.forEach((control) => control());
  }, [map, onFilterChange, activeFilter]);

  return null;
}

function EnableRulerTool() {
  const map = useMap();

  useEffect(() => {
    // Enable PM controls
    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawPolygon: false,
      drawPolyline: true, // use this for measuring
      drawCircle: false,
      drawCircleMarker: false,
      drawRectangle: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: true,
    });
  }, [map]);

  return null;
}

function ClosePopupButton() {
  const map = useMap();

  const handleClose = () => {
    map.closePopup(); // closes the currently opened popup
  };

  return <Close onClick={handleClose} />;
}

function MapCenterUpdater({ position, zoom = 12 }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [position, map]);

  return null;
}

function ZoomUpdater({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      const bounds = L.polygon(coordinates).getBounds();
      map.fitBounds(bounds);
    }
  }, [map, coordinates]);

  return null;
}

export default function MyMap(props) {
  const mapRef = useRef(null);
  const {
    position = [-0.5, 114.9],
    zoom = 7,
    polygons = [],
    initialPolygonDraw = [],
    data = [],
    activeDataId,
    highlightedPolygon = null,
    mapClassName = '',
    showPolygonPopup = true,
    onDrawCreate = () => {},
    onEditPath = () => {},
    onDeletePath = () => {},
    enableDrawPolygon = false,
    enableEditDeletePath = false,
    showCustomControls = false,
    onFilterChange = (e) => {},
    activeFilter = '',
    tileLayer = 'osm',
  } = props;
  const [openPopupId, setOpenPopupId] = (useState < string) | (null > null);

  console.log('highlightedPolygon', highlightedPolygon);

  const finalPosition = position ? position : [-0.5, 114.9];

  return (
    <MapContainer /// <reference path="" />
      className={`h-[calc(100dvh-72px)] w-full ${mapClassName}`}
      center={finalPosition}
      zoom={zoom}
      scrollWheelZoom={true}
      ref={mapRef}
    >
      {showCustomControls && (
        <>
          <EnableRulerTool />
          <CustomButtonControl onFilterChange={onFilterChange} activeFilter={activeFilter} />
        </>
      )}
      <DrawControl
        disableDrawPolygon={!enableDrawPolygon}
        disableEditDeletePath={!enableEditDeletePath}
        onCreate={onDrawCreate}
        onEditPath={onEditPath}
        onDeleted={onDeletePath}
        polygons={polygons}
      />
      <TileLayer attribution={tileLayers[tileLayer].attribution} url={tileLayers[tileLayer].url} />
      <MapCenterUpdater zoom={zoom} position={finalPosition} />
      <ZoomUpdater coordinates={highlightedPolygon} />
      {data?.map((data) => {
        return data?.peta?.geom?.coordinates ? (
          <Polygon
            key={data?.id}
            eventHandlers={{
              click: () => setOpenPopupId(data?.id),
            }}
            positions={data?.peta?.geom?.coordinates}
            pathOptions={{ color: data.id == activeDataId ? 'green' : 'gray', fillOpacity: 0.4 }}
          >
            {showPolygonPopup ? (
              <Popup closeButton={false}>
                <div className='w-full'>
                  {/* Header */}
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
                          {convertCoordsToDMS(
                            data?.peta?.titik_koordinat?.coordinates[0],
                            data?.peta?.titik_koordinat?.coordinates[1]
                          )}
                        </Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>ID Kebun</Paragraph>
                        <Paragraph className='!m-0 text-[14px]'>{data?.id}</Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Status Lahan</Paragraph>
                        <Paragraph className='!m-0 text-[14px]'>{data?.lahan?.status_lahan_label}</Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Komoditas</Paragraph>
                        <Paragraph className='!m-0 text-[14px]'>{data?.komoditas_info}</Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Luas Lahan (m2)</Paragraph>
                        <Paragraph className='!m-0 text-[14px]'>{data?.lahan?.luas_lahan}</Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Kecamatan</Paragraph>
                        <Paragraph className='!m-0 text-[14px]'>{data?.lahan?.kecamatan_label}</Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Kelurahan</Paragraph>
                        <Paragraph className='!m-0 text-[14px]'>{data?.lahan?.desa_label}</Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Data Peta</Paragraph>
                        <Paragraph
                          className={`!m-0 text-[14px] font-bold ${
                            data?.peta?.geom?.coordinates?.length > 0 ? 'text-primary' : ' text-red-900'
                          }`}
                        >
                          {data?.peta?.geom?.coordinates?.length > 0 ? 'Ada' : 'Tidak Ada'}
                        </Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col gap-1 border-b border-dashed py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>Pekebun</Paragraph>
                        <Paragraph className='!m-0 text-[14px]'>{data?.pekebun?.nama}</Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col items-start gap-1 border-b border-dashed py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold text-gray-400'>STDB Terbit</Paragraph>
                        <STDBStatusChip value={data?.status_stdb} label={data?.status_stdb_label} />
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
            ) : null}
          </Polygon>
        ) : null;
      })}
      {/* {polygons &&
        polygons?.map((polygon) => {
          return (
            polygon?.coordinates?.length > 0 && (
              <Polygon
                key={`polygon-${polygon?.id}`}
                positions={polygon?.coordinates}
                pathOptions={{
                  color: 'blue',
                }}
              />
            )
          );
        })} */}
    </MapContainer>
  );
}
