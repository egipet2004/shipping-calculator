import { RateRequest } from "@/types/domain"; 

interface ReviewStepProps {
  data: RateRequest;
  onEditStep: (step: number) => void;
  onCalculate: () => void;
}

export function ReviewStep({ data, onEditStep, onCalculate }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
        <h2 className="font-bold text-gray-900 border-b border-gray-200 pb-2">Review Your Details</h2>

        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Package</h3>
            <p className="text-sm text-gray-600">
              {data.package.weight.value} {data.package.weight.unit} • {data.package.dimensions.length}x{data.package.dimensions.width}x{data.package.dimensions.height} {data.package.dimensions.unit}
            </p>
          </div>
          <button onClick={() => onEditStep(1)} className="text-sm font-medium text-blue-600 hover:underline">Edit</button>
        </div>

        <div className="flex justify-between items-start border-t border-gray-200 pt-3">
          <div className="grid grid-cols-2 gap-8 w-full mr-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">From</h3>
              <p className="text-sm text-gray-600">{data.origin.city}, {data.origin.state} {data.origin.postalCode}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">To</h3>
              <p className="text-sm text-gray-600">{data.destination.city}, {data.destination.state} {data.destination.postalCode}</p>
            </div>
          </div>
          <button onClick={() => onEditStep(2)} className="text-sm font-medium text-blue-600 hover:underline">Edit</button>
        </div>
        <div className="flex justify-between items-start border-t border-gray-200 pt-3">
          <div className="w-full mr-4">
             <h3 className="text-sm font-semibold text-gray-900">Service Options</h3>
             <div className="mt-1">
                <span className="text-sm font-medium text-gray-900 capitalize block">
                  Speed: {data.options.speed.replace('-', ' ')}
                </span>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.options.signatureRequired && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Signature</span>
                  )}
                  {data.options.insurance && (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Insurance (${data.options.insuredValue})</span>
                  )}
                  {data.options.fragileHandling && (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">Fragile</span>
                  )}
                  {data.options.saturdayDelivery && (
                    <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">Saturday</span>
                  )}
                  {(!data.options.signatureRequired && !data.options.insurance && !data.options.fragileHandling && !data.options.saturdayDelivery) && (
                     <span className="text-xs text-gray-400 italic">No extras selected</span>
                  )}
                </div>
             </div>
          </div>
          <button onClick={() => onEditStep(3)} className="text-sm font-medium text-blue-600 hover:underline">Edit</button>
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="button" 
          onClick={onCalculate} 
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Calculate Rates
        </button>
      </div>
    </div>
  );
}