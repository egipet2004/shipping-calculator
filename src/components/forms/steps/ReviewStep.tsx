import { RateRequest } from '@/types/domain';
import { SubmitButton } from '../controls/SubmitButton';

interface ReviewStepProps {
  data: RateRequest;
  onEditStep: (step: number) => void;
}

export function ReviewStep({ data, onEditStep }: ReviewStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-semibold text-gray-900">Review & Calculate</h2>
      <p className="text-gray-500 text-sm">Please review your shipment details before calculating rates.</p>
      
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Package</h3>
            <button onClick={() => onEditStep(1)} className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">Edit</button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="block text-gray-400 text-xs uppercase tracking-wider">Type</span>
              <span className="capitalize">{data.package.type}</span>
            </div>
            <div>
              <span className="block text-gray-400 text-xs uppercase tracking-wider">Weight</span>
              {data.package.weight.value} {data.package.weight.unit}
            </div>
            <div className="col-span-2">
              <span className="block text-gray-400 text-xs uppercase tracking-wider">Dimensions</span>
              {data.package.dimensions.length} x {data.package.dimensions.width} x {data.package.dimensions.height} {data.package.dimensions.unit}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Route</h3>
            <button onClick={() => onEditStep(2)} className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">Edit</button>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">From</span>
              <p className="font-medium text-gray-900">{data.origin.name}</p>
              <p className="text-gray-600">{data.origin.street1}</p>
              <p className="text-gray-600">{data.origin.city}, {data.origin.state} {data.origin.postalCode}</p>
              <p className="text-gray-600">{data.origin.country}</p>
            </div>
            <div>
              <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">To</span>
              <p className="font-medium text-gray-900">{data.destination.name}</p>
              <p className="text-gray-600">{data.destination.street1}</p>
              <p className="text-gray-600">{data.destination.city}, {data.destination.state} {data.destination.postalCode}</p>
              <p className="text-gray-600">{data.destination.country}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Service Options</h3>
            <button onClick={() => onEditStep(3)} className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">Edit</button>
          </div>
          <div className="text-sm text-gray-600">
            <div className="mb-2">
              <span className="block text-gray-400 text-xs uppercase tracking-wider">Speed</span>
              <span className="font-medium text-gray-900 capitalize">{data.options.speed.replace('-', ' ')}</span>
            </div>
            
            {(data.options.insurance || data.options.signatureRequired || data.options.fragileHandling || data.options.saturdayDelivery) ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {data.options.signatureRequired && <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Signature</span>}
                {data.options.insurance && <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Insurance (${data.options.insuredValue})</span>}
                {data.options.fragileHandling && <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">Fragile</span>}
                {data.options.saturdayDelivery && <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">Saturday</span>}
              </div>
            ) : (
              <p className="text-gray-400 italic">No additional services selected</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <SubmitButton />
      </div>
    </div>
  );
}