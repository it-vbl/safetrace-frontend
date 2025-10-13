'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import useYearOptions from '@/hooks/useYearOptions';

const TambahTahunLB3Page = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tahun: new Date().getFullYear().toString(),
    limbahBotol: '2',
    limbahJeriken: '2',
    limbahKarungPupuk: '2',
  });

  // Use existing year options hook
  const tahunOptions = useYearOptions();

  const crumbs = [
    { label: 'LB3', href: '/traceability/gap/lb3' },
    { label: 'DETAIL LB3', href: `/traceability/gap/lb3/${params.id}` },
    { label: 'TAMBAH TAHUN LB3' },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation, you would call the API here:
      // const wasteData = [
      //   { type: 'Limbah Botol', quantity: `${formData.limbahBotol} Kg` },
      //   { type: 'Limbah Jeriken', quantity: `${formData.limbahJeriken} Kg` },
      //   { type: 'Limbah Karung Pupuk', quantity: `${formData.limbahKarungPupuk} Kg` },
      // ];
      // await LB3Service.addTahunLB3(params.id, {
      //   tahun: parseInt(formData.tahun),
      //   wasteData: wasteData
      // });

      toast.success(`Data tahun ${formData.tahun} berhasil ditambahkan`);
      router.push(`/traceability/gap/lb3/${params.id}`);
    } catch (error) {
      console.error('Error adding tahun LB3:', error);
      toast.error('Gagal menambahkan data tahun LB3');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/traceability/gap/lb3/${params.id}`);
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex items-center justify-between">
        <BreadcrumbDetail items={crumbs} />
      </div>

      <div className="flex flex-col gap-6">
        {/* Form Section */}
        <section className="rounded border border-gray-300 bg-white p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              LIMBAH BAHAN BERBAHAYA BERACUN
            </h2>
          </div>

          <div className="space-y-6">
            {/* Tahun Input */}
            <div className="">
              <Select
                label="Tahun"
                placeholder="Pilih Tahun"
                options={tahunOptions}
                value={formData.tahun}
                onChange={(e) => handleInputChange('tahun', e.target.value)}
                name="tahun"
                isRequired
              />
            </div>

            {/* Waste Data Inputs */}
            <div className="grid grid-cols-3 gap-4 md:grid-cols-3">
              <InputText
                label="Limbah Botol"
                type="number"
                value={formData.limbahBotol}
                onChange={(e) =>
                  handleInputChange('limbahBotol', e.target.value)
                }
                placeholder="0"
                suffix="Kg"
                minNumber={0}
                name="limbahBotol"
                isRequired
              />

              <InputText
                label="Limbah Jeriken"
                type="number"
                value={formData.limbahJeriken}
                onChange={(e) =>
                  handleInputChange('limbahJeriken', e.target.value)
                }
                placeholder="0"
                suffix="Kg"
                minNumber={0}
                name="limbahJeriken"
                isRequired
              />

              <InputText
                label="Limbah Karung Pupuk"
                type="number"
                value={formData.limbahKarungPupuk}
                onChange={(e) =>
                  handleInputChange('limbahKarungPupuk', e.target.value)
                }
                placeholder="0"
                suffix="Kg"
                minNumber={0}
                name="limbahKarungPupuk"
                isRequired
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            <Button
              type="button"
              variant="danger"
              onClick={handleCancel}
              disabled={loading}
            >
              Batalkan
            </Button>
            <Button type="button" onClick={handleSave} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

TambahTahunLB3Page.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default TambahTahunLB3Page;
