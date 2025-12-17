'use client';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import useReferences from '@/hooks/useReferences';
import { createPenjualanKelompokPenyetorBulk } from '@/services/penjualan';
import { getListPetani } from '@/services/petani';

const PetaniMemberSelector = ({
  selectedMembers = [],
  onMembersChange,
  kelompokTaniId,
  label = 'Anggota Petani Penyetor',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableMembers, setAvailableMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedMembers, setCheckedMembers] = useState({});

  const normalizeGender = (jns_kelamin) => {
    if (jns_kelamin === '1' || jns_kelamin === 1) return 'Laki - Laki';
    if (jns_kelamin === '2' || jns_kelamin === 2) return 'Perempuan';
    return '-';
  };

  const fetchPetaniByKelompok = useCallback(async (kelompokId, search = '') => {
    if (!kelompokId) {
      setAvailableMembers([]);
      return;
    }

    setLoading(true);
    try {
      const params = {
        kelompok_tani: kelompokId,
        page_size: 100, // Get all members
        ...(search && { search }),
      };

      const response = await getListPetani(params);
      if (response?.status === 200) {
        const data = response?.data?.data;
        const results = data?.results || [];

        const mapped = results.map((item) => ({
          id: item?.id,
          id_petani: item?.id_petani || '-',
          nama: item?.nama || '-',
          jenis_kelamin: normalizeGender(item?.jns_kelamin),
        }));

        setAvailableMembers(mapped);
      }
    } catch (error) {
      console.error('Error fetching petani:', error);
      setAvailableMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (kelompokTaniId) {
      const timeoutId = setTimeout(() => {
        fetchPetaniByKelompok(kelompokTaniId, searchQuery);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setAvailableMembers([]);
    }
  }, [kelompokTaniId, searchQuery, fetchPetaniByKelompok]);

  // Sync checked state with selected members
  useEffect(() => {
    const checked = {};
    selectedMembers.forEach((member) => {
      checked[member.id] = true;
    });
    setCheckedMembers(checked);
  }, [selectedMembers]);

  const handleRemoveSelectedMember = (memberId) => {
    const updatedMembers = selectedMembers.filter(
      (member) => member.id !== memberId
    );
    setCheckedMembers((prev) => ({
      ...prev,
      [memberId]: false,
    }));
    onMembersChange?.(updatedMembers);
  };

  const handleCheckboxChange = (member) => {
    const isCurrentlySelected = selectedMembers.some(
      (selected) => selected.id === member.id
    );

    if (isCurrentlySelected) {
      // Remove member
      const updatedMembers = selectedMembers.filter(
        (selected) => selected.id !== member.id
      );
      setCheckedMembers((prev) => ({
        ...prev,
        [member.id]: false,
      }));
      onMembersChange?.(updatedMembers);
    } else {
      // Add member
      const updatedMembers = [...selectedMembers, member];
      setCheckedMembers((prev) => ({
        ...prev,
        [member.id]: true,
      }));
      onMembersChange?.(updatedMembers);
      // Clear search query after selecting a member
      setSearchQuery('');
    }
  };

  const isMemberSelected = (memberId) => {
    return selectedMembers.some((member) => member.id === memberId);
  };

  const filteredMembers = availableMembers.filter((member) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      member.nama.toLowerCase().includes(query) ||
      member.id_petani.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-1 w-full">
      <label className="block text-[12px] font-bold text-gray-500">
        {label}
      </label>

      {/* Selected Members Chips with Search Input */}
      <div className="flex items-center gap-2 rounded-[4px] border border-gray-300 bg-white px-3 min-h-[40px] overflow-x-auto w-full max-w-full">
        <div className="flex items-center gap-2 flex-shrink-0">
          {selectedMembers.map((member) => (
            <div
              key={member.id}
              className="inline-flex items-center gap-1 rounded-[4px] bg-gray-100 px-2 py-1 text-sm whitespace-nowrap flex-shrink-0"
            >
              <button
                onClick={() => handleRemoveSelectedMember(member.id)}
                className="rounded-full p-0.5 text-gray-400 hover:text-red-500 flex-shrink-0"
                title="Hapus"
              >
                <X className="h-3 w-3" />
              </button>
              <span className="font-medium">
                {member.nama} - {member.jenis_kelamin}
              </span>
            </div>
          ))}
        </div>
        {/* Search Input - inline with chips, always visible */}
        <input
          type="text"
          placeholder="Cari anggota..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-shrink-0 min-w-[150px] border-0 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Available Members List */}
      <div className="max-h-[200px] overflow-y-auto rounded-[4px] border border-gray-200 bg-white">
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            Memuat data...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            {kelompokTaniId
              ? 'Tidak ada anggota tersedia'
              : 'Pilih Kelompok Penyetor terlebih dahulu'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredMembers.map((member) => {
              const isSelected = isMemberSelected(member.id);
              const isChecked = checkedMembers[member.id] || isSelected;

              return (
                <div
                  key={member.id}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 ${
                    isSelected ? 'bg-gray-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(member)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {member.id_petani}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-900">
                    {member.nama}
                  </span>
                  <span className="text-sm text-gray-600">
                    {member.jenis_kelamin}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const KelompokPenyetorSection = ({
  index,
  kelompokOptions,
  value,
  onChange,
  onRemove,
  canRemove,
}) => {
  const [selectedKelompok, setSelectedKelompok] = useState(
    value?.kelompok_penyetor || null
  );
  const [selectedMembers, setSelectedMembers] = useState(
    value?.anggota_petani || []
  );

  useEffect(() => {
    if (value) {
      setSelectedKelompok(value.kelompok_penyetor || null);
      setSelectedMembers(value.anggota_petani || []);
    }
  }, [value]);

  const handleKelompokChange = (e) => {
    const kelompokId = e.target.value;
    setSelectedKelompok(kelompokId);
    setSelectedMembers([]); // Reset members when kelompok changes
    onChange({
      kelompok_penyetor: kelompokId,
      anggota_petani: [],
    });
  };

  const handleMembersChange = (members) => {
    setSelectedMembers(members);
    onChange({
      kelompok_penyetor: selectedKelompok,
      anggota_petani: members,
    });
  };

  return (
    <div className="space-y-4 w-full border-b border-dashed border-gray-300 pb-6 last:border-b-0">
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex flex-1 min-w-0 lg:min-w-[200px]">
          <Select
            label="Kelompok Penyetor"
            name={`kelompok_penyetor_${index}`}
            placeholder="Pilih Kelompok Penyetor"
            options={kelompokOptions}
            value={selectedKelompok}
            onChange={handleKelompokChange}
            isRequired
          />
        </div>

        <div className="flex flex-1 lg:flex-[2] min-w-0">
          <PetaniMemberSelector
            selectedMembers={selectedMembers}
            onMembersChange={handleMembersChange}
            kelompokTaniId={selectedKelompok}
            label="Anggota Petani Penyetor"
          />
        </div>
      </div>

      {canRemove && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="danger"
            size="small"
            onClick={onRemove}
          >
            Hapus Kelompok
          </Button>
        </div>
      )}
    </div>
  );
};

const DataKelompokTani = ({
  kelompokTaniData,
  onNext,
  onPrevious,
  onCancel,
  isSubmitting,
}) => {
  const params = useParams();
  const searchParams = useSearchParams();
  // Get idAngkutan from URL path parameter [id] instead of query params
  const idAngkutan = params?.id || searchParams.get('idAngkutan');
  const { kelompokTani, fetchKelompokTani } = useReferences();
  const [kelompokPenyetorList, setKelompokPenyetorList] = useState([
    { id: Date.now(), kelompok_penyetor: null, anggota_petani: [] },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchKelompokTani();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (kelompokTaniData && kelompokTaniData.length > 0) {
      setKelompokPenyetorList(kelompokTaniData);
    }
  }, [kelompokTaniData]);

  const kelompokOptions =
    kelompokTani?.map((item) => ({
      label: item.label,
      value: item.value,
    })) || [];

  // Helper function to get kelompok name by ID
  const getKelompokNameById = (kelompokId) => {
    const kelompok = kelompokTani?.find((item) => item.value === kelompokId);
    return kelompok?.label || '';
  };

  const validationSchema = Yup.object().shape({
    kelompokPenyetorList: Yup.array()
      .of(
        Yup.object().shape({
          kelompok_penyetor: Yup.string().required(
            'Kelompok Penyetor harus diisi'
          ),
          anggota_petani: Yup.array()
            .min(1, 'Minimal pilih 1 anggota petani')
            .required('Anggota Petani Penyetor harus diisi'),
        })
      )
      .min(1, 'Minimal tambahkan 1 kelompok penyetor'),
  });

  const formik = useFormik({
    initialValues: {
      kelompokPenyetorList,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onNext(values.kelompokPenyetorList);
    },
  });

  const handleAddKelompokPenyetor = () => {
    const newList = [
      ...kelompokPenyetorList,
      { id: Date.now(), kelompok_penyetor: null, anggota_petani: [] },
    ];
    setKelompokPenyetorList(newList);
    formik.setFieldValue('kelompokPenyetorList', newList);
  };

  const handleRemoveKelompokPenyetor = (index) => {
    if (kelompokPenyetorList.length > 1) {
      const newList = kelompokPenyetorList.filter((_, i) => i !== index);
      setKelompokPenyetorList(newList);
      formik.setFieldValue('kelompokPenyetorList', newList);
    }
  };

  const handleSectionChange = (index, data) => {
    const newList = [...kelompokPenyetorList];
    newList[index] = data;
    setKelompokPenyetorList(newList);
    formik.setFieldValue('kelompokPenyetorList', newList);
  };

  const handleSubmit = async () => {
    // Validate that all sections have kelompok and at least one member
    const isValid = kelompokPenyetorList.every(
      (section) =>
        section.kelompok_penyetor && section.anggota_petani.length > 0
    );

    if (!isValid) {
      formik.setFieldError(
        'kelompokPenyetorList',
        'Semua kelompok penyetor harus memiliki anggota petani'
      );
      return;
    }

    // Check if idAngkutan is available
    if (!idAngkutan) {
      toast.error(
        'ID Angkutan tidak ditemukan. Silakan kembali ke langkah sebelumnya.'
      );
      return;
    }

    setIsSaving(true);
    try {
      // Format data for API
      const kelompokData = kelompokPenyetorList.map((section) => ({
        nama_kelompok: getKelompokNameById(section.kelompok_penyetor),
        anggota_petani: section.anggota_petani.map((member) => member.id),
      }));

      const payload = {
        angkutan: Number(idAngkutan),
        kelompok_data: kelompokData,
      };

      // Call API to create kelompok penyetor
      const response = await createPenjualanKelompokPenyetorBulk(payload);

      if (
        response?.status === 200 ||
        response?.status === 201 ||
        response?.data?.status === 'success'
      ) {
        toast.success('Data kelompok penyetor berhasil disimpan');
        // Proceed to next step with the form data
        await onNext(kelompokPenyetorList);
      } else {
        toast.error(
          response?.data?.message || 'Gagal menyimpan data kelompok penyetor'
        );
      }
    } catch (error) {
      console.error('Error saving kelompok penyetor:', error);
      toast.error(
        error?.response?.data?.message ||
          'Terjadi kesalahan saat menyimpan data kelompok penyetor'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-300 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">DETAIL KELOMPOK TANI</h3>

        <div className="space-y-6">
          {kelompokPenyetorList.map((section, index) => (
            <KelompokPenyetorSection
              key={section.id || index}
              index={index}
              kelompokOptions={kelompokOptions}
              value={section}
              onChange={(data) => handleSectionChange(index, data)}
              onRemove={() => handleRemoveKelompokPenyetor(index)}
              canRemove={kelompokPenyetorList.length > 1}
            />
          ))}
        </div>

        <div className="mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddKelompokPenyetor}
          >
            Tambah Kelompok Penyetor
          </Button>
        </div>

        {formik.errors.kelompokPenyetorList && (
          <div className="mt-2 text-sm text-red-500">
            {typeof formik.errors.kelompokPenyetorList === 'string'
              ? formik.errors.kelompokPenyetorList
              : 'Terdapat kesalahan pada data kelompok penyetor'}
          </div>
        )}

        <div className="mt-6 flex justify-between gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onPrevious}
            disabled={isSubmitting || isSaving}
          >
            Kembali
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            isLoading={isSubmitting || isSaving}
            isDisabled={isSubmitting || isSaving}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataKelompokTani;
