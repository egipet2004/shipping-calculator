'use client';

import { AddressInformation} from '@/types/domain';
import { AddressForm } from '../fields/AddressForm';

interface AddressStepProps {
  origin: AddressInformation;
  destination: AddressInformation;
  onOriginChange: (address: AddressInformation) => void;
  onDestinationChange: (address: AddressInformation) => void;
  getFieldError: (field: string) => string | undefined;
}

export function AddressStep({ 
  origin, 
  destination, 
  onOriginChange, 
  onDestinationChange,
  getFieldError 
}: AddressStepProps) {

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Locations</h2>
        <p className="text-sm text-gray-500">
          Where are you shipping from and to?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AddressForm
          title="Origin Address (From)"
          address={origin}
          onChange={onOriginChange}
          getFieldError={(field) => getFieldError(`origin.${field}`)}
        />
        <AddressForm
          title="Destination Address (To)"
          address={destination}
          onChange={onDestinationChange}
          getFieldError={(field) => getFieldError(`destination.${field}`)}
        />
      </div>
    </div>
  );
}