import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { BiTrash } from 'react-icons/bi';
import { toast } from 'react-toastify';
import shp from 'shpjs';

import Button from '@/components/atoms/Button';
import Switch from '@/components/atoms/Switch';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import InputText from '@/components/molecules/InputText';
import Upload from '@/components/molecules/Upload';

const DataPemetaan = ({ data, formik, mode = 'create' }) => {
  const [drawFromMap, setDrawFromMap] = useState(false);
  const [isManual, setIsManual] = useState(true);
  const [newCoord, setNewCoord] = useState(null);
  const initialPolygon = data?.peta?.geom?.coordinates?.[0]?.map((coord) => ({
    lat: coord[1],
    lng: coord[0],
  }));
  const [coords, setCoords] = useState(
    data?.peta?.geom?.coordinates?.[0]?.map((coord) => ({
      lat: coord[1],
      lng: coord[0],
    })) || []
  );
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingCoord, setEditingCoord] = useState({ lat: '', lng: '' });

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/organisms/MapView'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const handleSwitchChange = (e) => {
    setDrawFromMap(e);
  };

  const handleDeleteCoord = (index) => {
    setCoords(coords.filter((_, i) => i !== index));
  };

  const handleSaveEdit = (index) => {
    setCoords(
      coords.map((coord, i) =>
        i === index
          ? {
              lat: editingCoord.lat || coord.lat,
              lng: editingCoord.lng || coord.lng,
            }
          : coord
      )
    );
    setEditingIndex(null);
    setEditingCoord({ lat: '', lng: '' });
  };

  const handleEditCoord = (index) => {
    setEditingIndex(index);
    setEditingCoord(coords[index]);
  };

  const handleFileUpload = async (file) => {
    const blobFile = file.value;
    const fileType = blobFile.name.split('.').pop();
    if (fileType === 'geojson') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const geojson = JSON.parse(event.target.result);
        const newCoords = geojson.features?.[0].geometry.coordinates?.[0].map(
          ([lng, lat]) => ({ lng, lat })
        );
        setCoords(newCoords);
      };
      reader.readAsText(blobFile);
    } else if (fileType === 'shp') {
      const arrayBuffer = await blobFile.arrayBuffer();
      const json = await shp(arrayBuffer);
      const newCoords = json.features?.[0].geometry.coordinates?.[0].map(
        ([lng, lat]) => ({ lng, lat })
      );
      setCoords(newCoords);
    }
  };

  useEffect(() => {
    formik?.setValues({ ...formik.values, peta: coords });
  }, [coords]);

  return (
    <div className="flex w-full flex-col">
      <div className="font-border-l-destructive mb-4 flex flex-1 items-center justify-between">
        <div className="flex flex-1 font-bold">Informasi Pemetaan</div>
        <div className="flex flex-row items-center rounded-[4px] bg-primary/10 px-2 py-2">
          <div
            className={`flex flex-1 cursor-pointer items-center justify-center rounded-[4px] px-2 py-1 text-[12px] ${
              isManual ? 'bg-white text-primary' : 'text-primary'
            }`}
            onClick={() => setIsManual(true)}
          >
            Manual
          </div>
          <div
            className={`flex flex-1 cursor-pointer items-center justify-center rounded-[4px] px-2 py-1 text-[12px] ${
              !isManual ? 'bg-white text-primary' : 'text-primary'
            }`}
            onClick={() => setIsManual(false)}
          >
            Upload
          </div>
        </div>
      </div>
      <div className="flex h-auto w-full flex-row gap-6">
        {isManual ? (
          <div className="flex flex-1 flex-col gap-4">
            <Paragraph level={4}>
              Gambar langsung pada peta atau masukkan titik-titik koordinat
              dalam format Long, Lat. Contoh: 100.664613, 1.239685
            </Paragraph>
            {mode === 'create' && (
              <div className="flex flex-row items-center gap-2 rounded-[8px] bg-primary/10 p-2">
                <Switch checked={drawFromMap} onChange={handleSwitchChange} />
                <Paragraph level={3}>Gambar langsung pada peta</Paragraph>
              </div>
            )}
            {!drawFromMap ? (
              <div>
                <div className="flex flex-row items-end gap-2">
                  <InputText
                    placeholder="Contoh: 1.239685"
                    name="latitude"
                    label="Latitude"
                    value={newCoord?.lat || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewCoord({ ...newCoord, lat: value });
                    }}
                    type="latitude"
                  />
                  <InputText
                    placeholder="Contoh: 100.664613"
                    name="longitude"
                    label="Longitude"
                    value={newCoord?.lng || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewCoord({ ...newCoord, lng: value });
                    }}
                    type="longitude"
                  />

                  <Button
                    size="small"
                    onClick={() => {
                      if (!newCoord.lat || !newCoord.lng) {
                        toast.error('Pastikan latitude dan longitude terisi');
                        return;
                      }
                      setCoords([...coords, newCoord]);
                      setNewCoord({ lat: '', lng: '' });
                    }}
                  >
                    Tambah
                  </Button>
                </div>
              </div>
            ) : null}
            <div>
              <Paragraph className="mb-2 font-bold text-gray-400" level={4}>
                Daftar Koordinat
              </Paragraph>
              <div className="flex flex-col gap-4">
                {coords?.length > 0
                  ? coords?.map((coord, index) => {
                      return (
                        <div
                          key={`coord-${index}`}
                          className="flex flex-row items-center gap-4"
                        >
                          {editingIndex === index ? (
                            <>
                              <InputText
                                placeholder="Latitude"
                                value={editingCoord.lat}
                                onChange={(e) =>
                                  setEditingCoord({
                                    ...editingCoord,
                                    lat: e.target.value,
                                  })
                                }
                                type="latitude"
                              />
                              <InputText
                                placeholder="Longitude"
                                value={editingCoord.lng}
                                onChange={(e) =>
                                  setEditingCoord({
                                    ...editingCoord,
                                    lng: e.target.value,
                                  })
                                }
                                type="longitude"
                              />
                              <Button
                                size="small"
                                onClick={() => handleSaveEdit(index)}
                              >
                                Save
                              </Button>
                            </>
                          ) : (
                            <>
                              <Paragraph
                                level={3}
                                className="flex flex-1 font-bold"
                              >
                                {coord.lat}, {coord.lng}
                              </Paragraph>
                              {!drawFromMap && (
                                <>
                                  <Button
                                    size="small"
                                    onClick={() => handleEditCoord(index)}
                                  >
                                    Edit
                                  </Button>
                                  <div className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-primary text-primary">
                                    <BiTrash
                                      onClick={() => handleDeleteCoord(index)}
                                    />
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })
                  : '-'}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4">
            <div className="text-[12px]">
              Upload <b>.geojson</b> file yang sudah disiapkan.
            </div>
            <div>
              <Upload
                label="Upload File"
                allowedFiles={['.geojson', 'application/geo+json']}
                onChangeValue={(file) => handleFileUpload(file)}
              />
            </div>
          </div>
        )}
        <div className="flex flex-1">
          <Map
            mapClassName="h-[55vh]"
            position={
              data?.peta?.titik_koordinat
                ? [
                    data?.peta?.titik_koordinat?.coordinates[1],
                    data?.peta?.titik_koordinat?.coordinates[0],
                  ]
                : [-0.5, 114.9]
            }
            enableDrawPolygon={
              coords?.length > 0 || !drawFromMap ? false : true
            }
            enableEditDeletePath={
              coords?.length > 0 && drawFromMap ? true : false
            }
            highlightedPolygon={
              coords?.length > 0 && [
                coords?.map((coord) => [coord.lat, coord.lng]),
              ]
            }
            initialPolygonDraw={
              initialPolygon?.length > 0 && [
                {
                  coordinates: initialPolygon?.map((coord) => [
                    coord.lat,
                    coord.lng,
                  ]),
                },
              ]
            }
            polygons={
              isManual &&
              coords?.length > 0 && [
                {
                  coordinates: coords?.map((coord) => [coord.lat, coord.lng]),
                },
              ]
            }
            onDrawCreate={(e) => {
              setCoords(e);
            }}
            onDeletePath={(e) => {
              setCoords(e);
            }}
            onEditPath={(e) => {
              setCoords(e);
            }}
            showDrawControls={true}
          />
        </div>
        {/* <BorderBottomColData
          label='Titik koordinat'
          value={convertCoordToDMS(
            data?.peta?.titik_koordinat?.coordinates[0],
            data?.peta?.titik_koordinat?.coordinates[1]
          )}
        />
        <BorderBottomColData label='Luas (m2)' value={data?.peta?.luas_area_geom} />
        <BorderBottomColData label='Keliling (m2)' value={data?.peta?.keliling_area_geom} /> */}
      </div>
    </div>
  );
};

export default DataPemetaan;
