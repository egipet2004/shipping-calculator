import { CarrierAdapter } from './carrier-adapters/adapter';
import { RateRequest, ShippingRate, ServiceSpeed } from '@/types/domain';
import { carrierConfig } from '@/config/carrier-config';

interface FedExAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

const SPEED_MAP: Record<string, ServiceSpeed> = {
  'INTERNATIONAL_FIRST': 'overnight',
  'PRIORITY_OVERNIGHT': 'overnight',
  'FIRST_OVERNIGHT': 'overnight',
  'STANDARD_OVERNIGHT': 'overnight',
  'INTERNATIONAL_PRIORITY': 'two-day',
  'FEDEX_2_DAY': 'two-day',
  'FEDEX_2_DAY_AM': 'two-day',
  'INTERNATIONAL_ECONOMY': 'standard',
  'FEDEX_EXPRESS_SAVER': 'standard',
  'FEDEX_GROUND': 'economy',
  'GROUND_HOME_DELIVERY': 'economy',
};

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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      if (!response.ok) throw new Error(`FedEx Auth Failed: ${response.statusText}`);

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
        accountNumber: { value: config.accountNumber },
        requestedShipment: {
          shipper: { address: {
            postalCode: request.origin.postalCode,
            countryCode: request.origin.country || 'US',
            city: request.origin.city,
            stateOrProvinceCode: request.origin.state
          }},
          recipient: { address: {
            postalCode: request.destination.postalCode,
            countryCode: request.destination.country || 'US',
            city: request.destination.city,
            stateOrProvinceCode: request.destination.state
          }},
          pickupType: 'USE_SCHEDULED_PICKUP',
          rateRequestType: ['ACCOUNT'],
          requestedPackageLineItems: [{
            subPackagingType: 'BAG',
            groupPackageCount: 1,
            weight: {
              units: request.package.weight.unit === 'lbs' ? 'LB' : 'KG',
              value: request.package.weight.value
            },
            dimensions: {
              length: Math.round(request.package.dimensions.length),
              width: Math.round(request.package.dimensions.width),
              height: Math.round(request.package.dimensions.height),
              units: request.package.dimensions.unit.toUpperCase()
            }
          }]
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

      const data = await response.json();

      if (data.output?.alerts) {
        const errors = data.output.alerts.filter((a: any) => a.alertType === 'ERROR');
        if (errors.length > 0) {
          console.error('FedEx Business Error:', errors[0].message);
          return [];
        }
      }

      if (!response.ok) {
        console.error('FedEx API Error:', JSON.stringify(data));
        return [];
      }

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
      const shipmentDetails = detail.ratedShipmentDetails?.find((d: any) => 
         d.rateType === 'RATED_ACCOUNT' || d.rateType === 'ACCOUNT'
      ) || detail.ratedShipmentDetails?.[0];

      if (shipmentDetails) {
        const totalNet = parseFloat(shipmentDetails.totalNetCharge || 0);
        const base = parseFloat(shipmentDetails.totalBaseCharge || totalNet);

        rates.push({
          id: `fedex-${detail.serviceType}-${Date.now()}`,
          carrier: 'FedEx',
          serviceCode: detail.serviceType,
          serviceName: this.formatServiceName(detail.serviceName || detail.serviceType),
          speed: this.mapSpeed(detail.serviceType),
          baseRate: base,
          totalCost: totalNet,
          features: this.extractFeatures(detail),
          
          additionalFees: shipmentDetails.surCharges?.map((s: any) => ({
             type: this.mapSurchargeType(s.type),
             amount: parseFloat(s.amount.amount),
             description: s.description
          })) || [],
          
          estimatedDeliveryDate: this.parseDeliveryDate(detail),
          guaranteedDelivery: !detail.operationalDetail?.ineligibleForMoneyBackGuarantee
        });
      }
    });

    return rates;
  }

  private mapSurchargeType(fedexType: string): 'fuel' | 'residential' | 'signature' | 'insurance' | 'saturdayDelivery' | 'other' {
    const type = fedexType.toUpperCase();
    if (type.includes('FUEL')) return 'fuel';
    if (type.includes('RESIDENTIAL')) return 'residential';
    if (type.includes('SIGNATURE')) return 'signature';
    if (type.includes('DECLARED_VALUE') || type.includes('INSURANCE')) return 'insurance';
    if (type.includes('SATURDAY')) return 'saturdayDelivery';
    return 'other';
  }

  private mapSpeed(serviceType: string): ServiceSpeed {
    if (SPEED_MAP[serviceType]) return SPEED_MAP[serviceType];
    const type = serviceType.toUpperCase();
    if (type.includes('OVERNIGHT') || type.includes('FIRST')) return 'overnight';
    if (type.includes('2_DAY') || type.includes('PRIORITY')) return 'two-day';
    if (type.includes('EXPRESS_SAVER') || type.includes('ECONOMY')) return 'standard';
    return 'economy';
  }

  private parseDeliveryDate(detail: any): string {
    if (detail.commit?.dateDetail?.dayCxsFormat) {
      return new Date(detail.commit.dateDetail.dayCxsFormat).toISOString();
    }
    if (detail.operationalDetail?.commitDate) {
      return new Date(detail.operationalDetail.commitDate).toISOString();
    }
    const fallbackDays = this.getDaysToAdd(detail.serviceType);
    const fallbackDate = new Date();
    fallbackDate.setDate(fallbackDate.getDate() + fallbackDays);
    return fallbackDate.toISOString();
  }

  private getDaysToAdd(serviceType: string): number {
     const speed = this.mapSpeed(serviceType);
     if (speed === 'overnight') return 1;
     if (speed === 'two-day') return 2;
     if (speed === 'standard') return 3;
     return 5;
  }

  private extractFeatures(detail: any): string[] {
    const features: string[] = [];

    if (!detail.operationalDetail?.ineligibleForMoneyBackGuarantee) {
      features.push('Money-Back Guarantee');
    }
    if (detail.operationalDetail?.deliveryDay) {
      features.push(`Delivers ${detail.operationalDetail.deliveryDay}`);
    }
    if (detail.signatureOptionType && detail.signatureOptionType !== 'SERVICE_DEFAULT') {
      features.push('Signature Required');
    }
    
    if (detail.operationalDetail?.transitTime) {
      features.push(this.formatTransitTime(detail.operationalDetail.transitTime));
    }

    return features;
  }

  private formatTransitTime(transitTime: string): string {
    return transitTime.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  private formatServiceName(rawName: string): string {
    return rawName.replace(/_/g, ' ').replace(/FEDEX/i, 'FedEx').replace(/\b\w/g, l => l.toUpperCase());
  }

  async trackPackage(trackingNumber: string): Promise<any> {
    console.warn('FedEx Tracking is not implemented yet', trackingNumber);
    return null; 
  }
}