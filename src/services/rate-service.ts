import { 
  RateRequest, 
  RateResponse, 
  ShippingRate, 
  CarrierName, 
  CarrierError, 
  ShippingOptions 
} from "@/types/domain";
import { getCarrierAdapter } from "@/adapters/carrier-adapters";
import { applyFees } from "./fee-decorators/decorators"; 
import { BaseRate } from "./fee-decorators/decorators";

export class RateService {
  
  public async fetchAllRates(request: RateRequest): Promise<RateResponse> {
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const carriersToQuery: CarrierName[] = request.carriers && request.carriers.length > 0
      ? request.carriers
      : ['FedEx', 'UPS', 'USPS', 'DHL'];

    const promises = carriersToQuery.map(carrier => 
      this.fetchCarrierRate(carrier, request)
    );

    const results = await Promise.allSettled(promises);

    const rates: ShippingRate[] = [];
    const errors: CarrierError[] = [];

    results.forEach((result, index) => {
      const carrier = carriersToQuery[index];

      if (result.status === 'fulfilled') {
        rates.push(...result.value);
      } else {
        const error = result.reason instanceof Error ? result.reason.message : 'Unknown error';
        console.error(`[RateService] Failed to fetch ${carrier}: ${error}`);
        
        errors.push({
          carrier: carrier,
          message: error,
          recoverable: this.isRecoverableError(result.reason)
        });
      }
    });

    const sortedRates = this.sortRates(rates);

    return {
      requestId,
      rates: sortedRates,
      errors,
      timestamp: new Date()
    };
  }

  private async fetchCarrierRate(carrier: CarrierName, request: RateRequest): Promise<ShippingRate[]> {
    const rawRates = await this.retryWithBackoff(carrier, request, 3);
    return rawRates.map(rate => this.applyAdditionalFees(rate, request.options));
  }

  private applyAdditionalFees(rate: ShippingRate, options: ShippingOptions): ShippingRate {
    const baseComponent = new BaseRate(rate.baseRate, rate.serviceName);
    const decoratedComponent = applyFees(baseComponent, options);

    return {
      ...rate,
      totalCost: decoratedComponent.getCost(),
      additionalFees: decoratedComponent.getFees()
    };
  }

  private async retryWithBackoff(
    carrier: CarrierName, 
    request: RateRequest, 
    maxRetries: number
  ): Promise<ShippingRate[]> {
    let attempt = 0;
    
    while (attempt <= maxRetries) {
      try {
        const adapter = getCarrierAdapter(carrier);
        return await adapter.fetchRates(request);
      } catch (error) {
        attempt++;
        
        if (attempt > maxRetries || !this.isRecoverableError(error)) {
          throw error;
        }

        const delay = Math.pow(2, attempt) * 100;
        console.warn(`[${carrier}] Fetch failed. Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return [];
  }

  private sortRates(rates: ShippingRate[]): ShippingRate[] {
    return rates.sort((a, b) => {
      if (a.totalCost !== b.totalCost) {
        return a.totalCost - b.totalCost;
      }
      
      const dateA = new Date(a.estimatedDeliveryDate).getTime();
      const dateB = new Date(b.estimatedDeliveryDate).getTime();
      return dateA - dateB;
    });
  }

  private isRecoverableError(error: any): boolean {
    if (error instanceof Error && error.message.includes("not implemented")) {
      return false;
    }
    return true; 
  }
}