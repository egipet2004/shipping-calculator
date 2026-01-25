import { CarrierAdapter, TrackingInfo, FedExAPIResponse } from "./carrier-adapters/adapter";
import { RateRequest, ShippingRate, ServiceSpeed } from "@/types/domain";
import { carrierConfig } from "@/config/carrier-config";


export class FedExAdapter implements CarrierAdapter {

  public async fetchRates(request: RateRequest): Promise<ShippingRate[]> {
    const credentials = carrierConfig.getCarrierCredentials('FedEx');
    console.log(`[FedEx] Fetching rates using Account: ${credentials.accountNumber || 'N/A'}`);
    const response = await this.callFedExAPI(request);
    return this.normalizeResponse(response);
  }

  public async trackPackage(trackingNumber: string): Promise<TrackingInfo> {
    throw new Error("Method not implemented.");
  }

  private async callFedExAPI(request: RateRequest): Promise<FedExAPIResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      output: {
        rateReplyDetails: [
          {
            serviceType: "FEDEX_GROUND",
            serviceName: "FedEx Ground",
            ratedShipmentDetails: [
              {
                totalNetCharge: 10.00,
                currency: "USD"
              }
            ],
            operationalDetail: {
              deliveryDate: "2026-02-01"
            }
          },
          {
            serviceType: "FEDEX_2_DAY",
            serviceName: "FedEx 2Day",
            ratedShipmentDetails: [
              {
                totalNetCharge: 10.00,
                currency: "USD"
              }
            ],
            operationalDetail: {
              deliveryDate: "2026-02-01"
            }
          },
          {
            serviceType: "FEDEX_STANDARD_OVERNIGHT",
            serviceName: "FedEx Standard Overnight",
            ratedShipmentDetails: [
              {
                totalNetCharge: 10.00,
                currency: "USD"
              }
            ],
            operationalDetail: {
              deliveryDate: "2026-02-01" 
            }
          }
        ]
      }
    };
  }

  private normalizeResponse(response: FedExAPIResponse): ShippingRate[] {
    return response.output.rateReplyDetails.map((item, index) => {
      return {
        id: `FedEx-${Date.now()}-${index}`,
        carrier: 'FedEx',
        serviceCode: item.serviceType,
        serviceName: item.serviceName,
        speed: this.mapServiceToSpeed(item.serviceType),
        totalCost: item.ratedShipmentDetails[0].totalNetCharge,
        currency: item.ratedShipmentDetails[0].currency,
        estimatedDeliveryDate: new Date(item.operationalDetail.deliveryDate),
        guaranteedDelivery: true, 
        features: ['tracking', 'insurance-included'],
        additionalFees: [],
        baseRate: item.ratedShipmentDetails[0].totalNetCharge
      };
    });
  }

  private mapServiceToSpeed(serviceType: string): ServiceSpeed {
    if (serviceType.includes('OVERNIGHT')) return 'overnight';
    if (serviceType.includes('2_DAY')) return 'two-day';
    if (serviceType.includes('GROUND')) return 'standard';
    return 'economy';
  }
}