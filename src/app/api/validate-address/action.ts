'use server';

import { z } from 'zod';
import { AddressInformation } from '@/types/domain';
import { createAddressValidationChain } from '@/services/validators';

const AddressSchema = z.object({
  name: z.string().optional(),
  street1: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  
  state: z.string().optional(), 
  
  postalCode: z.string().min(3, "Postal code too short"),
  country: z.string().length(2, "Country code must be 2 chars"),
  street2: z.string().optional(),
});

export type ValidationState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  normalizedAddress?: AddressInformation;
};

export async function validateAddress(
  _prevState: ValidationState,
  formData: FormData
): Promise<ValidationState> {
  const rawData = Object.fromEntries(formData.entries());
  
  const country = formData.get('country')?.toString();
  if (country) {
      rawData.country = country;
  }

  const validatedFields = AddressSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Format error.',
    };
  }
  
  const addressData = rawData as unknown as AddressInformation;
  const businessValidation = createAddressValidationChain().validate(addressData);

  if (!businessValidation.isValid) {
    const businessErrors: Record<string, string[]> = {};
    businessValidation.errors.forEach((err) => {
      businessErrors[err.name] = [err.message];
    });

    return {
      success: false,
      errors: businessErrors,
      message: 'Validation failed.',
    };
  }

  return {
    success: true,
    message: 'Address valid!',
    normalizedAddress: {
      ...addressData,
      state: addressData.state ? addressData.state.toUpperCase() : '',
      country: addressData.country 
    }
  };
}