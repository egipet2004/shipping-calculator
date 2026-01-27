import { AddressInformation, Package, ShippingOptions} from "@/types/domain";

export interface ValidationResult{
    isValid: boolean;
    errors: ValidationError[];
}

export interface ValidationError{
    name: string;
    message: string;
    code: string;
}

interface Validator<T>{
    setNext(validator: Validator<T>): Validator<T>;
    validate(data: T): ValidationResult;
}

abstract class BaseValidator<T> implements Validator<T>{
    private nextValidator: Validator<T> | null = null;
    protected abstract doValidation(data: T): ValidationResult;

    setNext(validator: Validator<T>): Validator<T> {
        this.nextValidator = validator;
        return validator;
    }

    validate(data: T): ValidationResult {
        const result = this.doValidation(data);
        if(!result.isValid)
            return result;
        if(this.nextValidator)
            return this.nextValidator.validate(data);
        return {
            isValid: true,
            errors:[]
        };
    }
}

export class RequiredFieldsValidator extends BaseValidator<AddressInformation> {
    private requiredFields: Array<keyof AddressInformation> = ['street1', 'city', 'state', 'postalCode', 'country'];
    protected doValidation(data: AddressInformation): ValidationResult {
        const errors: ValidationError[] = [];
        for (const field of this.requiredFields) {
            if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
                errors.push({
                    name: field,
                    message: `${field} is required`,
                    code: 'REQUIRED_FIELD_MISSING',
                });
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

export class PostalCodeFormatValidator extends BaseValidator<AddressInformation> {
    protected doValidation(data: AddressInformation): ValidationResult {
        const { country, postalCode } = data;
        
        const patterns: Record<string, { regex: RegExp, msg: string }> = {
            'US': { 
                regex: /^\d{5}(-\d{4})?$/, 
                msg: 'US zip must be 12345 or 12345-6789' 
            },
            'CA': { 
                regex: /^[A-Z]\d[A-Z][ ]?\d[A-Z]\d$/i, 
                msg: 'Canadian postal code must be A1B 2C3' 
            },
            'UK': { 
                regex: /^[A-Z]{1,2}\d[A-Z\d]? [0-9][A-Z]{2}$/i, 
                msg: 'UK postcode must be like SW1W 0NY' 
            }
        };

        const pattern = patterns[country];
        if (pattern && !pattern.regex.test(postalCode)) {
            return {
                isValid: false,
                errors: [{
                    name: 'postalCode',
                    message: pattern.msg,
                    code: 'INVALID_POSTAL_CODE'
                }]
            };
        }

        return { isValid: true, errors: [] };
    }
}


export class StateCodeValidator extends BaseValidator<AddressInformation> {
    protected doValidation(data: AddressInformation): ValidationResult {
        const { country, state } = data;
        if (country === 'US') {
            if (!state) return { isValid: true, errors: [] };
            const usStateRegex = /^[A-Z]{2}$/i;
            if (!usStateRegex.test(state)) {
                return {
                    isValid: false,
                    errors: [{
                        name: 'state',
                        message: 'US state must be a 2-letter (NY, CA)',
                        code: 'INVALID_STATE_CODE'
                    }]
                };
            }
        }
        if (country === 'CA') {
            if (!state) return { isValid: true, errors: [] };
            const caStateRegex = /^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/i;
            if (!caStateRegex.test(state)) {
                return {
                    isValid: false,
                    errors: [{
                        name: 'state',
                        message: 'Canadian state must be a 2-letter (NY, CA)',
                        code: 'INVALID_STATE_CODE'
                    }]
                };
            }
        }
        return {
            isValid: true,
            errors: []
        };
    }
}


export class DimensionsValidator extends BaseValidator<Package> {
    protected doValidation(data: Package): ValidationResult {
        const { length, width, height, unit } = data.dimensions;
        if (length <= 0 || width <= 0 || height <= 0) {
            return {
                isValid: false,
                errors: [{
                    name: 'dimensions',
                    message: 'All dimensions must be positive numbers',
                    code: 'INVALID_DIMENSIONS'
                }]
            };
        }
        const multiplier = unit === 'cm' ? 1 / 2.54 : 1;
        const lInches = length * multiplier;
        const wInches = width * multiplier;
        const hInches = height * multiplier;
        const totalSize = lInches + 2 * (wInches + hInches);
        if (totalSize >= 165) {
            return {
                isValid: false,
                errors: [{
                    name: 'dimensions',
                    message: `Package size (${totalSize.toFixed(2)} in) exceeds maximum limit of 165 inches.`,
                    code: 'SIZE_LIMIT_EXCEEDED'
                }]
            };
        }
        return { isValid: true, errors: [] };
    }
}


export class WeightValidator extends BaseValidator<Package> {
    protected doValidation(data: Package): ValidationResult {
        const { value, unit } = data.weight;
        if (value <= 0) {
            return {
                isValid: false,
                errors: [{ name: 'weight', message: 'Weight must be positive', code: 'INVALID_WEIGHT' }]
            };
        }
        const weightInLbs = unit === 'kg' ? value * 2.20462 : value;
        if (weightInLbs > 150) {
            return {
                isValid: false,
                errors: [{
                    name: 'weight',
                    message: `Weight (${weightInLbs.toFixed(2)} lbs) exceeds limit of 150 lbs`,
                    code: 'WEIGHT_LIMIT_EXCEEDED'
                }]
            };
        }
        return { isValid: true, errors: [] };
    }
}

export class InsuranceValidator extends BaseValidator<ShippingOptions> {
    protected doValidation(data: ShippingOptions): ValidationResult {
        if (data.insurance && (!data.insuredValue || data.insuredValue <= 0)) {
            return {
                isValid: false,
                errors: [{
                    name: 'insuredValue',
                    message: 'Please enter a valid insured value',
                    code: 'INSURANCE_VALUE_MISSING'
                }]
            };
        }
        return {
            isValid: true,
            errors: []
        };
    }
}
