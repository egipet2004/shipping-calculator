import { CarrierName } from "@/types/domain";
import { CarrierAdapter } from "./adapter";
import { FedExAdapter } from "../fedex-adapter"; 

export function getCarrierAdapter(carrier: CarrierName): CarrierAdapter {
  switch (carrier) {
    case 'FedEx':
      return new FedExAdapter();
    case 'UPS':
      throw new Error("UPS Adapter is not implemented yet.");
    case 'USPS':
      throw new Error("USPS Adapter is not implemented yet.");
    case 'DHL':
      throw new Error("DHL Adapter is not implemented yet.");
    default:
      throw new Error(`Unknown carrier: ${carrier}`);
  }
}