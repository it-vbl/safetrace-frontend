'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Toggle from '@/components/atoms/Toggle';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import DateRange from '@/components/molecules/DateRange';
import RadioButton from '@/components/molecules/RadioButton';
import SectionLoading from '@/components/molecules/SectionLoading';

const FilterSidebar = ({
  dateRange = { startDate: '', endDate: '' },
  onDateRangeChange = () => {},
  staticLayers = [],
  activeStaticLayers = {},
  onStaticLayerChange = () => {},
  activeBasemap = 'osm',
  onBasemapChange = () => {},
  loading = false,
}) => {
  const { mapviewFilterSidebarOpen } = useSelector((state) => state.app);
  const handleDateRangeChange = (newDateRange) => {
    onDateRangeChange(newDateRange);
  };

  useEffect(() => {
    const leftContainer = document.querySelector('.leaflet-left');
    const leftToggleButton = document.querySelector('.toggle-icon');
    if (leftContainer) {
      try {
        if (mapviewFilterSidebarOpen) {
          // Set left to sidebar width (320px) + left padding (16px) = 336px
          leftContainer.classList.remove('leaflet-left-custom');
          leftToggleButton.classList.add('rotate-180');
        } else {
          leftContainer.classList.add('leaflet-left-custom');
          leftToggleButton.classList.remove('rotate-180');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [mapviewFilterSidebarOpen]);

  const basemapOptions = [
    { label: 'Open Street Map', value: 'osm' },
    { label: 'Light Map', value: 'light' },
    { label: 'Dark Map', value: 'dark' },
    { label: 'Satelite Map', value: 'satellite' },
  ];

  // Dummy data for static layers
  const dummyStaticLayers = [
    {
      label: 'Peta Izin Usaha Perkebunan',
      value: 'peta-izin-usaha-perkebunan',
    },
    { label: 'Batas Desa', value: 'batas-desa' },
    { label: 'Batas Kecamatan', value: 'batas-kecamatan' },
    { label: 'Batas Kabupaten', value: 'batas-kabupaten' },
    { label: 'Kawasan Hutan', value: 'kawasan-hutan' },
    { label: 'Hak Guna Usaha', value: 'hak-guna-usaha' },
    { label: 'Lahan Gambut', value: 'lahan-gambut' },
    { label: 'Pabrik Sawit', value: 'pabrik-sawit' },
    { label: 'Penutupan Lahan Sawit', value: 'penutupan-lahan-sawit' },
  ];

  // Use dummy data if staticLayers prop is empty
  const layersToDisplay =
    staticLayers.length > 0 ? staticLayers : dummyStaticLayers;

  return (
    <div
      id="filter-sidebar"
      className={`absolute !h-[calc(100%-32px)] left-4 top-4 z-[500] w-[250px] duration-300 ease-in-out transition-all border border-gray-200 bg-white rounded-[4px] p-4 shadow-lg ${
        mapviewFilterSidebarOpen ? 'translate-x-0' : '-translate-x-[200%]'
      }`}
    >
      <SectionLoading loading={loading} />

      <div className="flex flex-col gap-6">
        {/* PERIODE Section */}
        <div className="flex flex-col gap-3">
          <Heading level={6} className="text-[14px] font-bold text-gray-800">
            PERIODE
          </Heading>
          <DateRange
            value={{
              startDate: dateRange.startDate || '',
              endDate: dateRange.endDate || '',
            }}
            onChange={handleDateRangeChange}
            placeholder="Pilih Periode"
          />
        </div>

        {/* STATIK LAYER Section */}
        <div className="flex flex-col gap-3">
          <Heading level={6} className="text-[14px] font-bold text-gray-800">
            STATIK LAYER
          </Heading>
          <div className="flex max-h-[300px] flex-col gap-3 overflow-y-auto">
            {layersToDisplay.map((layer) => {
              const isActive = activeStaticLayers[layer.value]?.active || false;
              return (
                <div key={layer.value} className="flex items-center gap-3">
                  <Toggle
                    value={isActive}
                    onChange={(value) => onStaticLayerChange(layer, value)}
                  />
                  <Paragraph
                    level={3}
                    className={`text-[14px] ${
                      isActive ? 'font-semibold text-primary' : 'text-black'
                    }`}
                  >
                    {layer.label}
                  </Paragraph>
                </div>
              );
            })}
          </div>
        </div>

        {/* BASEMAP Section */}
        <div className="flex flex-col gap-3">
          <Heading level={6} className="text-[14px] font-bold text-gray-800">
            BASEMAP
          </Heading>
          <RadioButton
            name="basemap"
            value={activeBasemap}
            onChangeValue={onBasemapChange}
            options={basemapOptions}
            direction="column"
            labelClassName="text-[14px]"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
