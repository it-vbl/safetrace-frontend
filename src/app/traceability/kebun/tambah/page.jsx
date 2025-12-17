'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import Stepper from '@/components/molecules/Stepper';
import DetailKebun from '@/components/organisms/KebunForm/DetailKebun';
import Lampiran from '@/components/organisms/KebunForm/Lampiran';
import Pemetaan from '@/components/organisms/KebunForm/Pemetaan';
import { getKebunDetail } from '@/services/kebun';
import {
  handleStep1,
  handleStep2,
  handleStep3,
} from '@/utils/kebunStepHandler';

const CreateKebunTraceabilityContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idKebun = searchParams.get('idKebun');

  const crumbs = [
    { label: 'KEBUN', href: '/traceability/kebun' },
    { label: 'TAMBAH KEBUN' },
  ];

  // Stepper configuration - show all steps if idKebun exists, otherwise just step 1
  const steps = [
    { title: 'Kebun', key: 'kebun' },
    { title: 'Pemetaan', key: 'pemetaan' },
    { title: 'Lampiran', key: 'lampiran' },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [lastStep, setLastStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kebunData, setKebunData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch kebun data and determine step when idKebun exists
  useEffect(() => {
    const fetchKebunData = async () => {
      if (idKebun) {
        setIsLoading(true);
        try {
          const response = await getKebunDetail(idKebun);
          if (response && response.data) {
            const data = response.data.data;
            setKebunData(data);

            // Determine current step based on data
            if (data.geom || data.titik_koordinat) {
              // Has mapping data, go to step 3 (Lampiran)
              setCurrentStep(3);
              setLastStep(3);
              setCompletedSteps([1, 2]);
            } else {
              // No mapping data, go to step 2 (Pemetaan)
              setCurrentStep(2);
              setLastStep(2);
              setCompletedSteps([1]);
            }
          }
        } catch (error) {
          console.error('Error fetching kebun data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchKebunData();
  }, [idKebun]);

  // Function to handle step navigation
  const handleStepClick = (stepNumber) => {
    if (stepNumber <= currentStep || completedSteps.includes(stepNumber - 1)) {
      setCurrentStep(stepNumber);
    }
  };

  // Function to proceed to next step
  const handleNextStep = async (stepData) => {
    setIsSubmitting(true);

    try {
      let result;

      switch (currentStep) {
        case 1:
          result = await handleStep1(stepData, idKebun);
          if (result.redirect) {
            router.push(`/traceability/kebun/tambah?idKebun=${result.idKebun}`);
            return;
          }
          break;
        case 2:
          result = await handleStep2();
          // After successful pemetaan submission, update kebunData with the submitted geom data
          if (result.success && stepData?.peta) {
            // Convert coordinates to GeoJSON format
            const polygonCoords = stepData.peta.map((coord) => [
              coord.lng,
              coord.lat,
            ]);
            if (polygonCoords.length > 0) {
              polygonCoords.push(polygonCoords[0]); // Close the polygon
            }

            const updatedKebunData = {
              ...kebunData,
              geom: {
                type: 'Polygon',
                coordinates: [polygonCoords],
              },
            };
            setKebunData(updatedKebunData);
          }
          break;
        case 3:
          result = await handleStep3(stepData, idKebun);
          if (result.redirect) {
            router.push('/traceability/kebun');
            return;
          }
          break;
      }

      if (result.success) {
        setCompletedSteps((prev) => [...prev, currentStep]);
        if (currentStep < steps.length) {
          setCurrentStep(currentStep + 1);
        }
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
          <DetailKebun
            idKebun={idKebun}
            kebunData={kebunData}
            onNext={handleNextStep}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
          />
        );
      case 2:
        return (
          <Pemetaan
            idKebun={idKebun}
            kebunData={kebunData}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
          />
        );
      case 3:
        return (
          <Lampiran
            idKebun={idKebun}
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

  return (
    <div className="flex w-full flex-col gap-4">
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

      <div className="space-y-6">{renderStepContent()}</div>
    </div>
  );
};

const CreateKebunTraceability = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateKebunTraceabilityContent />
    </Suspense>
  );
};

export default CreateKebunTraceability;
