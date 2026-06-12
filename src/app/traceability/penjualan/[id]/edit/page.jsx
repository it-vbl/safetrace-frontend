'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import Stepper from '@/components/molecules/Stepper';
import DataAngkutan from '@/components/organisms/PenjualanForm/DataAngkutan';
import DataKelompokTani from '@/components/organisms/PenjualanForm/DataKelompokTani';
import DataLampiran from '@/components/organisms/PenjualanForm/DataLampiran';
import DataPabrik from '@/components/organisms/PenjualanForm/DataPabrik';
import useReferences from '@/hooks/useReferences';
import {
  createPenjualanAngkutan,
  createPenjualanPabrik,
  getDetailPenjualanAngkutan,
  getDetailPenjualanKelompokPenyetor,
  getDetailPenjualanPabrik,
  getDetailPenjualanLampiran,
  updateAngkutanPabrik,
  updatePenjualanAngkutan,
} from '@/services/penjualan';
import { formatApiErrorMessage } from '@/utils/errorFormatter';

const EditPenjualanContent = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const idPenjualan = id || searchParams.get('idPenjualan');
  const { kelompokTani, fetchKelompokTani } = useReferences();

  const crumbs = [
    { label: 'PENJUALAN', href: '/traceability/penjualan' },
    { label: 'EDIT PENJUALAN' },
  ];

  // Stepper configuration
  const steps = [
    { title: 'Angkutan', key: 'angkutan' },
    { title: 'Kelompok Tani', key: 'kelompok_tani' },
    { title: 'Pabrik', key: 'pabrik' },
    { title: 'Lampiran', key: 'lampiran' },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [lastStep, setLastStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [penjualanData, setPenjualanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    angkutan: null,
    kelompokTani: null,
    pabrik: null,
    lampiran: null,
  });
  const [createdAngkutanId, setCreatedAngkutanId] = useState(null);
  const hasInitialized = useRef(false);

  // Fetch kelompok tani options on mount
  useEffect(() => {
    fetchKelompokTani();
  }, [fetchKelompokTani]);

  // Fetch data and determine step based on what exists (only on initial load)
  useEffect(() => {
    // Only run on initial load
    if (hasInitialized.current) {
      return;
    }

    const fetchDataAndDetermineStep = async () => {
      // Check for tab parameter from URL
      const tabFromUrl = searchParams.get('tab');
      if (!idPenjualan) {
        // New penjualan - start at step 1
        setCurrentStep(1);
        setLastStep(1);
        setCompletedSteps([]);
        hasInitialized.current = true;
        return;
      }

      setIsLoading(true);
      try {
        // Try to fetch angkutan detail first (using idPenjualan as angkutan id)
        let angkutanData = null;
        let kelompokPenyetorData = null;
        let formattedKelompokPenyetorData = null;
        let pabrikData = null;
        let formattedPabrikData = null;
        let lampiranData = null;

        try {
          const angkutanResponse = await getDetailPenjualanAngkutan(
            idPenjualan
          );
          if (
            angkutanResponse?.status === 200 &&
            (angkutanResponse?.data?.status === 'success' ||
              angkutanResponse?.data?.data)
          ) {
            angkutanData =
              angkutanResponse?.data?.data || angkutanResponse?.data;
          }
        } catch (error) {
          // Angkutan doesn't exist yet - that's okay
          console.error(error)
        }

        // If angkutan exists, try to fetch kelompok penyetor detail
        if (angkutanData) {
          try {
            // Use id_penjualan from angkutan data to fetch kelompok penyetor
            const penjualanIdFromAngkutan = angkutanData?.id_penjualan;
            if (penjualanIdFromAngkutan) {
              const kelompokPenyetorResponse =
                await getDetailPenjualanKelompokPenyetor(
                  penjualanIdFromAngkutan
                );
              if (
                kelompokPenyetorResponse?.status === 200 &&
                (kelompokPenyetorResponse?.data?.status === 'success' ||
                  kelompokPenyetorResponse?.data?.data)
              ) {
                // Support paginated and non-paginated responses
                kelompokPenyetorData =
                  kelompokPenyetorResponse?.data?.data?.results ||
                  kelompokPenyetorResponse?.data?.data ||
                  kelompokPenyetorResponse?.data;

                // Transform the API response to match form structure
                // API might return single object or array - handle both
                const kelompokPenyetorArray = Array.isArray(
                  kelompokPenyetorData
                )
                  ? kelompokPenyetorData
                  : [kelompokPenyetorData];

                formattedKelompokPenyetorData = kelompokPenyetorArray.map(
                  (item) => {
                    // Find kelompok ID by matching nama_kelompok with kelompokTani options
                    const kelompokOption = kelompokTani?.find(
                      (kelompok) => kelompok.label === item.nama_kelompok
                    );
                    const kelompokId = kelompokOption?.value || null;

                    // Transform anggota_petani to match form structure
                    const anggotaPetani = (item.anggota_petani || []).map(
                      (petani) => ({
                        id: petani.id,
                        id_petani: petani.id_petani || '-',
                        nama: petani.nama || '-',
                        jenis_kelamin:
                          petani.jns_kelamin_label ||
                          (petani.jns_kelamin === '1' ||
                            petani.jns_kelamin === 1
                            ? 'Laki - Laki'
                            : petani.jns_kelamin === '2' ||
                              petani.jns_kelamin === 2
                              ? 'Perempuan'
                              : '-'),
                      })
                    );

                    return {
                      id: item.id || Date.now(),
                      kelompok_penyetor: kelompokId,
                      anggota_petani: anggotaPetani,
                    };
                  }
                );
              }
            }
          } catch (error) {
            // Kelompok penyetor doesn't exist yet - that's okay
            console.error(error)
          }

          // If angkutan exists and has pabrik ID, try to fetch pabrik detail
          if (angkutanData?.pabrik) {
            try {
              const pabrikResponse = await getDetailPenjualanPabrik(
                angkutanData.pabrik
              );
              if (
                pabrikResponse?.status === 200 &&
                (pabrikResponse?.data?.status === 'success' ||
                  pabrikResponse?.data?.data)
              ) {
                pabrikData = pabrikResponse?.data?.data || pabrikResponse?.data;

                // Transform the API response to match form structure
                formattedPabrikData = {
                  id: pabrikData.id,
                  pabrik_id: pabrikData.id,
                  pabrik_penerima: pabrikData.nama || '',
                  nama: pabrikData.nama || '',
                  provinsi: String(pabrikData.provinsi || ''),
                  kabupaten: String(pabrikData.kabupaten || ''),
                  kecamatan: String(pabrikData.kecamatan || ''),
                  alamat: pabrikData.alamat || '',
                };
              }
            } catch (error) {
              // Pabrik doesn't exist yet - that's okay
              console.error(error)
            }
          }

          // Fetch lampiran details
          try {
            const lampiranResponse = await getDetailPenjualanLampiran(idPenjualan);
            if (
              lampiranResponse?.status === 200 &&
              (lampiranResponse?.data?.status === 'success' ||
                lampiranResponse?.data?.data)
            ) {
              lampiranData =
                lampiranResponse?.data?.data || lampiranResponse?.data;
            }
          } catch (error) {
            console.error('Error fetching lampiran:', error);
          }
        }

        // Determine current step based on what data exists and tab parameter
        let targetStep = 1;
        let targetLastStep = 1;
        let targetCompletedSteps = [];
        const hasKelompokTaniData =
          formattedKelompokPenyetorData &&
          Array.isArray(formattedKelompokPenyetorData) &&
          formattedKelompokPenyetorData.length > 0 &&
          formattedKelompokPenyetorData.some(
            (kelompok) =>
              kelompok.anggota_petani &&
              Array.isArray(kelompok.anggota_petani) &&
              kelompok.anggota_petani.length > 0
          );

        // Check if tab parameter is provided
        if (tabFromUrl === 'angkutan') {
          targetStep = 1;
        } else if (tabFromUrl === 'kelompok_tani') {
          targetStep = 2;
        } else if (tabFromUrl === 'pabrik') {
          // Validate if kelompok tani data exists before allowing pabrik tab
          if (!hasKelompokTaniData) {
            toast.error('Mohon lengkapi data kelompok tani terlebih dahulu');
            // Fall back to step 2 if kelompok tani data is missing
            targetStep = 2;
          } else {
            targetStep = 3;
          }
        } else if (tabFromUrl === 'lampiran') {
          if (!hasKelompokTaniData) {
            toast.error('Mohon lengkapi data kelompok tani terlebih dahulu');
            targetStep = 2;
          } else if (!formattedPabrikData) {
            toast.error('Mohon lengkapi data pabrik terlebih dahulu');
            targetStep = 3;
          } else {
            targetStep = 4;
          }
        }

        // Determine step based on data existence if no tab parameter or tab is invalid
        if (
          !tabFromUrl ||
          !['angkutan', 'kelompok_tani', 'pabrik', 'lampiran'].includes(tabFromUrl)
        ) {
          if (
            angkutanData &&
            formattedKelompokPenyetorData &&
            formattedPabrikData &&
            hasKelompokTaniData
          ) {
            // All steps completed - all data exists
            targetStep = 4;
            targetLastStep = 4;
            targetCompletedSteps = [1, 2, 3, 4];
          } else if (
            angkutanData &&
            formattedKelompokPenyetorData &&
            hasKelompokTaniData
          ) {
            // Step 1 and 2 completed, need step 3 (pabrik)
            targetStep = 3;
            targetLastStep = 3;
            targetCompletedSteps = [1, 2];
          } else if (angkutanData) {
            // Step 1 completed, need step 2 (kelompok_tani) and step 3 (pabrik)
            targetStep = 2;
            targetLastStep = 2;
            targetCompletedSteps = [1];
          } else {
            // No data exists, start from step 1
            targetStep = 1;
            targetLastStep = 1;
            targetCompletedSteps = [];
          }
        } else {
          // Tab parameter provided - determine lastStep and completedSteps based on data
          if (
            angkutanData &&
            formattedKelompokPenyetorData &&
            formattedPabrikData &&
            hasKelompokTaniData
          ) {
            targetLastStep = 4;
            targetCompletedSteps = [1, 2, 3, 4];
          } else if (
            angkutanData &&
            formattedKelompokPenyetorData &&
            hasKelompokTaniData
          ) {
            targetLastStep = 3;
            targetCompletedSteps = [1, 2];
          } else if (angkutanData) {
            targetLastStep = 2;
            targetCompletedSteps = [1];
          }
        }

        setCurrentStep(targetStep);
        setLastStep(targetLastStep);
        setCompletedSteps(targetCompletedSteps);
        setFormData({
          angkutan: angkutanData,
          kelompokTani: formattedKelompokPenyetorData,
          pabrik: formattedPabrikData,
          lampiran: lampiranData,
        });
        setPenjualanData({
          angkutan: angkutanData,
          kelompok_tani: formattedKelompokPenyetorData,
          pabrik: formattedPabrikData,
          lampiran: lampiranData,
        });

        // Mark as initialized after setting initial state
        hasInitialized.current = true;
      } catch (error) {
        console.error('Error fetching data:', error);
        // On error, start from step 1
        setCurrentStep(1);
        setLastStep(1);
        setCompletedSteps([]);
        hasInitialized.current = true;
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch data if kelompokTani options are loaded
    if (kelompokTani && kelompokTani.length > 0) {
      fetchDataAndDetermineStep();
    } else if (!idPenjualan) {
      // If no idPenjualan, we can still set initial state
      setCurrentStep(1);
      setLastStep(1);
      setCompletedSteps([]);
      hasInitialized.current = true;
    }
  }, [idPenjualan, kelompokTani, searchParams]);

  // Function to handle step click
  const handleStepClick = (stepNumber) => {
    if (idPenjualan || stepNumber <= lastStep) {
      setCurrentStep(stepNumber);
    }
  };

  // Function to proceed to next step
  const handleNextStep = async (stepData) => {
    setIsSubmitting(true);

    try {
      // Store form data for current step
      if (currentStep === 1) {
        // Check if we're editing existing data or creating new
        const existingAngkutan =
          formData.angkutan?.id || penjualanData?.angkutan?.id;

        // Only create if it's a new record
        if (!existingAngkutan) {
          // Prepare payload for API - convert string numbers to proper numbers
          const payload = {
            tanggal_penjualan: stepData.tanggal_penjualan,
            driver: stepData.driver,
            no_registrasi: stepData.no_registrasi,
            no_polisi: stepData.no_polisi,
            jumlah_tandan: Number(stepData.jumlah_tandan),
            berat_timbangan: parseFloat(stepData.berat_timbangan),
            tarra: parseFloat(stepData.tarra),
            t_potongan_persen: parseFloat(stepData.t_potongan_persen),
            t_potongan_kg: parseFloat(stepData.t_potongan_kg),
            berat_bersih: parseFloat(stepData.berat_bersih),
            harga_per_kilo: parseFloat(stepData.harga_per_kilo),
            total_penjualan: parseFloat(stepData.total_penjualan),
          };

          // Save angkutan data to API
          const response = await createPenjualanAngkutan(payload);

          if (
            response?.status === 200 ||
            response?.status === 201 ||
            response?.data?.status === 'success'
          ) {
            const createdData = response?.data?.data;
            // Store the created ID for potential use in subsequent steps
            if (createdData?.id) {
              toast.success('Data angkutan berhasil disimpan');
              // Redirect to edit page with angkutan id as URL param and query param for DataKelompokTani
              // Use replace to replace current history entry
              router.replace(
                `/traceability/penjualan/${createdData.id}/edit?idAngkutan=${createdData.id}`
              );
              return; // Exit early to prevent state updates after redirect
            }
            // Fallback if no ID (shouldn't happen)
            toast.error('ID angkutan tidak ditemukan dalam response');
          } else {
            // Handle error response with proper formatting
            const errorMessage = formatApiErrorMessage(response?.data);
            toast.error(errorMessage || 'Gagal menyimpan data angkutan');
          }
        } else {
          // Editing existing data - call update API
          // Get angkutan ID from URL params or form data
          const angkutanId = id || existingAngkutan;

          if (!angkutanId) {
            toast.error('ID angkutan tidak ditemukan');
            return;
          }

          // Prepare payload for API - convert string numbers to proper numbers
          const payload = {
            tanggal_penjualan: stepData.tanggal_penjualan,
            driver: stepData.driver,
            no_registrasi: stepData.no_registrasi,
            no_polisi: stepData.no_polisi,
            jumlah_tandan: Number(stepData.jumlah_tandan),
            berat_timbangan: parseFloat(stepData.berat_timbangan),
            tarra: parseFloat(stepData.tarra),
            t_potongan_persen: parseFloat(stepData.t_potongan_persen),
            t_potongan_kg: parseFloat(stepData.t_potongan_kg),
            berat_bersih: parseFloat(stepData.berat_bersih),
            harga_per_kilo: parseFloat(stepData.harga_per_kilo),
            total_penjualan: parseFloat(stepData.total_penjualan),
          };

          // Update angkutan data via API
          const response = await updatePenjualanAngkutan(angkutanId, payload);

          if (
            response?.status === 200 ||
            response?.status === 201 ||
            response?.data?.status === 'success'
          ) {
            const updatedData = response?.data?.data;
            toast.success('Data angkutan berhasil diperbarui');
            // Update local state with updated data
            setFormData((prev) => ({
              ...prev,
              angkutan: updatedData || stepData,
            }));
            setPenjualanData((prev) => ({
              ...prev,
              angkutan: updatedData || stepData,
            }));
            setCompletedSteps((prev) => [...prev, 1]);
            setCurrentStep(2);
            setLastStep(Math.max(lastStep, 2));
          } else {
            // Handle error response with proper formatting
            const errorMessage = formatApiErrorMessage(response?.data);
            toast.error(errorMessage || 'Gagal memperbarui data angkutan');
          }
        }
      } else if (currentStep === 2) {
        // Data kelompok tani is already saved via API in DataKelompokTani component
        setFormData((prev) => ({ ...prev, kelompokTani: stepData }));
        setCompletedSteps((prev) => [...prev, 2]);
        setCurrentStep(3);
        setLastStep(3);
      } else if (currentStep === 3) {
        // Get idAngkutan from URL params or search params
        const idAngkutanFromUrl = id || searchParams.get('idAngkutan');

        if (!idAngkutanFromUrl) {
          toast.error('ID angkutan tidak ditemukan');
          return;
        }

        let pabrikIdToUse = null;

        // Check if user selected existing pabrik or created new one
        if (stepData.isCustomPabrik) {
          // User created new pabrik via allowAddOption
          // First, create the new pabrik
          const createPayload = {
            nama: stepData.pabrik_penerima,
            provinsi: Number(stepData.provinsi),
            kabupaten: Number(stepData.kabupaten),
            kecamatan: Number(stepData.kecamatan),
            alamat: stepData.alamat,
          };

          const createResponse = await createPenjualanPabrik(createPayload);

          if (
            createResponse?.status === 200 ||
            createResponse?.status === 201 ||
            createResponse?.data?.status === 'success'
          ) {
            const createdPabrikData =
              createResponse?.data?.data || createResponse?.data;
            pabrikIdToUse = createdPabrikData?.id;

            if (!pabrikIdToUse) {
              toast.error('ID pabrik tidak ditemukan dalam response');
              return;
            }
          } else {
            // Handle error response with proper formatting
            const errorMessage = formatApiErrorMessage(createResponse?.data);
            toast.error(errorMessage || 'Gagal membuat data pabrik');
            return;
          }
        } else {
          // User selected existing pabrik from list
          pabrikIdToUse = stepData.pabrik_id;

          if (!pabrikIdToUse) {
            toast.error('ID pabrik tidak ditemukan');
            return;
          }
        }

        // Update angkutan with pabrik ID
        const updatePayload = {
          pabrik: pabrikIdToUse,
        };

        const updateResponse = await updateAngkutanPabrik(
          idAngkutanFromUrl,
          updatePayload
        );

        if (
          updateResponse?.status === 200 ||
          updateResponse?.status === 201 ||
          updateResponse?.data?.status === 'success'
        ) {
          toast.success('Data pabrik berhasil disimpan');
          setFormData((prev) => ({ ...prev, pabrik: stepData }));
          setCompletedSteps((prev) => [...prev, 3]);
          setCurrentStep(4);
          setLastStep(4);
        } else {
          // Handle error response with proper formatting
          const errorMessage = formatApiErrorMessage(updateResponse?.data);
          toast.error(errorMessage || 'Gagal menyimpan data pabrik');
        }
      } else if (currentStep === 4) {
        // Handle lampiran step submission
        setFormData((prev) => ({ ...prev, lampiran: stepData }));
        toast.success('Data penjualan berhasil disimpan');
        // Redirect to penjualan list after completion
        router.push('/traceability/penjualan');
      }
    } catch (error) {
      console.error('Error in step:', error);
      // Handle error response with proper formatting
      const errorData = error?.response?.data || error?.data;
      const errorMessage = formatApiErrorMessage(errorData);
      toast.error(errorMessage || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to go back to previous step
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DataAngkutan
            angkutanData={formData.angkutan || penjualanData?.angkutan}
            onNext={handleNextStep}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
          />
        );
      case 2:
        return (
          <DataKelompokTani
            kelompokTaniData={
              formData.kelompokTani || penjualanData?.kelompok_tani
            }
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
          />
        );
      case 3:
        return (
          <DataPabrik
            pabrikData={formData.pabrik || penjualanData?.pabrik}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
          />
        );
      case 4:
        return (
          <DataLampiran
            lampiranData={formData.lampiran || penjualanData?.lampiran || []}
            angkutanId={id || penjualanData?.angkutan?.id}
            mode="update"
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-12">
        <div className="text-gray-600">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <BreadcrumbDetail items={crumbs} />

      {/* Stepper Navigation */}
      <div className="flex">
        <Stepper
          steps={steps}
          completedSteps={idPenjualan ? steps.map((_, i) => i + 1) : completedSteps}
          lastStep={idPenjualan ? steps.length : lastStep}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </div>

      <div className="space-y-6 w-full">{renderStepContent()}</div>
    </div>
  );
};

const EditPenjualan = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPenjualanContent />
    </Suspense>
  );
};

export default EditPenjualan;
