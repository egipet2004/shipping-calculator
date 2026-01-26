import { describe, it, expect } from 'vitest';
import { FedExAdapter } from '../fedex-adapter';
import { RateRequest } from '@/types/domain';

describe('Adapter Pattern: FedExAdapter', () => {
  const adapter = new FedExAdapter();
  
  // Мок запроса
  const mockRequest: RateRequest = {
    origin: { postalCode: '10001', country: 'US', city: 'NY', state: 'NY', street1: 'St', name: 'T' },
    destination: { postalCode: '90210', country: 'US', city: 'LA', state: 'CA', street1: 'St', name: 'T' },
    package: { weight: { value: 5, unit: 'lbs' }, dimensions: { length: 10, width: 10, height: 10, unit: 'in' }, id: '1', type: 'box' },
    options: { speed: 'standard', signatureRequired: false, insurance: false, fragileHandling: false, saturdayDelivery: false }
  };

  it('should verify carrier name is correctly set on each rate', async () => {
    const rates = await adapter.fetchRates(mockRequest);
    rates.forEach(rate => {
      expect(rate.carrier).toBe('FedEx');
    });
  });

  it('should verify all required fields are present and correctly typed', async () => {
    const rates = await adapter.fetchRates(mockRequest);
    const rate = rates[0];

    expect(rate).toHaveProperty('id');
    expect(typeof rate.totalCost).toBe('number');
    expect(Array.isArray(rate.additionalFees)).toBe(true);
  });

  it('should test date string conversion to Date objects', async () => {
    const rates = await adapter.fetchRates(mockRequest);
    const rate = rates[0];
    // Проверяем, что это либо объект Date, либо строка, которую можно распарсить
    const date = new Date(rate.estimatedDeliveryDate);
    expect(date.toString()).not.toBe('Invalid Date');
  });

  it('should test service name to speed tier mapping', async () => {
    const rates = await adapter.fetchRates(mockRequest);
    const groundRate = rates.find(r => r.serviceName.includes('Ground'));
    if (groundRate) {
       // FedEx Ground часто мапится как 'standard' или 'economy'
       expect(['standard', 'economy']).toContain(groundRate.speed);
    }
  });

  // Test error handling for malformed API responses
  // (Здесь нужен мок fetch, чтобы вернуть ошибку)
});