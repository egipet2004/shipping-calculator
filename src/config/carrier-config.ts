import { CarrierName } from "@/types/domain";

interface CarrierCredentials{
    apiKey: string;
    apiSecret: string;
    endpoint: string;
    timeout: number;
    accountNumber?: string;
}

interface CarrierConfiguration{
    [key: string]: CarrierCredentials;
}

class CarrierConfigManager{
    private static instance: CarrierConfigManager;
    private config: CarrierConfiguration;

    private constructor(){
        this.config = this.loadConfiguration();
    }

    static getInstance(): CarrierConfigManager{
        if(!CarrierConfigManager.instance)
            CarrierConfigManager.instance = new CarrierConfigManager();
        return CarrierConfigManager.instance;
    }

    getCarrierCredentials(carrier: CarrierName): CarrierCredentials{
        if(!this.config[carrier])
            throw new Error(`Configuration for carrier "${carrier}" not found`);
        return this.config[carrier];
    
    }

    private loadConfiguration(): CarrierConfiguration {
    const defaultTimeout = 5000;
        return {
            FedEx: {
                apiKey: process.env.FEDEX_API_KEY!,
                apiSecret: process.env.FEDEX_API_SECRET!,
                endpoint: process.env.FEDEX_API_URL!,
                timeout: defaultTimeout,
                accountNumber: process.env.FEDEX_API_NUMBER!,
            }
        };
    }
}
export const carrierConfig = CarrierConfigManager.getInstance();