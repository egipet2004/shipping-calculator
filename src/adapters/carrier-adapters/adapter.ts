import { RateRequest, ShippingRate } from "@/types/domain";

export interface TrackingInfo {
  trackingNumber: string;
  status: string;
  estimatedDelivery: Date;
}

export interface CarrierAdapter {
  fetchRates(request: RateRequest): Promise<ShippingRate[]>;
  trackPackage(trackingNumber: string): Promise<TrackingInfo>;
}

export interface USPSAPIResponse {
  RateV4Response: {
    Package: {
      "@ID": string;
      ZipOrigination: string;
      ZipDestination: string;
      Postage: {
        MailService: string; 
        Rate: string;       
      };
    }[]; 
  };
}

export interface FedExAPIResponse {
  output: {
    rateReplyDetails: Array<{
      serviceType: string;  
      serviceName: string; 
      ratedShipmentDetails: Array<{
        totalNetCharge: number; 
        currency: string;
      }>;
      operationalDetail: {
        deliveryDate: string; 
      };
    }>;
  };
}

export interface UPSAPIResponse {
  RateResponse: {
    RatedShipment: Array<{
      Service: {
        Code: string; 
      };
      TotalCharges: {
        MonetaryValue: string; 
        CurrencyCode: string;
      };
      GuaranteedDelivery: {
        BusinessDaysInTransit: string; 
      };
    }>;
  };
}








