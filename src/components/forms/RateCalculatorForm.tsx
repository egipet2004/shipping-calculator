'use client';

import { useRouter } from 'next/navigation'; 
import { usePackageForm } from '@/hooks/usePackageForm';
import { PackageDetailsStep } from './steps/PackageDetailStep'; 
import { AddressStep } from './steps/AddressStep'; 
import { ShippingOptionsStep } from './steps/ShippingOptionsStep'; 
import { ReviewStep } from './steps/ReviewStep';
import { FormNavigation } from './controls/FormNavigation'; 
import { SessionRestoreAlert } from '../ui/SessionRestoreAlert'; 

export function RateCalculatorForm() {
  const router = useRouter(); 

  const {
    currentStep,
    formData,
    updateSection,
    nextStep,
    previousStep,
    goToStep,
    getFieldError,
    isSessionAvailable,
    restoreSession,
    discardSession
  } = usePackageForm();

  const handleCalculate = () => {
    console.log("Form Submitted:", formData);

    const params = new URLSearchParams();

    params.set('weight', formData.package.weight.value.toString());
    params.set('weightUnit', formData.package.weight.unit);
    params.set('length', formData.package.dimensions.length.toString());
    params.set('width', formData.package.dimensions.width.toString());
    params.set('height', formData.package.dimensions.height.toString());
    params.set('dimUnit', formData.package.dimensions.unit);

    params.set('fromZip', formData.origin.postalCode);
    params.set('fromCity', formData.origin.city);
    params.set('fromState', formData.origin.state);
    params.set('fromCountry', formData.origin.country || 'US');

    params.set('toZip', formData.destination.postalCode);
    params.set('toCity', formData.destination.city);
    params.set('toState', formData.destination.state);
    params.set('toCountry', formData.destination.country || 'US');

    if (formData.options.signatureRequired) params.set('signature', 'true');
    if (formData.options.insurance) params.set('insurance', 'true');
    if (formData.options.fragileHandling) params.set('fragile', 'true');
    if (formData.options.saturdayDelivery) params.set('saturday', 'true');

    router.push(`/results?${params.toString()}`);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PackageDetailsStep 
            data={formData.package} 
            onChange={(pkg) => updateSection('package', pkg)}
            getFieldError={getFieldError}
          />
        );
      case 2:
        return (
          <AddressStep 
            origin={formData.origin}
            destination={formData.destination}
            onOriginChange={(addr) => updateSection('origin', addr)}
            onDestinationChange={(addr) => updateSection('destination', addr)}
            getFieldError={getFieldError}
          />
        );
      case 3:
        return (
          <ShippingOptionsStep 
            options={formData.options}
            onChange={(opts) => updateSection('options', opts)}
          />
        );
      case 4:
        return (
          <ReviewStep 
            data={formData} 
            onEditStep={goToStep} 
            onCalculate={handleCalculate} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SessionRestoreAlert 
        isOpen={isSessionAvailable}
        onRestore={restoreSession}
        onDiscard={discardSession}
      />

      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-lg border border-gray-100 my-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shipping Rate Calculator</h1>
           
          <div className="mt-4 relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
              <div 
                style={{ width: `${(currentStep / 4) * 100}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500 ease-in-out"
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium px-1">
              <span className={currentStep >= 1 ? 'text-blue-600' : ''}>Package</span>
              <span className={currentStep >= 2 ? 'text-blue-600' : ''}>Route</span>
              <span className={currentStep >= 3 ? 'text-blue-600' : ''}>Options</span>
              <span className={currentStep >= 4 ? 'text-blue-600' : ''}>Review</span>
            </div>
          </div>
        </div>
        <div>
          {renderStep()}
          {currentStep < 4 && (
            <FormNavigation
              currentStep={currentStep}
              totalSteps={4}
              onNext={nextStep}
              onPrevious={previousStep}
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === 4}
            />
          )}
        </div>
      </div>
    </>
  );
}


