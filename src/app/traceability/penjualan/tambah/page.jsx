'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import Stepper from '@/components/molecules/Stepper';
import Button from '@/components/atoms/Button';
import DataAngkutan from '@/components/organisms/PenjualanForm/DataAngkutan';
import DataKelompokTani from '@/components/organisms/PenjualanForm/DataKelompokTani';
import DataPabrik from '@/components/organisms/PenjualanForm/DataPabrik';
import { getDetailPenjualan } from '@/services/penjualan';

const TambahPenjualanContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idPenjualan = searchParams.get('idPenjualan');

  const crumbs = [
    { label: 'PENJUALAN', href: '/traceability/penjualan' },
    { label: 'TAMBAH PENJUALAN' },
  ];

  // Stepper configuration
  const steps = [
    { title: 'Angkutan', key: 'angkutan' },
    { title: 'Kelompok Tani', key: 'kelompok_tani' },
    { title: 'Pabrik', key: 'pabrik' },
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
  });

  // Fetch penjualan data and determine step when idPenjualan exists
  useEffect(() => {
    const fetchPenjualanData = async () => {
      if (idPenjualan) {
        setIsLoading(true);
        try {
          const response = await getDetailPenjualan(idPenjualan);
          if (response?.status === 200) {
            const data = response?.data?.data;
            setPenjualanData(data);

            // Determine current step based on existing data
            if (data?.pabrik) {
              setCurrentStep(3);
              setLastStep(3);
              setCompletedSteps([1, 2, 3]);
              setFormData({
                angkutan: data?.angkutan || null,
                kelompokTani: data?.kelompok_tani || null,
                pabrik: data?.pabrik || null,
              });
            } else if (data?.kelompok_tani) {
              setCurrentStep(3);
              setLastStep(3);
              setCompletedSteps([1, 2]);
              setFormData({
                angkutan: data?.angkutan || null,
                kelompokTani: data?.kelompok_tani || null,
                pabrik: null,
              });
            } else if (data?.angkutan) {
              setCurrentStep(2);
              setLastStep(3);
              setCompletedSteps([1]);
              setFormData({
                angkutan: data?.angkutan || null,
                kelompokTani: null,
                pabrik: null,
              });
            }
          }
        } catch (error) {
          console.error('Error fetching penjualan data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // New penjualan - start at step 1
        setCurrentStep(1);
        setLastStep(1);
        setCompletedSteps([]);
      }
    };

    fetchPenjualanData();
  }, [idPenjualan]);

  // Function to handle step click
  const handleStepClick = (stepNumber) => {
    if (stepNumber <= lastStep) {
      setCurrentStep(stepNumber);
    }
  };

  // Function to proceed to next step
  const handleNextStep = async (stepData) => {
    setIsSubmitting(true);

    try {
      // Store form data for current step
      if (currentStep === 1) {
        setFormData((prev) => ({ ...prev, angkutan: stepData }));
        // TODO: Save angkutan data to API
        // For now, just proceed to next step
        setCompletedSteps((prev) => [...prev, 1]);
        setCurrentStep(2);
        setLastStep(2);
      } else if (currentStep === 2) {
        setFormData((prev) => ({ ...prev, kelompokTani: stepData }));
        // TODO: Save kelompok tani data to API
        setCompletedSteps((prev) => [...prev, 2]);
        setCurrentStep(3);
        setLastStep(3);
      } else if (currentStep === 3) {
        setFormData((prev) => ({ ...prev, pabrik: stepData }));
        // TODO: Save pabrik data and finalize penjualan
        setCompletedSteps((prev) => [...prev, 3]);
        // Redirect to penjualan list after completion
        router.push('/traceability/penjualan');
        return;
      }
    } catch (error) {
      console.error('Error in step:', error);
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
          completedSteps={completedSteps}
          lastStep={lastStep}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </div>

      <div className="space-y-6 w-full">{renderStepContent()}</div>
    </div>
  );
};

const TambahPenjualan = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TambahPenjualanContent />
    </Suspense>
  );
};

export default TambahPenjualan;
