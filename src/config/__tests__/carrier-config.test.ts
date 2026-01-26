import { describe, it, expect, vi } from 'vitest';
import { CarrierConfigManager } from '../carrier-config';

describe('Singleton Pattern: CarrierConfigManager', () => {

  it('should always return the same instance (Verify getInstance)', () => {
    const instance1 = CarrierConfigManager.getInstance();
    const instance2 = CarrierConfigManager.getInstance();
    
    // Проверяем, что это один и тот же объект в памяти
    expect(instance1).toBe(instance2);
  });

  it('should throw error for unknown carrier', () => {
    const config = CarrierConfigManager.getInstance();
    
    // @ts-ignore - Игнорируем проверку типов TS, чтобы проверить ошибку в рантайме
    expect(() => config.getCarrierCredentials('DHL')).toThrow(/not found/);
  });

  it('should return configuration for FedEx', () => {
    const config = CarrierConfigManager.getInstance();
    
    // Т.к. мы не задавали реальные env переменные, поля могут быть undefined,
    // но сам объект конфигурации для FedEx должен существовать.
    // Если в вашем коде стоит "!", то TS ожидает строку, но в тесте без env это будет undefined.
    // Мы проверим, что метод не падает и возвращает объект.
    
    try {
        const creds = config.getCarrierCredentials('FedEx');
        expect(creds).toBeDefined();
        // Проверяем наличие поля timeout, которое захардкожено в вашем коде (5000)
        expect(creds.timeout).toBe(5000);
    } catch (e) {
        // Если упадет из-за отсутствия ключа FedEx в конфиге
        throw new Error('FedEx config should exist');
    }
  });
});