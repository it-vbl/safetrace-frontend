'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';
import {
  deleteProduksi,
  getDetailProduksi,
  updateProduksi,
} from '@/services/produksi';

const formatNumber = (num) =>
  typeof num === 'number'
    ? num.toLocaleString('id-ID')
    : (Number(num) || 0).toLocaleString('id-ID');

const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const mockProduksiDetail = {
  kebun: {
    id_kebun: 'GR-001-002-002',
    petani: 'Akeng Rupinus',
    kelompok_tani: 'Bepekaek Besamo',
    luas_kebun_ha: 0.78,
    tahun_tanam: 2002,
    total_produksi_kg: 13000,
    prod_per_ha_th_ton: 10,
  },
  produksi_tahunan: [
    {
      tahun: 2025,
      bulan: {
        Januari: 1000,
        Februari: 1000,
        Maret: 1000,
        April: 1000,
        Mei: 1000,
        Juni: 1000,
        Juli: 1000,
        Agustus: 1000,
        September: 1000,
        Oktober: 0,
        November: 0,
        Desember: 0,
      },
    },
    {
      tahun: 2024,
      bulan: {
        Januari: 1000,
        Februari: 1000,
        Maret: 1000,
        April: 1000,
        Mei: 1000,
        Juni: 1000,
        Juli: 1000,
        Agustus: 1000,
        September: 1000,
        Oktober: 1000,
        November: 1000,
        Desember: 1000,
      },
    },
  ],
};

const TraceabilityProduksiDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const [detail, setDetail] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editYearData, setEditYearData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteYearData, setDeleteYearData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PRODUKSI', href: '/traceability/gap/produksi' },
    { label: 'DETAIL PRODUKSI' },
  ];

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const res = await getDetailProduksi(id);
        const payload = res?.data?.data || res?.data || {};

        const months = {
          Januari: payload?.januari ?? 0,
          Februari: payload?.februari ?? 0,
          Maret: payload?.maret ?? 0,
          April: payload?.april ?? 0,
          Mei: payload?.mei ?? 0,
          Juni: payload?.juni ?? 0,
          Juli: payload?.juli ?? 0,
          Agustus: payload?.agustus ?? 0,
          September: payload?.september ?? 0,
          Oktober: payload?.oktober ?? 0,
          November: payload?.november ?? 0,
          Desember: payload?.desember ?? 0,
        };

        const normalized = {
          kebun: {
            id: payload?.kebun ?? null,
            id_kebun: payload?.id_kebun || '-',
            petani: payload?.nama_petani || '-',
            kelompok_tani: payload?.kelompok_tani || '-',
            total_produksi_kg: payload?.total_produksi ?? 0,
            umur_tanaman: payload?.umur_tanaman ?? null,
            prod_per_ha_th_ton: payload?.prod_ha_th ?? 0,
            tahun_produksi: payload?.tahun ?? null,
          },
          produksi_tahunan: [
            {
              tahun: payload?.tahun ?? 0,
              bulan: months,
            },
          ],
        };

        setDetail(normalized);
      } catch (error) {
        toast.error('Gagal memuat detail produksi');
      }
    };

    fetchDetail();
  }, [id]);

  const umurTanamanText = useMemo(() => {
    if (detail?.kebun?.umur_tanaman != null) {
      return `${detail.kebun.umur_tanaman} Tahun`;
    }
    if (detail?.kebun?.tahun_tanam) {
      const currentYear = new Date().getFullYear();
      return `${currentYear - detail.kebun.tahun_tanam} Tahun`;
    }
    return '-';
  }, [detail]);

  const renderYearCard = (yearData) => {
    const monthEntries = MONTHS.map((m) => ({
      name: m,
      valueKg: yearData?.bulan?.[m] ?? 0,
    }));

    const firstRow = monthEntries.slice(0, 6);
    const secondRow = monthEntries.slice(6);

    return (
      <section
        key={`tahun-${yearData.tahun}`}
        className="rounded border border-gray-300 bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">TAHUN {yearData.tahun}</h3>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-sm font-medium text-red-600 underline hover:text-red-700"
              onClick={() => {
                setDeleteYearData(yearData);
                setShowDeleteModal(true);
              }}
            >
              Hapus
            </button>
            <button
              type="button"
              className="text-sm font-medium text-blue-600 underline hover:text-blue-800"
              onClick={() => {
                setEditYearData(yearData);
                setIsEditOpen(true);
              }}
            >
              Ubah Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-x-6 gap-y-3 text-sm text-gray-700">
          {firstRow.map((m) => (
            <div key={`${yearData.tahun}-${m.name}`} className="">
              <div className="text-gray-500">{m.name}</div>
              <div className="font-medium">{formatNumber(m.valueKg)} Kg</div>
            </div>
          ))}

          <div className="col-span-6 border-b border-dashed border-gray-300" />

          {secondRow.map((m) => (
            <div key={`${yearData.tahun}-${m.name}`} className="">
              <div className="text-gray-500">{m.name}</div>
              <div className="font-medium">{formatNumber(m.valueKg)} Kg</div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="flex w-full flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:px-0">
      <div className="flex justify-between">
        <BreadcrumbDetail items={crumbs} />
        <Button
          variant="primary"
          size="medium"
          onClick={() => {
            const kebunId = detail?.kebun?.id;
            if (kebunId) {
              router.push(`/traceability/gap/produksi/tambah?kebun=${kebunId}`);
            } else {
              router.push('/traceability/gap/produksi/tambah');
            }
          }}
          className="whitespace-nowrap"
        >
          Tambah Tahun Produksi
        </Button>
      </div>

      <div className="flex w-full flex-col gap-6">
        {/* DETAIL KEBUN Card */}
        {detail?.kebun && (
          <section className="rounded border border-gray-300 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">DETAIL KEBUN</h3>
            </div>

            <div className="grid grid-cols-6 gap-x-6 gap-y-4 text-sm text-gray-700">
              <BorderBottomColData
                label="Id Kebun"
                value={detail.kebun.id_kebun ?? '-'}
              />
              <BorderBottomColData
                label="Petani"
                value={detail.kebun.petani ?? '-'}
              />
              <BorderBottomColData
                label="Kelompok Tani"
                value={detail.kebun.kelompok_tani ?? '-'}
              />
              <BorderBottomColData
                label="Tahun Produksi"
                value={detail.kebun.tahun_produksi ?? '-'}
              />

              <BorderBottomColData
                label="Umur Tanaman"
                value={umurTanamanText}
              />
              <BorderBottomColData
                label="Total Produksi"
                value={`${formatNumber(detail.kebun.total_produksi_kg)} Kg`}
              />
              <BorderBottomColData
                label="Prod/Ha/Th"
                value={`${formatNumber(detail.kebun.prod_per_ha_th_ton)} Ton`}
              />
            </div>
          </section>
        )}

        {/* Yearly Production Cards */}
        {detail?.produksi_tahunan?.map((y) => renderYearCard(y))}

        {/* Edit Modal */}
        <EditProduksiModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          yearData={editYearData}
          onSave={async (updatedMonths) => {
            try {
              const monthKey = {
                Januari: 'januari',
                Februari: 'februari',
                Maret: 'maret',
                April: 'april',
                Mei: 'mei',
                Juni: 'juni',
                Juli: 'juli',
                Agustus: 'agustus',
                September: 'september',
                Oktober: 'oktober',
                November: 'november',
                Desember: 'desember',
              };

              const flatMonths = Object.fromEntries(
                MONTHS.map((m) => [monthKey[m], updatedMonths[m] ?? 0])
              );

              const payload = {
                kebun: Number(detail?.kebun?.id) || undefined,
                tahun: editYearData?.tahun,
                ...flatMonths,
              };
              await updateProduksi(id, payload);
              toast.success('Data produksi berhasil diperbarui');
              const res = await getDetailProduksi(id);
              const p = res?.data?.data || res?.data || {};
              const months = {
                Januari: p?.januari ?? 0,
                Februari: p?.februari ?? 0,
                Maret: p?.maret ?? 0,
                April: p?.april ?? 0,
                Mei: p?.mei ?? 0,
                Juni: p?.juni ?? 0,
                Juli: p?.juli ?? 0,
                Agustus: p?.agustus ?? 0,
                September: p?.september ?? 0,
                Oktober: p?.oktober ?? 0,
                November: p?.november ?? 0,
                Desember: p?.desember ?? 0,
              };
              setDetail({
                kebun: {
                  id: p?.kebun ?? null,
                  id_kebun: p?.id_kebun || '-',
                  petani: p?.nama_petani || '-',
                  kelompok_tani: p?.kelompok_tani || '-',
                  total_produksi_kg: p?.total_produksi ?? 0,
                  umur_tanaman: p?.umur_tanaman ?? null,
                  prod_per_ha_th_ton: p?.prod_ha_th ?? 0,
                  tahun_produksi: p?.tahun ?? null,
                },
                produksi_tahunan: [
                  {
                    tahun: p?.tahun ?? 0,
                    bulan: months,
                  },
                ],
              });
              setIsEditOpen(false);
            } catch (error) {
              toast.error('Gagal memperbarui data produksi');
            }
          }}
        />
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteYearData(null);
          }}
          onConfirm={async () => {
            if (!id) return;
            try {
              setIsDeleting(true);
              await deleteProduksi(id);
              toast.success('Data produksi berhasil dihapus');
              setShowDeleteModal(false);
              router.push('/traceability/gap/produksi');
            } catch (e) {
              toast.error('Gagal menghapus data produksi');
            } finally {
              setIsDeleting(false);
            }
          }}
          itemName={`produksi tahun ${deleteYearData?.tahun ?? ''}`}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default TraceabilityProduksiDetail;

const formatKgInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return num.toLocaleString('id-ID');
};

const parseKgInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

const EditProduksiModal = ({ open, onClose, yearData, onSave }) => {
  const initialValues = useMemo(() => {
    const months = MONTHS.reduce((acc, m) => {
      acc[m] = formatKgInput(yearData?.bulan?.[m] ?? 0);
      return acc;
    }, {});
    return months;
  }, [yearData]);

  const validationSchema = useMemo(() => {
    const shape = MONTHS.reduce((acc, m) => {
      acc[m] = Yup.string()
        .required('Wajib diisi')
        .test('angka-valid', 'Harus angka >= 0', (val) => {
          const n = parseKgInput(val);
          return Number.isFinite(n) && n >= 0;
        });
      return acc;
    }, {});
    return Yup.object().shape(shape);
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const updated = MONTHS.reduce((acc, m) => {
        acc[m] = parseKgInput(values[m]);
        return acc;
      }, {});
      onSave?.(updated);
    },
  });

  const handleCancel = () => onClose?.();

  return (
    <BaseModal
      open={open}
      setOpen={onClose}
      label={`UBAH DATA ${yearData?.tahun ?? ''}`}
      isShowCloseIcon={false}
      className="!max-w-[768px] transition-all duration-200"
    >
      <div className="pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MONTHS.map((m) => (
            <InputText
              key={`input-${m}`}
              label={m}
              name={m}
              placeholder="0"
              value={formik.values[m]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              suffix="Kg"
              type="string"
              formatter={formatKgInput}
              isRequired={true}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="danger" onClick={handleCancel}>
            Batalkan
          </Button>
          <Button
            type="button"
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
