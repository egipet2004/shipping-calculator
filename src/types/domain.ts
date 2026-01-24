export type DimensionUnit = 'cm' | 'in';

export interface PackageDimensions{
    length: number;
    width: number;
    height: number;
    unit: DimensionUnit;
}

export type WeightUnit = 'lbs' | 'kg';

export interface PackageWeight{
    value: number;
    unit: WeightUnit;
}

export type PackageType = 'envelope' | 'box' | 'tube' | 'custom';

export interface Package{
    id: string;
    dimensions: PackageDimensions;
    weight: PackageWeight;
    type: PackageType;
    declaredValue?: number;
}

export interface AddressInformation{
    name: string;
    street1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    street2?: string;
    phone?:string;
}

export type ServiceSpeed = 'overnight' | 'two-day' | 'standard' | 'economy';

export interface ShippingOptions{
    speed: ServiceSpeed;
    signatureRequired: boolean;
    insurance: boolean;
    fragileHandling: boolean;
    saturdayDelivery: boolean;
    insuredValue?: number;
}

export type CarrierName = 'USPS' | 'FedEx' | 'UPS' | 'DHL';

export type FeeType = 'insurance' | 'signature' | 'fragile' | 'saturdayDelivery';

export interface Fee{
    type: FeeType;
    amount: number;
    description: string;
}

export interface ShippingRate{
    id: string;                          
    carrier: CarrierName;              
    serviceCode: string;                
    serviceName: string;                
    speed: ServiceSpeed;                
    features: string[];                  
    baseRate: number;                    
    additionalFees: Fee[];               
    totalCost: number;                   
    estimatedDeliveryDate: Date | string;         
    guaranteedDelivery: boolean;         
}

export interface RateRequest{
    package: Package;
    origin: AddressInformation;
    destination: AddressInformation;
    options: ShippingOptions;
    carriers?: CarrierName[];
}

export interface RateResponse {
    requestId: string;        
    rates: ShippingRate[];    
    errors: CarrierError[];   
    timestamp: Date;
}

export interface CarrierError {
    carrier: CarrierName;    
    message: string;         
    recoverable: boolean;
}