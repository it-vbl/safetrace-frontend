'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';

import Modal from '@/components/molecules/Modal';
import SectionLoading from '@/components/molecules/SectionLoading';
import { getPetaOverlayDetail } from '@/services/petaOverlay';

const ModalMapPreview = ({ open, setOpen, layerId }) => {
  const [loading, setLoading] = useState(false);
  const [layerData, setLayerData] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState([0.119444, 110.588889]); // Default center

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/organisms/MapView'), {
        loading: () => <p>Memuat peta...</p>,
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    if (open && layerId) {
      const fetchData = async () => {
        setLoading(true);
        setLayerData(null);
        try {
          const res = await getPetaOverlayDetail(layerId);
          const data = res?.data?.data || res?.data;
          setLayerData(data);
        } catch (error) {
          console.error('Error fetching layer detail:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [open, layerId]);

  const handleClose = () => {
    setOpen(false);
    setLayerData(null);
  };

  useEffect(() => {
    if (layerData?.geom) {
      try {
        const layer = L.geoJSON(layerData.geom);
        const bounds = layer.getBounds();
        if (bounds && bounds.isValid()) {
          const tempMap = L.map(document.createElement('div'), {
            zoomControl: false,
            attributionControl: false,
          });
          const calculatedZoom = tempMap.getBoundsZoom(bounds, false);
          tempMap.remove();
          setZoom(calculatedZoom);
          const c = bounds.getCenter();
          setCenter([c.lat, c.lng]);
        } else {
          const coords = [];
          const traverse = (g) => {
            const t = g.type;
            const c = g.coordinates;
            if (t === 'Point') coords.push([c[1], c[0]]);
            else if (t === 'MultiPoint' || t === 'LineString')
              c.forEach((p) => coords.push([p[1], p[0]]));
            else if (t === 'MultiLineString')
              c.forEach((ln) => ln.forEach((p) => coords.push([p[1], p[0]])));
            else if (t === 'Polygon')
              c.forEach((ring) =>
                ring.forEach((p) => coords.push([p[1], p[0]]))
              );
            else if (t === 'MultiPolygon')
              c.forEach((poly) =>
                poly.forEach((ring) =>
                  ring.forEach((p) => coords.push([p[1], p[0]]))
                )
              );
          };
          if (layerData.geom.type === 'FeatureCollection') {
            (layerData.geom.features || []).forEach(
              (f) => f.geometry && traverse(f.geometry)
            );
          } else if (layerData.geom.type === 'Feature') {
            traverse(layerData.geom.geometry);
          } else {
            traverse(layerData.geom);
          }
          if (coords.length > 0) {
            const b = L.latLngBounds(coords.map((p) => L.latLng(p[0], p[1])));
            if (b.isValid()) {
              const tempMap = L.map(document.createElement('div'), {
                zoomControl: false,
                attributionControl: false,
              });
              const calculatedZoom = tempMap.getBoundsZoom(b, false);
              tempMap.remove();
              setZoom(calculatedZoom);
              const c = b.getCenter();
              setCenter([c.lat, c.lng]);
            } else {
              setZoom(5);
            }
          } else {
            setZoom(5);
          }
        }
      } catch (error) {
        setZoom(5);
      }
    }
  }, [layerData]);

  return (
    <Modal
      className="!h-[90vh] !max-h-[800px] !w-[90vw] !max-w-[1200px] p-0"
      open={open}
      onclose={handleClose}
      label="PREVIEW LAYER PETA STATIS"
      showBottomButton={false}
    >
      <div className="relative flex h-full w-full flex-col">
        <div className="relative min-h-0 flex-1">
          <SectionLoading loading={loading} />
          {!loading && layerId && layerData && (
            <div className="h-full min-h-[500px] w-full">
              <Map
                position={center}
                showCustomControls={false}
                showDrawControls={false}
                zoom={zoom}
                mapClassName="h-full"
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalMapPreview;
