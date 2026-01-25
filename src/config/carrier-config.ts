import { CarrierName } from "@/types/domain";

interface CarrierCredentials{
    apiKey: string;
    apiSecret: string;
    endpoint: string;
    timeout: number;
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
            fedex: {
                apiKey: process.env.FEDEX_API_KEY!,
                apiSecret: process.env.FEDEX_API_SECRET!,
                endpoint: process.env.FEDEX_API_URL!,
                timeout: defaultTimeout,
            },
            ups: {
                apiKey: process.env.USPS_API_KEY!,
                apiSecret: process.env.USPS_API_SECRET!,
                endpoint: process.env.USPS_API_URL!,
                timeout: defaultTimeout,
            }
        };
    }
}
export const carrierConfig = CarrierConfigManager.getInstance();