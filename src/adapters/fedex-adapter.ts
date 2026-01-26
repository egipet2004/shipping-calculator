import { CarrierAdapter } from './carrier-adapters/adapter';
import { RateRequest, ShippingRate, CarrierName } from '@/types/domain';
import { carrierConfig } from '@/config/carrier-config';

interface FedExAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export class FedExAdapter implements CarrierAdapter {
  private token: string | null = null;
  private tokenExpiry: number = 0;

  private async authenticate(): Promise<string> {
    const now = Date.now();
    if (this.token && now < this.tokenExpiry - 300000) {
      return this.token;
    }

    const config = carrierConfig.getCarrierCredentials('FedEx');
    
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', config.apiKey);
    params.append('client_secret', config.apiSecret);

    try {
      const response = await fetch(`${config.endpoint}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      if (!response.ok) {
        throw new Error(`FedEx Auth Failed: ${response.statusText}`);
      }

      const data = await response.json() as FedExAuthResponse;
      this.token = data.access_token;
      this.tokenExpiry = now + (data.expires_in * 1000);
      
      return this.token;
    } catch (error) {
      console.error('FedEx Auth Error:', error);
      throw error;
    }
  }

  async fetchRates(request: RateRequest): Promise<ShippingRate[]> {
    
    try {
      const token = await this.authenticate();
      const config = carrierConfig.getCarrierCredentials('FedEx');
      const payload = {
        accountNumber: {
          value: config.accountNumber
        },
        requestedShipment: {
          shipper: {
            address: {
              postalCode: request.origin.postalCode,
              countryCode: request.origin.country || 'US',
              city: request.origin.city,
              stateOrProvinceCode: request.origin.state
            }
          },
          recipient: {
            address: {
              postalCode: request.destination.postalCode,
              countryCode: request.destination.country || 'US',
              city: request.destination.city,
              stateOrProvinceCode: request.destination.state
            }
          },
          pickupType: 'DROPOFF_AT_FEDEX_LOCATION',
          rateRequestType: ['ACCOUNT', 'LIST'],
          requestedPackageLineItems: [
            {
              weight: {
                units: request.package.weight.unit === 'lbs' ? 'LB' : 'KG',
                value: request.package.weight.value
              },
              dimensions: {
                  length: request.package.dimensions.length,
                  width: request.package.dimensions.width,
                  height: request.package.dimensions.height,
                  units: request.package.dimensions.unit.toUpperCase() 
              }
            }
          ]
        }
      };

      const response = await fetch(`${config.endpoint}/rate/v1/rates/quotes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-locale': 'en_US'
        },
        body: JSON.stringify(payload),
        cache: 'no-store'
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('FedEx API Error:', errText);
        return []; 
      }

      const data = await response.json();
      return this.mapResponseToInternal(data);

    } catch (error) {
      console.error('Error in FedExAdapter:', error);
      throw error;
    }
  }

  private mapResponseToInternal(apiResponse: any): ShippingRate[] {
    const rates: ShippingRate[] = [];

    const rateDetails = apiResponse?.output?.rateReplyDetails || [];

    rateDetails.forEach((detail: any) => {
      const shipmentDetails = detail.ratedShipmentDetails?.find((d: any) => d.rateType === 'RATED_ACCOUNT') 
                           || detail.ratedShipmentDetails?.[0];

      if (shipmentDetails) {
        rates.push({
          id: `fedex-${detail.serviceType}-${Date.now()}`,
          carrier: 'FedEx',
          serviceCode: detail.serviceType,
          serviceName: this.formatServiceName(detail.serviceName || detail.serviceType),
          speed: this.mapSpeed(detail.serviceType),
          baseRate: parseFloat(shipmentDetails.totalBaseCharge || shipmentDetails.totalNetCharge),
          totalCost: parseFloat(shipmentDetails.totalNetCharge),
          features: [],
          additionalFees: shipmentDetails.surcharges?.map((s: any) => ({
             type: 'other',
             amount: parseFloat(s.amount.amount),
             description: s.description
          })) || [],
          estimatedDeliveryDate: new Date(Date.now() + 86400000 * 3).toISOString(), 
          guaranteedDelivery: false
        });
      }
    });

    return rates;
  }

  private mapSpeed(serviceType: string): 'overnight' | 'two-day' | 'standard' | 'economy' {
    const type = serviceType.toUpperCase();
    if (type.includes('OVERNIGHT') || type.includes('PRIORITY')) return 'overnight';
    if (type.includes('2_DAY')) return 'two-day';
    if (type.includes('EXPRESS_SAVER')) return 'standard';
    return 'economy'; 
  }

  private formatServiceName(rawName: string): string {
    return rawName.replace(/_/g, ' ').replace('FEDEX', 'FedEx');
  }

  async trackPackage(trackingNumber: string): Promise<any> {
    console.warn('FedEx Tracking is not implemented yet');
    return null; 
  }
}