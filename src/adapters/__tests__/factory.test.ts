import { describe, it, expect } from 'vitest';
import { getCarrierAdapter } from '../carrier-adapters'; // или где у вас фабрика
import { FedExAdapter } from '../fedex-adapter';
// import { UPSAdapter } from '../ups-adapter'; // Пока нет - закомментируем или добавим заглушку

describe('Factory Pattern: getCarrierAdapter', () => {
  
  it('should return correct adapter for FedEx', () => {
    const adapter = getCarrierAdapter('FedEx');
    expect(adapter).toBeInstanceOf(FedExAdapter);
  });

  // Раскомментировать когда появятся классы
  /*
  it('should return correct adapter for USPS', () => {
    const adapter = getCarrierAdapter('USPS');
    expect(adapter).toBeInstanceOf(USPSAdapter);
  });

  it('should return correct adapter for UPS', () => {
    const adapter = getCarrierAdapter('UPS');
    expect(adapter).toBeInstanceOf(UPSAdapter);
  });
  */

  it('should throw appropriate error for unknown carrier', () => {
    // @ts-ignore
    expect(() => getCarrierAdapter('MarsExpress')).toThrow(/Unknown carrier/i);
  });
});