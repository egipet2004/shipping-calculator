import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FedExAdapter } from '../fedex-adapter';

// 1. МОКАЕМ КОНФИГУРАЦИЮ
vi.mock('@/config/carrier-config', () => ({
  carrierConfig: {
    getCarrierCredentials: vi.fn(() => ({
      apiKey: 'test-key',
      apiSecret: 'test-secret',
      accountNumber: '123456789',
      endpoint: 'https://apis-sandbox.fedex.com'
    }))
  }
}));

// 2. МОКАЕМ FETCH
global.fetch = vi.fn();

describe('Adapter Pattern: FedExAdapter', () => {
  let adapter: FedExAdapter;

  beforeEach(() => {
    adapter = new FedExAdapter();
    vi.clearAllMocks();
  });

  // Тест 1: Успешный маппинг
  it('should correctly map FedEx response to ShippingRate', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'fake-token', expires_in: 3600 })
      })
      .mockResolvedValueOnce({
        ok: true,
        // Важно: возвращаем структуру, которую ожидает адаптер
        json: async () => ({
          output: {
            rateReplyDetails: [
              {
                serviceType: 'FEDEX_GROUND',
                serviceName: 'FedEx Ground',
                ratedShipmentDetails: [{
                  rateType: 'ACCOUNT',
                  totalNetCharge: 15.50,
                  totalBaseCharge: 12.00,
                  surCharges: [{ type: 'FUEL', amount: { amount: 3.50 }, description: 'Fuel' }]
                }],
                operationalDetail: {
                  transitTime: 'THREE_DAYS',
                  ineligibleForMoneyBackGuarantee: false
                }
              }
            ]
          }
        })
      });

    const rates = await adapter.fetchRates({
      origin: { 
        name: 'Sender',
        street1: '123 Start St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001', 
        country: 'US' 
      },
      destination: { 
        name: 'Receiver',
        street1: '456 End St',
        city: 'Beverly Hills',
        state: 'CA',
        postalCode: '90210', 
        country: 'US' 
      },
      package: { 
        id: 'pkg-1',
        type: 'box',
        weight: { value: 10, unit: 'lbs' }, 
        dimensions: { length: 10, width: 10, height: 10, unit: 'in' } 
      },
      options: {
        speed: 'standard',
        insurance: false,
        signatureRequired: false,
        saturdayDelivery: false,
        fragileHandling: false
      }
    });

    expect(rates).toHaveLength(1);
    expect(rates[0].carrier).toBe('FedEx');
    expect(rates[0].totalCost).toBe(15.50);
    expect(rates[0].features).toContain('Three Days');
  });

  it('should return empty array on API error', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'token', expires_in: 3600 })
    });

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}), 
      text: async () => 'System Unavailable'
    });

    const rates = await adapter.fetchRates({
      origin: { 
        name: 'Sender',
        street1: '123 Start St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001', 
        country: 'US' 
      },
      destination: { 
        name: 'Receiver',
        street1: '456 End St',
        city: 'Beverly Hills',
        state: 'CA',
        postalCode: '90210', 
        country: 'US' 
      },
      package: { 
        id: 'pkg-1',
        type: 'box',
        weight: { value: 10, unit: 'lbs' }, 
        dimensions: { length: 10, width: 10, height: 10, unit: 'in' } 
      },
      options: {
        speed: 'standard',
        insurance: false,
        signatureRequired: false,
        saturdayDelivery: false,
        fragileHandling: false
      }
    });

    expect(rates).toEqual([]);
  });
});