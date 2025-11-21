'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';

import Modal from '@/components/molecules/Modal';
import SectionLoading from '@/components/molecules/SectionLoading';
import useStaticLayer from '@/hooks/useStaticLayer';

const ModalMapPreview = ({ open, setOpen, layerId }) => {
  const [loading, setLoading] = useState(false);
  const [layerData, setLayerData] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState([0.119444, 110.588889]); // Default center
  const { fetchUploadedStaticLayerDetail, staticLayersDetail } =
    useStaticLayer();

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
          const data = await fetchUploadedStaticLayerDetail(layerId);
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

  // Calculate zoom based on layer bounds
  useEffect(() => {
    if (layerData?.geom) {
      try {
        const layer = L.geoJSON(layerData.geom);
        const bounds = layer.getBounds();

        // Create a temporary map to calculate zoom
        const tempMap = L.map(document.createElement('div'), {
          zoomControl: false,
          attributionControl: false,
        });

        // Calculate the zoom level that fits the bounds
        const calculatedZoom = tempMap.getBoundsZoom(bounds, false);

        // Clean up
        tempMap.remove();

        // Set zoom with some padding (subtract 1 for better fit)
        setZoom(calculatedZoom);
        setCenter([bounds.getCenter().lat, bounds.getCenter().lng]);
      } catch (error) {
        console.error('Error calculating zoom:', error);
        setZoom(5); // Default zoom on error
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
