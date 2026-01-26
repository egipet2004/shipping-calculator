import { describe, it, expect } from 'vitest';
import { BaseRate, InsuranceDecorator, SignatureDecorator } from '../decorators'; // Путь к вашим декораторам

describe('Decorator Pattern: Fee Logic', () => {
  
  it('should verify decorators do not mutate the wrapped component', () => {
    const base = new BaseRate(100, 'Ground');
    const decorated = new SignatureDecorator(base);
    expect(base.getCost()).toBe(100); // Базовый объект не изменился
    expect(decorated.getCost()).toBeGreaterThan(100);
  });

  it('should sum base rate + all decorator fees (getCost)', () => {
    const base = new BaseRate(50, 'Standard');
    const withSig = new SignatureDecorator(base); // Допустим, +5
    expect(withSig.getCost()).toBe(55.5);
  });

  it('should verify getFees() returns all applied fees in correct order', () => {
    const base = new BaseRate(100, 'Express');
    const withSig = new SignatureDecorator(base);
    const fees = withSig.getFees();
    
    expect(fees).toHaveLength(1);
    expect(fees[0].type).toBe('signature');
  });

  it('should stack insurance and signature decorators correctly', () => {
    const base = new BaseRate(100, 'Test');
    const withSig = new SignatureDecorator(base); // +5
    const withAll = new InsuranceDecorator(withSig, 500); // +5 (1% от 500)
    
    // 100 + 5 + 5 = 110
    expect(withAll.getCost()).toBe(110.5);
    expect(withAll.getFees()).toHaveLength(2);
  });

  // Строго по ТЗ: Test insurance calculation ($1 per $100, min $2.50)
  describe('Insurance Calculation Rules', () => {
    it('should apply minimum fee of $2.50 for low value', () => {
      const base = new BaseRate(100, 'Test');
      const withInsurance = new InsuranceDecorator(base, 100); // 1% = $1, но минимум $2.50
      
      const fees = withInsurance.getFees();
      const insuranceFee = fees.find(f => f.type === 'insurance');
      
      expect(insuranceFee?.amount).toBe(2.50);
      expect(withInsurance.getCost()).toBe(102.50);
    });

    it('should apply $1 per $100 logic for higher value', () => {
      const base = new BaseRate(100, 'Test');
      const withInsurance = new InsuranceDecorator(base, 500); // 1% от 500 = $5.00
      
      const fees = withInsurance.getFees();
      const insuranceFee = fees.find(f => f.type === 'insurance');
      
      expect(insuranceFee?.amount).toBe(5.00);
    });
  });
});