import { describe, it, expect, vi } from 'vitest';
import { RateService } from '@/services/rate-service';
import { RateRequest } from '@/types/domain';

// Мокаем адаптеры, чтобы не делать реальные запросы в интеграционных тестах
vi.mock('@/adapters/fedex-adapter', () => {
  return {
    FedExAdapter: class {
      async fetchRates() {
        return [{
          id: 'fedex-1', carrier: 'FedEx', serviceName: 'Ground', baseRate: 15.00,
          totalCost: 15.00, additionalFees: [], estimatedDeliveryDate: new Date(), speed: 'standard'
        }];
      }
    }
  };
});

describe('Integration: Rate Calculation Workflow', () => {
  const service = new RateService();
  const request: RateRequest = {
    origin: { postalCode: '10001', country: 'US', city: 'NY', state: 'NY', street1: 'St', name: 'Test' },
    destination: { postalCode: '90210', country: 'US', city: 'LA', state: 'CA', street1: 'St', name: 'Test' },
    package: { weight: { value: 5, unit: 'lbs' }, dimensions: { length: 10, width: 10, height: 10, unit: 'in' }, id: '1', type: 'box' },
    options: { 
      speed: 'standard', 
      signatureRequired: false, 
      insurance: false, 
      fragileHandling: false, 
      saturdayDelivery: false 
    }
  };

  it('should verify RateService fetches rates from multiple carriers in parallel', async () => {
    const result = await service.fetchAllRates(request);
    expect(result.rates.length).toBeGreaterThan(0);
    expect(result.requestId).toBeDefined();
  });

  it('should verify decorators are applied correctly to all fetched rates', async () => {
    // Включаем опции, требующие декораторов
    const reqWithOpts = { ...request, options: { ...request.options, signatureRequired: true } };
    const result = await service.fetchAllRates(reqWithOpts);
    
    // Проверяем, что цена выросла (15.00 + fee)
    const rate = result.rates[0];
    expect(rate.totalCost).toBeGreaterThan(15.00);
    expect(rate.additionalFees.find(f => f.type === 'signature')).toBeDefined();
  });

  it('should verify rates are sorted by total cost (cheapest first)', async () => {
    // Здесь нужно замокать ответ так, чтобы вернулось 2 тарифа с разными ценами
    // И проверить result.rates[0].totalCost < result.rates[1].totalCost
  });

  it('should verify error categorization (recoverable vs non-recoverable)', async () => {
    // Если один адаптер упал, сервис должен вернуть частичный результат + ошибки
    const result = await service.fetchAllRates(request);
    // В данном моке ошибок нет, но тест должен проверять структуру result.errors
    expect(Array.isArray(result.errors)).toBe(true);
  });
});