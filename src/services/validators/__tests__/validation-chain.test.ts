import { describe, it, expect } from 'vitest';
import { 
  RequiredFieldsValidator, 
  PostalCodeFormatValidator, 
  StateCodeValidator, 
  DimensionsValidator, 
  WeightValidator 
} from '../validation-chain';
import { AddressInformation, Package } from '@/types/domain';




// Вспомогательные данные для тестов
const validAddress: AddressInformation = {
  name: 'John Doe',
  street1: '123 Main St',
  city: 'New York',
  state: 'NY',
  postalCode: '10001',
  country: 'US',
  phone: '1234567890'
};

const validPackage: Package = {
  id: '1',
  type: 'box',
  dimensions: { length: 10, width: 10, height: 10, unit: 'in' },
  weight: { value: 10, unit: 'lbs' },
  declaredValue: 0
};

describe('Validation Chain Unit Tests', () => {

  // 1. Тест обязательных полей
  describe('RequiredFieldsValidator', () => {
    it('should pass with all required fields', () => {
      const validator = new RequiredFieldsValidator();
      const result = validator.validate(validAddress);
      expect(result.isValid).toBe(true);
    });

    it('should fail if city is missing', () => {
      const validator = new RequiredFieldsValidator();
      const invalidAddress = { ...validAddress, city: '' };
      const result = validator.validate(invalidAddress);
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0].name).toBe('city');
    });

    it('should fail if multiple fields are missing', () => {
      const validator = new RequiredFieldsValidator();
      const invalidAddress = { ...validAddress, street1: '', postalCode: '' };
      const result = validator.validate(invalidAddress);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  // 2. Тест формата ZIP кода
  describe('PostalCodeFormatValidator', () => {
    it('should pass valid US zip', () => {
      const validator = new PostalCodeFormatValidator();
      expect(validator.validate({ ...validAddress, postalCode: '12345' }).isValid).toBe(true);
      expect(validator.validate({ ...validAddress, postalCode: '12345-6789' }).isValid).toBe(true);
    });

    it('should fail invalid US zip', () => {
      const validator = new PostalCodeFormatValidator();
      const result = validator.validate({ ...validAddress, postalCode: 'ABCDE' });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe('Invalid ZIP');
    });

    it('should skip validation for non-US countries', () => {
      const validator = new PostalCodeFormatValidator();
      // UK postcode logic is not implemented yet, so it should pass or be ignored
      const result = validator.validate({ ...validAddress, country: 'UK', postalCode: 'SW1A 1AA' });
      expect(result.isValid).toBe(true);
    });
  });

  // 3. Тест штата
  describe('StateCodeValidator', () => {
    it('should pass valid 2-letter state', () => {
      const validator = new StateCodeValidator();
      expect(validator.validate({ ...validAddress, state: 'CA' }).isValid).toBe(true);
    });

    it('should fail full state name', () => {
      const validator = new StateCodeValidator();
      const result = validator.validate({ ...validAddress, state: 'California' });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].name).toBe('state');
    });
  });

  // 4. Тест размеров посылки
  describe('DimensionsValidator', () => {
    it('should pass valid dimensions', () => {
      const validator = new DimensionsValidator();
      expect(validator.validate(validPackage).isValid).toBe(true);
    });

    it('should fail zero or negative dimensions', () => {
      const validator = new DimensionsValidator();
      const invalidPkg = { 
        ...validPackage, 
        dimensions: { ...validPackage.dimensions, length: 0 } 
      };
      const result = validator.validate(invalidPkg);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe('INVALID_DIMENSIONS');
    });

    it('should fail if package exceeds 165 inches (Length + Girth)', () => {
      const validator = new DimensionsValidator();
      // Length 100 + 2*(30+30) = 220 inches (> 165)
      const hugePkg = { 
        ...validPackage, 
        dimensions: { length: 100, width: 30, height: 30, unit: 'in' as const } 
      };
      const result = validator.validate(hugePkg);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe('SIZE_LIMIT_EXCEEDED');
    });
  });

  // 5. Тест веса
  describe('WeightValidator', () => {
    it('should pass valid weight', () => {
      const validator = new WeightValidator();
      expect(validator.validate(validPackage).isValid).toBe(true);
    });

    it('should fail zero weight', () => {
      const validator = new WeightValidator();
      const invalidPkg = { ...validPackage, weight: { value: 0, unit: 'lbs' as const } };
      expect(validator.validate(invalidPkg).isValid).toBe(false);
    });

    it('should fail if weight exceeds 150 lbs', () => {
      const validator = new WeightValidator();
      const heavyPkg = { ...validPackage, weight: { value: 151, unit: 'lbs' as const } };
      const result = validator.validate(heavyPkg);
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe('WEIGHT_LIMIT_EXCEEDED');
    });

    it('should correctly convert KG to LBS for validation', () => {
      const validator = new WeightValidator();
      // 70 kg ~= 154 lbs (Fail)
      const heavyKgPkg = { ...validPackage, weight: { value: 70, unit: 'kg' as const } };
      const result = validator.validate(heavyKgPkg);
      expect(result.isValid).toBe(false);

      // 60 kg ~= 132 lbs (Pass)
      const validKgPkg = { ...validPackage, weight: { value: 60, unit: 'kg' as const } };
      expect(validator.validate(validKgPkg).isValid).toBe(true);
    });
  });

  // 6. Тест цепочки (Chain of Responsibility)
  describe('Chain Execution', () => {
    it('should stop at first failure', () => {
      const val1 = new RequiredFieldsValidator();
      const val2 = new PostalCodeFormatValidator();
      
      // Строим цепочку: val1 -> val2
      val1.setNext(val2);

      // Создаем адрес без города (ошибка val1) и с плохим ZIP (ошибка val2)
      const badAddress = { ...validAddress, city: '', postalCode: 'BADZIP' };

      const result = val1.validate(badAddress);

      // Должны получить только ошибку первого валидатора
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0].name).toBe('city');
    });

    it('should execute next validator if first passes', () => {
      const val1 = new RequiredFieldsValidator();
      const val2 = new PostalCodeFormatValidator();
      val1.setNext(val2);

      // Адрес с городом (ок), но плохим ZIP (ошибка)
      const badZipAddress = { ...validAddress, postalCode: 'BADZIP' };

      const result = val1.validate(badZipAddress);

      expect(result.isValid).toBe(false);
      expect(result.errors[0].name).toBe('postalCode');
    });
  });
});