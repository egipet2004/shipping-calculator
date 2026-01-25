import { Fee, ShippingOptions } from "@/types/domain";

export interface RateComponent {
  getCost(): number;
  getDescription(): string;
  getFees(): Fee[];
}

export class BaseRate implements RateComponent {
  constructor(private amount: number, private description: string) {}

  public getCost(): number {
    return this.amount;
  }

  public getDescription(): string {
    return this.description;
  }

  public getFees(): Fee[] {
    return [];
  }
}

export abstract class RateDecorator implements RateComponent {
  constructor(protected wrapped: RateComponent) {}

  public getCost(): number {
    return this.wrapped.getCost();
  }

  public getDescription(): string {
    return this.wrapped.getDescription();
  }

  public getFees(): Fee[] {
    return this.wrapped.getFees();
  }
}

export class InsuranceDecorator extends RateDecorator {
  constructor(wrapped: RateComponent, private insuredValue: number) {
    super(wrapped);
  }

  public getCost(): number {
    return super.getCost() + this.calculateInsurance();
  }

  public getFees(): Fee[] {
    return [
      ...super.getFees(),
      {
        type: 'insurance', 
        amount: this.calculateInsurance(),
        description: `Insurance for value $${this.insuredValue}`
      }
    ];
  }

  private calculateInsurance(): number {
    const calculated = this.insuredValue * 0.01;
    return Math.max(calculated, 2.50);
  }
}

export class SignatureDecorator extends RateDecorator {
  private readonly FEE = 5.50;

  public getCost(): number {
    return super.getCost() + this.FEE;
  }

  public getFees(): Fee[] {
    return [
      ...super.getFees(),
      {
        type: 'signature',
        amount: this.FEE,
        description: 'Signature Required'
      }
    ];
  }
}

export class FragileHandlingDecorator extends RateDecorator {
  private readonly FEE = 10.00;

  public getCost(): number {
    return super.getCost() + this.FEE;
  }

  public getFees(): Fee[] {
    return [
      ...super.getFees(),
      {
        type: 'fragile', 
        amount: this.FEE,
        description: 'Fragile Handling'
      }
    ];
  }
}

export class SaturdayDeliveryDecorator extends RateDecorator {
  private readonly FEE = 15.00;

  public getCost(): number {
    return super.getCost() + this.FEE;
  }

  public getFees(): Fee[] {
    return [
      ...super.getFees(),
      {
        type: 'saturdayDelivery', 
        amount: this.FEE,
        description: 'Saturday Delivery'
      }
    ];
  }
}

export function applyFees(baseRate: RateComponent, options: ShippingOptions): RateComponent {
  let rate = baseRate;
  if (options.insurance && options.insuredValue && options.insuredValue > 0) 
    rate = new InsuranceDecorator(rate, options.insuredValue);
  if (options.signatureRequired) 
    rate = new SignatureDecorator(rate);
  if (options.fragileHandling) 
    rate = new FragileHandlingDecorator(rate);
  if (options.saturdayDelivery) 
    rate = new SaturdayDeliveryDecorator(rate);
  return rate;
}