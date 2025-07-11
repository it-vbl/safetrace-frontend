// src/components/Map.tsx
import { MapContainer, Polygon, Popup, TileLayer, FeatureGroup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import Close from '@/components/atoms/Icons/Close';
import { useEffect, useRef, useState } from 'react';
import L, { latLng, polygon } from 'leaflet';
import '@/styles/globals.css';
import './map.css';
import 'leaflet.pm/dist/leaflet.pm.css';
import 'leaflet.pm';
import getPolygonCenter from '@/utils/getPolygonCenter';
import convertCoordsToDMS from '@/libs/utils/convertCoordToDMS';
import { EditControl } from 'react-leaflet-draw';

const DrawControl = ({
  onCreate = (e: any) => {},
  onEditPath = (e: any) => {},
  onDeleted = (e: any) => {},
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

  const drawPolygon = (polygons: any[]) => {
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
          polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: {
              color: 'green', // set the border color
              fillColor: 'rgba(0, 0, 255)', // optional fill color
              fillOpacity: 0.9,
              weight: 0.5,
            },
          },
          rectangle: false,
          polyline: false,
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
          //   e?.layers?._layers?.[Object.keys(e?.layers?._layers)?.[0]]?._latlngs?.[0].map((coord: any) => ({
          //     lat: coord.lat,
          //     lng: coord.lng,
          //   }))
          // );
          removeAllEditControlLayers();
          onEditPath(latLngs?.[0]?.[0]);
        }}
        onCreated={(e) => {
          onCreate(e?.layer?._latlngs?.[0].map((coord: any) => ({ lat: coord.lat, lng: coord.lng })));
        }}
        onDeleted={(e) => {
          if (Object.keys(e?.layers?._layers)?.length > 0) {
            onDeleted(e?.layer?._latlngs?.[0].map((coord: any) => ({ lat: coord.lat, lng: coord.lng })));
          }
        }}
        draw={{
          polyline: false,
          polygon: !disableDrawPolygon,
          rectangle: false,
          circle: false,
          circlemarker: false,
          marker: false,
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

function CustomButtonControl() {
  const map = useMap();

  useEffect(() => {
    const CustomControl = L.Control.extend({
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
        container.title = 'Custom Action';

        container.innerHTML = '🥬';

        container.onclick = () => {
          alert('Custom button clicked!');
        };

        return container;
      },
    });

    const control = new CustomControl({ position: 'topleft' });
    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
}

function EnableRulerTool() {
  const map = useMap();

  useEffect(() => {
    // Enable PM controls
    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawPolygon: true,
      drawPolyline: false, // use this for measuring
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

function MapCenterUpdater({ position, zoom = 12 }: { position: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [position, map]);

  return null;
}

function ZoomUpdater({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      const bounds = L.polygon(coordinates).getBounds();
      map.fitBounds(bounds);
    }
  }, [map, coordinates]);

  return null;
}

export default function MyMap(props: any) {
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
  } = props;
  const [openPopupId, setOpenPopupId] = useState<string | null>(null);

  const finalPosition = position ? position : [-0.5, 114.9];

  return (
    <MapContainer /// <reference path="" />
      className={`h-[calc(100dvh-72px)] w-full ${mapClassName}`}
      center={finalPosition}
      zoom={zoom}
      scrollWheelZoom={true}
      ref={mapRef}
    >
      <DrawControl
        disableDrawPolygon={!enableDrawPolygon}
        disableEditDeletePath={!enableEditDeletePath}
        onCreate={onDrawCreate}
        onEditPath={onEditPath}
        onDeleted={onDeletePath}
        polygons={polygons}
      />
      {/* <EnableRulerTool /> */}
      {/* <CustomButtonControl /> */}
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      <MapCenterUpdater zoom={zoom} position={finalPosition} />
      <ZoomUpdater coordinates={highlightedPolygon} />
      {data?.map((data: any) => {
        return data?.peta?.geom?.coordinates ? (
          <Polygon
            key={data?.id}
            eventHandlers={{
              click: () => setOpenPopupId(data?.id),
            }}
            positions={data?.peta?.geom?.coordinates}
            pathOptions={{ color: data.id == activeDataId ? 'green' : 'red', fillOpacity: 0.4 }}
          >
            {showPolygonPopup ? (
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
                        <Paragraph className='!m-0 text-[16px]'>
                          {convertCoordsToDMS(
                            data?.peta?.titik_koordinat?.coordinates[0],
                            data?.peta?.titik_koordinat?.coordinates[1]
                          )}
                        </Paragraph>
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
                        <Paragraph className='!m-0 text-[16px]'>{data?.komoditas_kelembagaan_label}</Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold'>Luas Lahan (m2)</Paragraph>
                        <Paragraph className='!m-0 text-[16px]'>{data?.luas_lahan}</Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold'>Kecamatan</Paragraph>
                        <Paragraph className='!m-0 text-[16px]'>{data?.kecamatan_label}</Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold'>Kelurahan</Paragraph>
                        <Paragraph className='!m-0 text-[16px]'>{data?.desa_label}</Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold'>Data Peta</Paragraph>
                        <Paragraph className='!m-0 text-[16px]'>{data?.data_peta}</Paragraph>
                      </div>
                      <div className='border-b-1 flex flex-col gap-1 border-b py-4 pr-8'>
                        <Paragraph className='!m-0 text-[12px] font-bold'>Pekebun</Paragraph>
                        <Paragraph className='!m-0 text-[16px]'>{data?.pekebun?.user?.full_name}</Paragraph>
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
