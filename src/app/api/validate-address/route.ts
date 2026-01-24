'use server';

import { z } from 'zod';
import { AddressInformation } from '@/types/domain';
import { createAddressValidationChain } from '@/services/validators';

const AddressSchema = z.object({
  name: z.string().min(1, "Name is required"), 
  street1: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be exactly 2 characters"),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters"),
  country: z.string().length(2, "Country code must be exactly 2 characters"),
  street2: z.string().optional(),
});

export type ValidationState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function validateAddress(
  prevState: ValidationState,
  formData: FormData
): Promise<ValidationState> {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = AddressSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check input formats.',
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
      message: 'Business validation failed.',
    };
  }
  return {
    success: true,
    message: 'Address valid!',
  };
}