'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';
import Select from '@/components/molecules/Select';
import YearCard from '@/components/molecules/YearCard';
import { MONTH_NAMES } from '@/constants/months';
import {
  deletePestisida,
  getDetailPestisida,
  updatePestisida,
} from '@/services/pestisida';
import { formatLiterInput, parseLiterInput } from '@/utils/literFormat';

const formatNumber = (num) =>
  typeof num === 'number'
    ? num.toLocaleString('id-ID')
    : (Number(num) || 0).toLocaleString('id-ID');

const MONTH_OPTIONS = MONTH_NAMES.map((m, i) => ({ label: m, value: i + 1 }));

const EditPestisidaModal = ({ open, onClose, yearData, onSave }) => {
  const initialValues = useMemo(() => {
    const labelToIndex = (label) => {
      const idx = MONTH_NAMES.indexOf(label);
      return idx >= 0 ? idx + 1 : '';
    };

    const s1 = yearData?.semester?.['Semester 1'] ?? {
      sistemik: { waktu: '', jumlah: 0 },
      kontak: { waktu: '', jumlah: 0 },
    };
    const s2 = yearData?.semester?.['Semester 2'] ?? {
      sistemik: { waktu: '', jumlah: 0 },
      kontak: { waktu: '', jumlah: 0 },
    };

    return {
      s1_sistemik_waktu: labelToIndex(s1.sistemik.waktu || ''),
      s1_sistemik_jumlah: formatLiterInput(s1.sistemik.jumlah || 0),
      s1_kontak_waktu: labelToIndex(s1.kontak.waktu || ''),
      s1_kontak_jumlah: formatLiterInput(s1.kontak.jumlah || 0),
      s2_sistemik_waktu: labelToIndex(s2.sistemik.waktu || ''),
      s2_sistemik_jumlah: formatLiterInput(s2.sistemik.jumlah || 0),
      s2_kontak_waktu: labelToIndex(s2.kontak.waktu || ''),
      s2_kontak_jumlah: formatLiterInput(s2.kontak.jumlah || 0),
    };
  }, [yearData]);

  const validationSchema = Yup.object().shape({
    s1_sistemik_waktu: Yup.number()
      .typeError('Wajib diisi')
      .min(1)
      .max(12)
      .required('Wajib diisi'),
    s1_sistemik_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseLiterInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s1_kontak_waktu: Yup.number()
      .typeError('Wajib diisi')
      .min(1)
      .max(12)
      .required('Wajib diisi'),
    s1_kontak_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseLiterInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s2_sistemik_waktu: Yup.number()
      .typeError('Wajib diisi')
      .min(1)
      .max(12)
      .required('Wajib diisi'),
    s2_sistemik_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseLiterInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s2_kontak_waktu: Yup.number()
      .typeError('Wajib diisi')
      .min(1)
      .max(12)
      .required('Wajib diisi'),
    s2_kontak_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseLiterInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        tahun: yearData?.tahun,
        s1_sistemik_waktu_aplikasi: Number(values.s1_sistemik_waktu),
        s1_sistemik_jumlah: parseLiterInput(values.s1_sistemik_jumlah),
        s1_kontak_waktu_aplikasi: Number(values.s1_kontak_waktu),
        s1_kontak_jumlah: parseLiterInput(values.s1_kontak_jumlah),
        s2_sistemik_waktu_aplikasi: Number(values.s2_sistemik_waktu),
        s2_sistemik_jumlah: parseLiterInput(values.s2_sistemik_jumlah),
        s2_kontak_waktu_aplikasi: Number(values.s2_kontak_waktu),
        s2_kontak_jumlah: parseLiterInput(values.s2_kontak_jumlah),
      };

      onSave?.(payload);
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
      <div id="modal" className="pt-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Semester 1 */}
          <div>
            <div className="mb-2 text-sm font-semibold">Semester 1</div>
            <Select
              label="(Sistemik) Waktu Aplikasi"
              name="s1_sistemik_waktu"
              placeholder="Pilih bulan"
              options={MONTH_OPTIONS}
              value={formik.values.s1_sistemik_waktu}
              onChange={(e) =>
                formik.setFieldValue(
                  's1_sistemik_waktu',
                  Number(e.target.value)
                )
              }
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              isRequired={true}
            />
            <InputText
              label="(Sistemik) Jumlah"
              name="s1_sistemik_jumlah"
              placeholder="0"
              value={formik.values.s1_sistemik_jumlah}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              suffix="Liter"
              type="string"
              formatter={formatLiterInput}
              isRequired={true}
            />
            <Select
              label="(Kontak) Waktu Aplikasi"
              name="s1_kontak_waktu"
              placeholder="Pilih bulan"
              options={MONTH_OPTIONS}
              value={formik.values.s1_kontak_waktu}
              onChange={(e) =>
                formik.setFieldValue('s1_kontak_waktu', Number(e.target.value))
              }
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              isRequired={true}
            />
            <InputText
              label="(Kontak) Jumlah"
              name="s1_kontak_jumlah"
              placeholder="0"
              value={formik.values.s1_kontak_jumlah}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              suffix="Liter"
              type="string"
              formatter={formatLiterInput}
              isRequired={true}
            />
          </div>

          {/* Semester 2 */}
          <div>
            <div className="mb-2 text-sm font-semibold">Semester 2</div>
            <Select
              label="(Sistemik) Waktu Aplikasi"
              name="s2_sistemik_waktu"
              placeholder="Pilih bulan"
              options={MONTH_OPTIONS}
              value={formik.values.s2_sistemik_waktu}
              onChange={(e) =>
                formik.setFieldValue(
                  's2_sistemik_waktu',
                  Number(e.target.value)
                )
              }
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              isRequired={true}
            />
            <InputText
              label="(Sistemik) Jumlah"
              name="s2_sistemik_jumlah"
              placeholder="0"
              value={formik.values.s2_sistemik_jumlah}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              suffix="Liter"
              type="string"
              formatter={formatLiterInput}
              isRequired={true}
            />
            <Select
              label="(Kontak) Waktu Aplikasi"
              name="s2_kontak_waktu"
              placeholder="Pilih bulan"
              options={MONTH_OPTIONS}
              value={formik.values.s2_kontak_waktu}
              onChange={(e) =>
                formik.setFieldValue('s2_kontak_waktu', Number(e.target.value))
              }
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              isRequired={true}
            />
            <InputText
              label="(Kontak) Jumlah"
              name="s2_kontak_jumlah"
              placeholder="0"
              value={formik.values.s2_kontak_jumlah}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              suffix="Liter"
              type="string"
              formatter={formatLiterInput}
              isRequired={true}
            />
          </div>
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

EditPestisidaModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  yearData: PropTypes.shape({
    tahun: PropTypes.number.isRequired,
    semester: PropTypes.shape({
      'Semester 1': PropTypes.shape({
        sistemik: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        kontak: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
      }),
      'Semester 2': PropTypes.shape({
        sistemik: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        kontak: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
      }),
    }),
  }),
  onSave: PropTypes.func,
};

const TraceabilityPestisidaDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const [detail, setDetail] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editYearData, setEditYearData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PESTISIDA', href: '/traceability/gap/pestisida' },
    { label: 'DETAIL PESTISIDA' },
  ];

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getDetailPestisida(id);
        const data = res?.data?.data || res?.data || null;
        if (data) {
          const penggunaan = {
            tahun: data?.tahun ?? null,
            semester: {
              'Semester 1': {
                sistemik: {
                  waktu: data?.s1_sistemik_waktu_label ?? '-',
                  jumlah: Number(data?.s1_sistemik_jumlah) || 0,
                },
                kontak: {
                  waktu: data?.s1_kontak_waktu_label ?? '-',
                  jumlah: Number(data?.s1_kontak_jumlah) || 0,
                },
              },
              'Semester 2': {
                sistemik: {
                  waktu: data?.s2_sistemik_waktu_label ?? '-',
                  jumlah: Number(data?.s2_sistemik_jumlah) || 0,
                },
                kontak: {
                  waktu: data?.s2_kontak_waktu_label ?? '-',
                  jumlah: Number(data?.s2_kontak_jumlah) || 0,
                },
              },
            },
          };

          const normalized = {
            id: data?.id,
            kebun: data?.kebun ?? null,
            id_kebun: data?.id_kebun ?? '-',
            nama_petani: data?.nama_petani ?? '-',
            kelompok_tani: data?.kelompok_tani ?? '-',
            luas_kebun_ha:
              typeof data?.luas_kebun === 'string'
                ? Number(data.luas_kebun)
                : data?.luas_kebun ?? null,
            tahun_tanam: data?.tahun ?? null,
            umur_tanaman: data?.umur_tanaman ?? null,
            total_pestisida:
              typeof data?.total_pestisida === 'number'
                ? data.total_pestisida
                : Number(data?.total_pestisida) || 0,
            intensitas_per_ha: data?.intensitas_per_ha ?? null,
            penggunaan_tahunan: penggunaan?.tahun ? [penggunaan] : [],
          };

          setDetail(normalized);
        } else {
          toast.error('Detail pestisida tidak ditemukan');
        }
      } catch (err) {
        toast.error('Gagal memuat detail pestisida');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  const umurTanamanText = useMemo(() => {
    if (detail?.umur_tanaman == null || detail?.umur_tanaman < 0) return '-';
    return `${detail.umur_tanaman} Tahun`;
  }, [detail]);

  const handleEditYear = (yearData) => {
    setEditYearData(yearData);
    setIsEditOpen(true);
  };

  const handleDeleteYear = (yearData) => {
    setEditYearData(yearData);
    setShowDeleteModal(true);
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex justify-between">
        <BreadcrumbDetail items={crumbs} />
        <Button
          variant="primary"
          size="medium"
          onClick={() => {
            const kebunId = detail?.kebun;
            if (kebunId) {
              router.push(
                `/traceability/gap/pestisida/tambah?kebun=${kebunId}`
              );
            } else {
              router.push('/traceability/gap/pestisida/tambah');
            }
          }}
          className="whitespace-nowrap"
        >
          Tambah Tahun Pestisida
        </Button>
      </div>

      <div className="flex flex-col gap-6 ">
        {/* DETAIL KEBUN Card */}
        {detail && (
          <section className="rounded border border-gray-300 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">DETAIL KEBUN</h3>
            </div>

            <div className="grid grid-cols-6 gap-x-6 gap-y-4 text-sm text-gray-700">
              <BorderBottomColData
                label="Id Kebun"
                value={detail.id_kebun ?? '-'}
              />
              <BorderBottomColData
                label="Petani"
                value={detail.nama_petani ?? '-'}
              />
              <BorderBottomColData
                label="Kelompok Tani"
                value={detail.kelompok_tani ?? '-'}
              />
              <BorderBottomColData
                label="Luas Kebun (Ha)"
                value={detail.luas_kebun_ha ?? '-'}
              />
              <BorderBottomColData
                label="Tahun Tanam"
                value={detail.tahun_tanam ?? '-'}
              />
              <BorderBottomColData
                label="Umur Tanaman"
                value={umurTanamanText}
              />
              <BorderBottomColData
                label="Total Pestisida"
                value={`${formatNumber(detail.total_pestisida)} Liter`}
              />
            </div>
          </section>
        )}

        {/* Year Cards */}
        {detail?.penggunaan_tahunan?.map((yearData) => (
          <YearCard
            className="mb-4"
            key={yearData.tahun}
            yearData={yearData}
            onEdit={handleEditYear}
            onDelete={handleDeleteYear}
            title="Penggunaan Pestisida"
            dataFields={[
              { key: 'sistemik', label: '(Sistemik)', unit: 'Liter' },
              { key: 'kontak', label: '(Kontak)', unit: 'Liter' },
            ]}
          />
        ))}

        {/* Edit Modal */}
        <EditPestisidaModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          yearData={editYearData}
          onSave={async (updatedSemesters) => {
            try {
              const res = await updatePestisida(id, {
                kebun: detail?.kebun,
                ...updatedSemesters,
                tahun: editYearData?.tahun,
              });
              const ok = res?.status === 200;
              if (ok) {
                setDetail((prev) => {
                  if (!prev) return prev;
                  const updated = prev.penggunaan_tahunan.map((y) =>
                    y.tahun === editYearData?.tahun
                      ? {
                          ...y,
                          semester: {
                            'Semester 1': {
                              sistemik: {
                                waktu:
                                  MONTH_NAMES[
                                    updatedSemesters.s1_sistemik_waktu_aplikasi -
                                      1
                                  ],
                                jumlah: updatedSemesters.s1_sistemik_jumlah,
                              },
                              kontak: {
                                waktu:
                                  MONTH_NAMES[
                                    updatedSemesters.s1_kontak_waktu_aplikasi -
                                      1
                                  ],
                                jumlah: updatedSemesters.s1_kontak_jumlah,
                              },
                            },
                            'Semester 2': {
                              sistemik: {
                                waktu:
                                  MONTH_NAMES[
                                    updatedSemesters.s2_sistemik_waktu_aplikasi -
                                      1
                                  ],
                                jumlah: updatedSemesters.s2_sistemik_jumlah,
                              },
                              kontak: {
                                waktu:
                                  MONTH_NAMES[
                                    updatedSemesters.s2_kontak_waktu_aplikasi -
                                      1
                                  ],
                                jumlah: updatedSemesters.s2_kontak_jumlah,
                              },
                            },
                          },
                        }
                      : y
                  );
                  return { ...prev, penggunaan_tahunan: updated };
                });
                toast.success('Perubahan berhasil disimpan');
                setIsEditOpen(false);
              } else {
                throw new Error('Invalid response');
              }
            } catch (err) {
              toast.error('Gagal menyimpan perubahan');
            }
          }}
        />
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setEditYearData(null);
          }}
          onConfirm={async () => {
            try {
              setIsDeleting(true);
              const res = await deletePestisida(id);
              const ok =
                res?.data?.status === 'success' ||
                res?.status === 200 ||
                res?.status === 204;
              if (ok) {
                toast.success(
                  res?.data?.message || 'Data pestisida berhasil dihapus'
                );
                router.push('/traceability/gap/pestisida');
              } else {
                throw new Error('Invalid response');
              }
            } catch (err) {
              toast.error(
                err?.response?.data?.message || 'Gagal menghapus data pestisida'
              );
            } finally {
              setIsDeleting(false);
              setShowDeleteModal(false);
              setEditYearData(null);
            }
          }}
          itemName={`pestisida tahun ${editYearData?.tahun ?? ''}`}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default TraceabilityPestisidaDetail;
