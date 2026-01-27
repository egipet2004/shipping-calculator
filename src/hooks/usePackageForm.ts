import { useState, useCallback, useEffect, useRef } from 'react';
import { RateRequest } from '@/types/domain';
import { createAddressValidationChain, createPackageValidationChain } from '@/services/validators';
import { ValidationResult, ValidationError } from '@/services/validators/validation-chain';
import { saveFormState, loadFormState, clearFormState } from '@/lib/form-storage';
import { InsuranceValidator } from '@/services/validators/validation-chain';


const initialFormState: RateRequest = {
  origin: { name: '', street1: '', city: '', state: '', postalCode: '', country: 'US', street2: '', phone: '' },
  destination: { name: '', street1: '', city: '', state: '', postalCode: '', country: 'US', street2: '', phone: '' },
  package: {
    id: typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36),
    type: 'box',
    dimensions: { length: 0, width: 0, height: 0, unit: 'in' },
    weight: { value: 0, unit: 'lbs' },
    declaredValue: 0
  },
  options: {
    speed: 'standard',
    signatureRequired: false,
    insurance: false,
    fragileHandling: false,
    saturdayDelivery: false,
    insuredValue: 0
  },
  carriers: []
};

export const usePackageForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RateRequest>(initialFormState);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSessionAvailable, setIsSessionAvailable] = useState(false);
  const [restoredData, setRestoredData] = useState<RateRequest | null>(null);
  
  const isInitialized = useRef(false);
  useEffect(() => {
    const saved = loadFormState();
    if (saved) {
      setRestoredData(saved);
      setIsSessionAvailable(true);
    }
    isInitialized.current = true;
  }, []);

  useEffect(() => {
    if (!isInitialized.current || isSessionAvailable) return;

    const timer = setTimeout(() => {
      saveFormState(formData);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [formData, isSessionAvailable]);

  useEffect(() => {
    if (errors.length > 0) {
      const firstErrorElement = document.querySelector('[aria-invalid="true"]') as HTMLElement;
      if (firstErrorElement) {
        firstErrorElement.focus();
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [errors, currentStep]);

  const restoreSession = () => {
    if (restoredData) {
      setFormData(restoredData);
    }
    setIsSessionAvailable(false);
    setRestoredData(null);
  };

  const discardSession = () => {
    clearFormState();
    setIsSessionAvailable(false);
    setRestoredData(null);
  };

  const updateSection = useCallback(<K extends keyof RateRequest>(
    section: K,
    value: RateRequest[K]
  ) => {
    setFormData(prev => ({ ...prev, [section]: value }));
    setErrors([]); 
  }, []);

  const nextStep = () => {
    let result: ValidationResult = { isValid: true, errors: [] };

    if (currentStep === 1) {
      result = createPackageValidationChain().validate(formData.package);
    } 
    else if (currentStep === 2) {
      const originRes = createAddressValidationChain().validate(formData.origin);
      const originErrors = originRes.errors.map(err => ({ ...err, name: `origin.${err.name}` }));

      const destRes = createAddressValidationChain().validate(formData.destination);
      const destErrors = destRes.errors.map(err => ({ ...err, name: `destination.${err.name}` }));

      const allErrors = [...originErrors, ...destErrors];
      result = { isValid: allErrors.length === 0, errors: allErrors };
    }
    else if(currentStep === 3)
      result = new InsuranceValidator().validate(formData.options);
    
    if (result.isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setErrors([]);
      return true;
    } else {
      setErrors(result.errors);
      return false;
    }
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors([]);
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) setCurrentStep(step);
  };

  const reset = () => {
    setFormData(initialFormState);
    setCurrentStep(1);
    setErrors([]);
    clearFormState();
  };

  const submitForm = async (_formData?: FormData) => {
    console.log("Submitting final form data...", formData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    clearFormState(); 
  };

  return {
    currentStep,
    formData,
    errors,
    updateSection,
    nextStep,
    previousStep,
    goToStep,
    reset,
    submitForm,
    getFieldError: (fieldName: string) => errors.find(e => e.name === fieldName)?.message,
    isSessionAvailable,
    restoreSession,
    discardSession
  };
};
