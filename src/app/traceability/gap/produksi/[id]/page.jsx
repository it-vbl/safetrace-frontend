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
import { MONTH_NAMES } from '@/constants/months';
import { getCurrentUserRoles, isViewOnlyRole } from '@/libs/permissions';
import {
  deleteProduksi,
  getDetailProduksiKebun,
  getListProduksiKebun,
  updateProduksi,
} from '@/services/produksi';

const formatNumber = (num) =>
  typeof num === 'number'
    ? num.toLocaleString('id-ID')
    : (Number(num) || 0).toLocaleString('id-ID');

const TraceabilityProduksiDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  // Determine if the current user is view-only (Disbunak Kalbar / Disbunak Sekadau)
  const isViewOnly = isViewOnlyRole(getCurrentUserRoles());

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
        const [resKebun, resList] = await Promise.all([
          getDetailProduksiKebun(id),
          getListProduksiKebun(id),
        ]);

        const kebun = resKebun?.data?.data || resKebun?.data || {};
        const listPayload = resList?.data?.data || resList?.data || {};
        const results = listPayload?.results || listPayload?.data || [];

        const produksiTahunan = (Array.isArray(results) ? results : []).map(
          (r) => ({
            id: r?.id,
            tahun: r?.tahun ?? 0,
            bulan: {
              Januari: r?.januari ?? 0,
              Februari: r?.februari ?? 0,
              Maret: r?.maret ?? 0,
              April: r?.april ?? 0,
              Mei: r?.mei ?? 0,
              Juni: r?.juni ?? 0,
              Juli: r?.juli ?? 0,
              Agustus: r?.agustus ?? 0,
              September: r?.september ?? 0,
              Oktober: r?.oktober ?? 0,
              November: r?.november ?? 0,
              Desember: r?.desember ?? 0,
            },
          })
        );

        const latestYear = produksiTahunan.length
          ? Math.max(...produksiTahunan.map((y) => Number(y.tahun) || 0))
          : null;

        setDetail({
          kebun: {
            id: kebun?.kebun_id ?? null,
            id_kebun: kebun?.id_kebun ?? '-',
            petani: kebun?.nama_petani ?? '-',
            kelompok_tani: kebun?.kelompok_tani ?? '-',
            total_produksi_kg: kebun?.total_produksi ?? 0,
            umur_tanaman: kebun?.umur_tanaman ?? null,
            prod_per_ha_th_ton: kebun?.prod_ha_th ?? 0,
            tahun_tanam: kebun?.tahun_tanam ?? null,
            luas_kebun_ha:
              typeof kebun?.luas_kebun === 'string'
                ? Number(kebun.luas_kebun)
                : kebun?.luas_kebun ?? null,
            tahun_produksi: latestYear,
          },
          produksi_tahunan: produksiTahunan,
        });
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
    const monthEntries = MONTH_NAMES.map((m) => ({
      name: m,
      valueKg: yearData?.bulan?.[m] ?? 0,
    }));

    const firstRow = monthEntries.slice(0, 6);
    const secondRow = monthEntries.slice(6);

    return (
      <section
        key={`tahun-${yearData.tahun}`}
        className="rounded border border-neutral-300 bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">TAHUN {yearData.tahun}</h3>
          {!isViewOnly && (
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="text-sm font-medium text-tertiary underline hover:text-tertiary"
                onClick={() => {
                  setDeleteYearData(yearData);
                  setShowDeleteModal(true);
                }}
              >
                Hapus
              </button>
              <button
                type="button"
                className="text-sm font-medium text-primary underline hover:text-primary"
                onClick={() => {
                  setEditYearData(yearData);
                  setIsEditOpen(true);
                }}
              >
                Ubah Data
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-neutral-700 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {firstRow.map((m) => (
            <div key={`${yearData.tahun}-${m.name}`} className="">
              <div className="text-neutral-500">{m.name}</div>
              <div className="font-medium">{formatNumber(m.valueKg)} Kg</div>
            </div>
          ))}

          <div className="col-span-2 border-b border-dashed border-neutral-300 sm:col-span-3 md:col-span-4 lg:col-span-6" />

          {secondRow.map((m) => (
            <div key={`${yearData.tahun}-${m.name}`} className="">
              <div className="text-neutral-500">{m.name}</div>
              <div className="font-medium">{formatNumber(m.valueKg)} Kg</div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="flex w-full min-w-[320px] max-w-full flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:px-0">
      <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
        <BreadcrumbDetail items={crumbs} />
        {!isViewOnly && (
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
            className="whitespace-nowrap text-xs sm:text-sm"
          >
            Tambah Tahun Produksi
          </Button>
        )}
      </div>

      <div className="flex w-full flex-col gap-6">
        {/* DETAIL KEBUN Card */}
        {detail?.kebun && (
          <section className="rounded border border-neutral-300 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">DETAIL KEBUN</h3>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 break-words text-sm text-neutral-700 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
                label="Luas Kebun (Ha)"
                value={detail.kebun.luas_kebun_ha ?? '-'}
              />
              <BorderBottomColData
                label="Tahun Tanam"
                value={detail.kebun.tahun_tanam ?? '-'}
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
        <div className="mb-4 flex flex-col gap-4">
          {detail?.produksi_tahunan?.map((y) => renderYearCard(y))}
        </div>

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
                MONTH_NAMES.map((m) => [monthKey[m], updatedMonths[m] ?? 0])
              );

              const payload = {
                kebun: Number(detail?.kebun?.id) || undefined,
                tahun: editYearData?.tahun,
                ...flatMonths,
              };
              await updateProduksi(editYearData?.id, payload);
              toast.success('Data produksi berhasil diperbarui');

              const [resKebun, resList] = await Promise.all([
                getDetailProduksiKebun(id),
                getListProduksiKebun(id),
              ]);
              const kebun = resKebun?.data?.data || resKebun?.data || {};
              const listPayload = resList?.data?.data || resList?.data || {};
              const results = listPayload?.results || listPayload?.data || [];
              const produksiTahunan = (
                Array.isArray(results) ? results : []
              ).map((r) => ({
                id: r?.id,
                tahun: r?.tahun ?? 0,
                bulan: {
                  Januari: r?.januari ?? 0,
                  Februari: r?.februari ?? 0,
                  Maret: r?.maret ?? 0,
                  April: r?.april ?? 0,
                  Mei: r?.mei ?? 0,
                  Juni: r?.juni ?? 0,
                  Juli: r?.juli ?? 0,
                  Agustus: r?.agustus ?? 0,
                  September: r?.september ?? 0,
                  Oktober: r?.oktober ?? 0,
                  November: r?.november ?? 0,
                  Desember: r?.desember ?? 0,
                },
              }));
              const latestYear = produksiTahunan.length
                ? Math.max(...produksiTahunan.map((y) => Number(y.tahun) || 0))
                : null;
              setDetail({
                kebun: {
                  id: kebun?.kebun_id ?? null,
                  id_kebun: kebun?.id_kebun ?? '-',
                  petani: kebun?.nama_petani ?? '-',
                  kelompok_tani: kebun?.kelompok_tani ?? '-',
                  total_produksi_kg: kebun?.total_produksi ?? 0,
                  umur_tanaman: kebun?.umur_tanaman ?? null,
                  prod_per_ha_th_ton: kebun?.prod_ha_th ?? 0,
                  tahun_tanam: kebun?.tahun_tanam ?? null,
                  luas_kebun_ha:
                    typeof kebun?.luas_kebun === 'string'
                      ? Number(kebun.luas_kebun)
                      : kebun?.luas_kebun ?? null,
                  tahun_produksi: latestYear,
                },
                produksi_tahunan: produksiTahunan,
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
            if (!deleteYearData?.id) return;
            try {
              setIsDeleting(true);
              await deleteProduksi(deleteYearData.id);
              toast.success('Data produksi berhasil dihapus');
              setShowDeleteModal(false);

              const [resKebun, resList] = await Promise.all([
                getDetailProduksiKebun(id),
                getListProduksiKebun(id),
              ]);
              const kebun = resKebun?.data?.data || resKebun?.data || {};
              const listPayload = resList?.data?.data || resList?.data || {};
              const results = listPayload?.results || listPayload?.data || [];
              const produksiTahunan = (
                Array.isArray(results) ? results : []
              ).map((r) => ({
                id: r?.id,
                tahun: r?.tahun ?? 0,
                bulan: {
                  Januari: r?.januari ?? 0,
                  Februari: r?.februari ?? 0,
                  Maret: r?.maret ?? 0,
                  April: r?.april ?? 0,
                  Mei: r?.mei ?? 0,
                  Juni: r?.juni ?? 0,
                  Juli: r?.juli ?? 0,
                  Agustus: r?.agustus ?? 0,
                  September: r?.september ?? 0,
                  Oktober: r?.oktober ?? 0,
                  November: r?.november ?? 0,
                  Desember: r?.desember ?? 0,
                },
              }));
              const latestYear = produksiTahunan.length
                ? Math.max(...produksiTahunan.map((y) => Number(y.tahun) || 0))
                : null;
              setDetail({
                kebun: {
                  id: kebun?.kebun_id ?? null,
                  id_kebun: kebun?.id_kebun ?? '-',
                  petani: kebun?.nama_petani ?? '-',
                  kelompok_tani: kebun?.kelompok_tani ?? '-',
                  total_produksi_kg: kebun?.total_produksi ?? 0,
                  umur_tanaman: kebun?.umur_tanaman ?? null,
                  prod_per_ha_th_ton: kebun?.prod_ha_th ?? 0,
                  tahun_tanam: kebun?.tahun_tanam ?? null,
                  luas_kebun_ha:
                    typeof kebun?.luas_kebun === 'string'
                      ? Number(kebun.luas_kebun)
                      : kebun?.luas_kebun ?? null,
                  tahun_produksi: latestYear,
                },
                produksi_tahunan: produksiTahunan,
              });
              setDeleteYearData(null);
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
  if (v === null || v === undefined || v === '') return '';
  if (typeof v === 'string' && (v.endsWith('.') || v.endsWith('.0'))) {
    return v;
  }
  const num = Number(v);
  if (Number.isNaN(num)) return '';
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 10,
  }).format(num);
};

const parseKgInput = (v) => {
  if (!v) return 0;
  const cleanStr = String(v).replace(/\./g, '').replace(/,/g, '.');
  const num = Number(cleanStr);
  return Number.isNaN(num) ? 0 : num;
};

const EditProduksiModal = ({ open, onClose, yearData, onSave }) => {
  const initialValues = useMemo(() => {
    const months = MONTH_NAMES.reduce((acc, m) => {
      const val = yearData?.bulan?.[m] ?? 0;
      acc[m] = formatKgInput(val);
      return acc;
    }, {});
    return months;
  }, [yearData]);

  const validationSchema = useMemo(() => {
    const shape = MONTH_NAMES.reduce((acc, m) => {
      acc[m] = Yup.string()
        .nullable()
        .test('angka-valid', 'Harus angka >= 0', (val) => {
          if (!val) return true;
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
      const updated = MONTH_NAMES.reduce((acc, m) => {
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
          {MONTH_NAMES.map((m) => (
            <InputText
              key={`input-${m}`}
              label={m}
              name={m}
              placeholder="0"
              value={formik.values[m] || ''}
              onChange={(e) => {
                const val = e.target.value;
                // Allow user to type numbers and optionally comma (as decimal separator in id-ID)
                if (/^[\d.,]*$/.test(val)) {
                  formik.setFieldValue(m, val);
                }
              }}
              onBlur={(e) => {
                const formatted = formatKgInput(parseKgInput(e.target.value));
                formik.setFieldValue(m, formatted);
                formik.handleBlur(e);
              }}
              errors={formik.errors}
              touched={formik.touched}
              suffix="Kg"
              type="string"
              
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
