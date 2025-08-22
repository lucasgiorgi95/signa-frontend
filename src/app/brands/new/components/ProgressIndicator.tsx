'use client';

import { CheckIcon } from '@heroicons/react/24/outline';

type Step = {
  numero: number;
  titulo: string;
};

type ProgressIndicatorProps = {
  steps: Step[];
  currentStep: number;
};

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
  
  return (
    <div className="w-full max-w-2xl mx-auto mb-12 px-4">
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-4 left-0 right-0 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Steps */}
        <div className="relative z-10 flex justify-between">
          {steps.map((paso, index) => {
            const isComplete = currentStep > paso.numero;
            const isCurrent = currentStep === paso.numero;
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;
            
            return (
              <div 
                key={paso.numero} 
                className={`flex flex-col items-center group ${isFirst ? 'ml-0' : ''} ${isLast ? 'mr-0' : ''}`}
              >
                <div 
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-all duration-300 ${
                    isComplete 
                      ? 'bg-indigo-600 text-white scale-110' 
                      : isCurrent 
                      ? 'border-2 border-indigo-600 bg-white text-indigo-600 scale-110 ring-4 ring-indigo-100' 
                      : 'bg-white border-2 border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500'
                  }`}
                >
                  {isComplete ? (
                    <CheckIcon className="h-5 w-5 text-white" />
                  ) : (
                    <span className="font-semibold">{paso.numero}</span>
                  )}
                  {isCurrent && (
                    <span className="absolute -bottom-7 text-xs font-medium text-indigo-600 animate-pulse">
                      {paso.titulo}
                    </span>
                  )}
                </div>
                {!isCurrent && (
                  <span 
                    className={`mt-2 text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                      isComplete ? 'text-indigo-600 font-semibold' : 'text-gray-500'
                    }`}
                  >
                    {paso.titulo}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
