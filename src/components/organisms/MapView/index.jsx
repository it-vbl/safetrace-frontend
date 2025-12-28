// src/components/Map.tsx
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import L from 'leaflet';
import { ArrowRightIcon, FileWarningIcon } from 'lucide-react';
import {
  FeatureGroup,
  MapContainer,
  Polygon,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useDispatch, useSelector } from 'react-redux';

import Close from '@/components/atoms/Icons/Close';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import convertCoordsToDMS from '@/libs/utils/convertCoordToDMS';
import { setMapviewFilterSidebarOpen } from '@/store/slices/app';

import EnableRulerTool from './EnableRulerTool';
import IupMap from './StaticLayers';

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
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
        position="topleft"
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
          polyline: false,
        }}
        onEdited={(e) => {
          const latLngs = [];
          const layers = e.layers;
          layers.eachLayer((layer) => {
            latLngs.push(layer.getLatLngs());
          });
          removeAllEditControlLayers();
          onEditPath(latLngs?.[0]?.[0]);
        }}
        onCreated={(e) => {
          onCreate(
            e?.layer?._latlngs?.[0].map((coord) => ({
              lat: coord.lat,
              lng: coord.lng,
            }))
          );
        }}
        onDeleted={(e) => {
          if (Object.keys(e?.layers?._layers)?.length > 0) {
            onDeleted(
              e?.layer?._latlngs?.[0].map((coord) => ({
                lat: coord.lat,
                lng: coord.lng,
              }))
            );
          }
        }}
        edit={{
          edit: !disableEditDeletePath || true,
          remove: !disableEditDeletePath,
        }}
      />
    </FeatureGroup>
  );
};

const toggleIcon = `
  <svg
    class="toggle-icon"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.02362 10.0006L13.1484 5.87577L11.9699 4.69727L6.66662 10.0006L11.9699 15.3038L13.1484 14.1253L9.02362 10.0006Z"
      fill="black"
    />
  </svg>`;

