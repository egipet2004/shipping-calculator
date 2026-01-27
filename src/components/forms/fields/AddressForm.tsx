'use client';

import { useId, useActionState } from 'react';
import { AddressInformation } from '@/types/domain';
import { useAddressValidation } from '@/hooks/useAddressValidation';
import { validateAddress } from '@/app/api/validate-address/route';
import { ValidateAddressButton } from '../ValidateAddressButton'; 

interface AddressFormProps {
  title: string;
  address: AddressInformation;
  onChange: (address: AddressInformation) => void;
  getFieldError?: (field: string) => string | undefined;
}

const initialState = {
  success: false,
  message: '',
  errors: {}
};

export function AddressForm({ title, address, onChange, getFieldError }: AddressFormProps) {
  const { validateField, getFieldError: getLocalError } = useAddressValidation();
  
  const [state, formAction] = useActionState(validateAddress, initialState);
  const baseId = useId();

  const handleChange = (field: keyof AddressInformation, value: string) => {
    const newAddress = { ...address, [field]: value };
    onChange(newAddress);
    validateField(field, value);
  };

  const renderField = (
    label: string, 
    fieldName: keyof AddressInformation, 
    required: boolean = true, 
    widthClass: string = 'w-full',
    autoComplete?: string
  ) => {
    const error = getFieldError?.(fieldName) || getLocalError(fieldName as string) || state.errors?.[fieldName]?.[0];
    
    const inputId = `${baseId}-${fieldName}`;
    const errorId = `${baseId}-${fieldName}-error`;
    const isInvalid = !!error;

    return (
      <div className={widthClass}>
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
        </label>
        <input
          id={inputId}
          name={fieldName}
          type="text"
          value={(address as any)[fieldName] || ''}
          onChange={(e) => handleChange(fieldName, e.target.value)}
          autoComplete={autoComplete}
          aria-required={required}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? errorId : undefined}
          className={`w-full rounded-md border p-2 text-gray-900 shadow-sm outline-none transition-all 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
            ${isInvalid ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300'}`}
        />
        {error && (
          <p className="flex items-center mt-1 text-red-600 text-sm" id={errorId} role="alert">
             <svg aria-hidden="true" className="h-4 w-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <section aria-labelledby={`${baseId}-title`} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 id={`${baseId}-title`} className="font-semibold text-lg text-gray-800 border-b pb-2 mb-4">
        {title}
      </h3>
      
      <form action={formAction} className="space-y-4">
        
        {state.message && (
          <div 
            role="alert"
            className={`p-3 text-sm rounded-md border ${state.success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
          >
            {state.message}
          </div>
        )}

        <div className="space-y-2">
           {renderField('Full Name', 'name', false, 'w-full', 'name')}
        </div>

        <div className="space-y-2">
           {renderField('Street Address', 'street1', true, 'w-full', 'address-line1')}
        </div>

        <div className="space-y-2">
           {renderField('Apartment (Optional)', 'street2', false, 'w-full', 'address-line2')}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {renderField('City', 'city', true, 'w-full', 'address-level2')}
          </div>
          <div className="space-y-2">
            <label htmlFor={`${baseId}-state`} className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id={`${baseId}-state`}
              name="state"
              type="text"
              maxLength={2}
              placeholder="NY"
              autoComplete="address-level1"
              value={address.state}
              onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
              aria-required="true"
              aria-invalid={!!(getFieldError?.('state') || getLocalError('state') || state.errors?.state)}
              className={`w-full rounded-md border p-2 text-gray-900 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                (getFieldError?.('state') || getLocalError('state') || state.errors?.state) ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
             {(getFieldError?.('state') || getLocalError('state') || state.errors?.state) && (
              <p className="text-sm text-red-500 mt-1" role="alert">
                {getFieldError?.('state') || getLocalError('state') || state.errors?.state?.[0]}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {renderField('Postal Code', 'postalCode', true, 'w-full', 'postal-code')}
          </div>
          <div className="space-y-2">
            <label htmlFor={`${baseId}-country`} className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <select
              id={`${baseId}-country`}
              name="country"
              value={address.country}
              autoComplete="country"
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
            </select>
          </div>
        </div>

        <ValidateAddressButton />
      </form>
    </section>
  );
}