import { useState, useCallback, useRef, useEffect } from 'react';
import { AddressInformation} from '@/types/domain';
import { createAddressValidationChain } from '@/services/validators';
import { ValidationError } from '@/services/validators/validation-chain';


export const useAddressValidation = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const validateField = useCallback((name: keyof AddressInformation, value: string) => {
    const partialAddress = { [name]: value } as unknown as AddressInformation;

    const result = createAddressValidationChain().validate(partialAddress);

    const fieldError = result.errors.find(e => e.name === name);

    setErrors(prevErrors => {
      const otherErrors = prevErrors.filter(e => e.name !== name);
      return fieldError ? [...otherErrors, fieldError] : otherErrors;
    });
  }, []);

  
  const validate = useCallback((address: AddressInformation): Promise<boolean> => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setIsValidating(true);

    return new Promise((resolve) => {
      debounceTimer.current = setTimeout(() => {
        const result = createAddressValidationChain().validate(address);
        setErrors(result.errors);
        setIsValidating(false);
        
        resolve(result.isValid);
      }, 500);
    });
  }, []);
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const getFieldError = (fieldName: string) => {
    return errors.find(e => e.name === fieldName)?.message;
  };

  return {
    errors,
    isValidating,
    validate,
    validateField,
    getFieldError
  };
};