function CustomButtonControl({
  onFilterChange = (e) => {},
  activeFilter = '',
}) {
  const map = useMap();
  const dispatch = useDispatch();
  const { mapviewFilterSidebarOpen } = useSelector((state) => state.app);

  const onToggleFilterSidebar = () => {
    dispatch(setMapviewFilterSidebarOpen(!mapviewFilterSidebarOpen));
  };

  useEffect(() => {
    const createControl = (
      title,
      innerHTML,
      position,
      onClick,
      beforeDefaultControl = false,
      customClassName = ''
    ) => {
      const Control = L.Control.extend({
        onAdd: function () {
          const container = L.DomUtil.create(
            'div',
            `leaflet-bar leaflet-control leaflet-control-custom ${customClassName}`
          );
          container.style.backgroundColor = 'white';
          container.style.width = '32px';
          container.style.height = '32px';
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
      if (beforeDefaultControl) {
        const corner = document.querySelector('.leaflet-top.leaflet-left');
        if (corner) {
          corner.insertBefore(control.getContainer(), corner.firstChild);
        }
      }

      return () => map.removeControl(control);
    };

    const controls = [
      createControl(
        'Sidebar Toggle',
        toggleIcon,
        'topleft',
        () => onToggleFilterSidebar(),
        true,
        !mapviewFilterSidebarOpen ? 'rotate-180' : ''
      ),
    ];

    return () => controls.forEach((control) => control());
  }, [map, onFilterChange, activeFilter, mapviewFilterSidebarOpen]);

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
    showDrawControls = false,
    onFilterChange = (e) => {},
    activeFilter = '',
    tileLayer = 'osm',
    staticLayers = null,
    isDisplaySidebar = false,
  } = props;
  const [openPopupId, setOpenPopupId] = useState(null);

  const finalPosition = position ? position : [-0.5, 114.9];

  useEffect(() => {
    let intervalId;

    const applyCustomClasses = () => {
      const leftContainers = document.querySelectorAll('.leaflet-left');
      const rightContainers = document.querySelectorAll('.leaflet-right');

      if (leftContainers.length > 0 && rightContainers.length > 0) {
        try {
          if (!isDisplaySidebar) {
            // Set left to sidebar width (320px) + left padding (16px) = 336px
            // Apply to all leaflet-left and leaflet-right elements (for multiple maps)
            leftContainers.forEach((container) => {
              container.classList.add('leaflet-left-custom');
            });
            rightContainers.forEach((container) => {
              container.classList.add('leaflet-right-custom');
            });
          } else {
            // Remove custom classes when sidebar is displayed
            leftContainers.forEach((container) => {
              container.classList.remove('leaflet-left-custom');
            });
            rightContainers.forEach((container) => {
              container.classList.remove('leaflet-right-custom');
            });
          }
          return true; // Elements found and classes applied
        } catch (error) {
          console.error(error);
          return false;
        }
      }
      return false; // Elements not found
    };

    // Use do-while pattern with setInterval
    let found = false;
    do {
      found = applyCustomClasses();
      if (!found) {
        // If not found, set up interval to retry every 1 second
        intervalId = setInterval(() => {
          const success = applyCustomClasses();
          if (success) {
            clearInterval(intervalId);
          }
        }, 1000);
        break; // Exit do-while, interval will continue checking
      }
    } while (!found);

    // Cleanup interval on unmount or dependency change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isDisplaySidebar]);

  return (
    <MapContainer
      className={`h-[calc(100dvh-72px)] w-full ${mapClassName}`}
      center={finalPosition}
      zoom={zoom}
      scrollWheelZoom={true}
      ref={mapRef}
    >
      {showCustomControls && (
        <>
          <EnableRulerTool />
          <CustomButtonControl
            onFilterChange={onFilterChange}
            activeFilter={activeFilter}
          />
        </>
      )}
      {showDrawControls && (
        <DrawControl
          disableDrawPolygon={!enableDrawPolygon}
          disableEditDeletePath={!enableEditDeletePath}
          onCreate={onDrawCreate}
          onEditPath={onEditPath}
          onDeleted={onDeletePath}
          polygons={polygons}
        />
      )}
      <TileLayer
        attribution={tileLayers[tileLayer].attribution}
        url={tileLayers[tileLayer].url}
      />
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
            pathOptions={{
              color: data.id == activeDataId ? 'green' : 'gray',
              fillOpacity: 0.2,
              weight: 2,
            }}
          >
            {showPolygonPopup ? (
              <Popup closeButton={false}>
                <div className="w-full">
                  <div className="flex h-[32px] items-center justify-between mb-2">
                    <Paragraph className="font-bold" level={2}>
                      INFORMASI KEBUN
                    </Paragraph>
                    <ClosePopupButton />
                  </div>
                  <div className="w-[600px]">
                    {/* Resiko Deforestasi Banner */}
                    <div className="bg-orange-300  px-3 py-2 rounded mb-4 flex items-center justify-center gap-2">
                      <FileWarningIcon size={16} />
                      <Paragraph className="!m-0 text-[14px] font-semibold">
                        Resiko Deforestasi : {data?.resiko_deforestasi || '-'}
                      </Paragraph>
                    </div>

                    {/* Helper function to format waktu_tanam */}
                    {(() => {
                      const formatWaktuTanam = (dateString) => {
                        if (!dateString) return '-';
                        try {
                          const date = new Date(dateString);
                          const month = date.toLocaleDateString('id-ID', {
                            month: 'long',
                          });
                          const year = date.getFullYear();
                          return `${
                            month.charAt(0).toUpperCase() + month.slice(1)
                          }, ${year}`;
                        } catch {
                          return dateString || '-';
                        }
                      };

                      // Helper to convert m2 to Ha
                      const convertToHa = (luasM2) => {
                        if (!luasM2) return '0';
                        const ha = parseFloat(luasM2) / 10000;
                        return ha.toFixed(2);
                      };

                      return (
                        <div className="grid grid-cols-3 gap-x-4">
                          {/* Column 1 */}
                          <div className="flex flex-col">
                            <div className="flex flex-col gap-1 border-b border-dashed border-gray-300 py-3">
                              <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                                Titik Koordinat
                              </Paragraph>
                              <Paragraph className="!m-0 text-[14px]">
                                {data?.peta?.titik_koordinat?.coordinates
                                  ? convertCoordsToDMS(
                                      data.peta.titik_koordinat.coordinates[0],
                                      data.peta.titik_koordinat.coordinates[1]
                                    )
                                  : '-'}
                              </Paragraph>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-dashed border-gray-300 py-3">
                              <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                                Kelompok
                              </Paragraph>
                              <Paragraph className="!m-0 text-[14px]">
                                {data?.kelompok || data?.kelompok_tani || '-'}
                              </Paragraph>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-dashed border-gray-300 py-3">
                              <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                                Waktu Tanam
                              </Paragraph>
                              <Paragraph className="!m-0 text-[14px]">
                                {formatWaktuTanam(data?.waktu_tanam)}
                              </Paragraph>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-dashed border-gray-300 py-3">
                              <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                                Legalitas
                              </Paragraph>
                              <Paragraph className="!m-0 text-[14px]">
                                {data?.jenis_legalitas_label ||
                                  data?.legalitas ||
                                  '-'}
                              </Paragraph>
                            </div>
                            <div className="flex flex-col gap-1 py-3">
                              <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                                STDB
                              </Paragraph>
                              <Paragraph className="!m-0 text-[14px]">
                                {data?.nomor_stdb || data?.stdb || '-'}
                              </Paragraph>
                            </div>
                          </div>

                          {/* Column 2 */}
                          <div className="flex flex-col">
                            <div className="flex flex-col gap-1 border-b border-dashed border-gray-300 py-3">
                              <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                                Id Kebun
                              </Paragraph>
                              <Paragraph className="!m-0 text-[14px]">
                                {data?.id_kebun || '-'}
                              </Paragraph>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-dashed border-gray-300 py-3">
                              <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                                Lokasi
                              </Paragraph>
                              <Paragraph className="!m-0 text-[14px]">
                                {data?.lokasi_kebun ||
                                  data?.lahan?.desa_label ||
                                  '-'}
                              </Paragraph>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-dashed border-gray-300 py-3">
                              <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                                RSPO
                              </Paragraph>
                              <Paragraph
                                className={`!m-0 text-[14px] ${
                                  data?.is_rspo || data?.rspo === 'Sudah'
                                    ? 'text-green-600 font-semibold'
                                    : ''
                                }`}
                              >
                                {data?.is_rspo
                                  ? 'Sudah'
                                  : data?.rspo || 'Belum'}
                              </Paragraph>
                            </div>
                            <div className="flex flex-col gap-1 py-3">
                              <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                                No Legalitas
                              </Paragraph>
                              <Paragraph className="!m-0 text-[14px]">
                                {data?.nomor_legalitas ||
                                  data?.no_legalitas ||
                                  '-'}
                              </Paragraph>
                            </div>
                          </div>

                          {/* Column 3 */}
                          <div className="flex flex-col">
                            <div className="flex flex-col gap-1 border-b border-dashed border-gray-300 py-3">
                              <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                                Petani
                              </Paragraph>
                              <Paragraph className="!m-0 text-[14px]">
                                {data?.pekebun?.nama ||
                                  data?.nama_petani ||
                                  '-'}
                              </Paragraph>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-dashed border-gray-300 py-3">
                              <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                                Luas Kebun (Ha)
                              </Paragraph>
                              <Paragraph className="!m-0 text-[14px]">
                                {data?.luas_kebun
                                  ? parseFloat(data.luas_kebun).toFixed(2)
                                  : data?.lahan?.luas_lahan
                                  ? convertToHa(data.lahan.luas_lahan)
                                  : '0.00'}
                              </Paragraph>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-dashed border-gray-300 py-3">
                              <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                                ISPO
                              </Paragraph>
                              <Paragraph
                                className={`!m-0 text-[14px] ${
                                  data?.is_ispo || data?.ispo === 'Sudah'
                                    ? 'text-green-600 font-semibold'
                                    : ''
                                }`}
                              >
                                {data?.is_ispo
                                  ? 'Sudah'
                                  : data?.ispo || 'Belum'}
                              </Paragraph>
                            </div>
                            <div className="flex flex-col gap-1 py-3">
                              <Paragraph className="!m-0 text-[12px] font-bold text-gray-400">
                                Pemilik Legalitas
                              </Paragraph>
                              <Paragraph className="!m-0 text-[14px]">
                                {data?.pemiliki_legalitas ||
                                  data?.pemilik_legalitas ||
                                  '-'}
                              </Paragraph>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Lihat Selengkapnya Link */}
                    <div className="mt-4 flex justify-end">
                      <Link href={`/traceability/kebun/${data?.id}/detail`}>
                        <div className="flex flex-row items-center gap-2 text-primary hover:underline cursor-pointer">
                          <Paragraph className="!m-0 text-[14px]">
                            Lihat Selengkapnya
                          </Paragraph>
                          <ArrowRightIcon size={14} />
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
      <IupMap data={staticLayers} />
    </MapContainer>
  );
}
