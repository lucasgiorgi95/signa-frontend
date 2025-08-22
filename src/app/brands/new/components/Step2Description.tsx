'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type Step2DescriptionProps = {
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onNext: () => void;
  onBack: () => void;
  transition: string;
};

export function Step2Description({ 
  description, 
  onDescriptionChange, 
  onNext, 
  onBack,
  transition 
}: Step2DescriptionProps) {
  return (
    <div className={`space-y-6 transition-all duration-300 ${transition}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Descripción</h2>
        <p className="mt-2 text-gray-500">Cuéntanos sobre tu marca</p>
      </div>
      <div className="relative">
        <textarea
          id="description"
          name="description"
          rows={4}
          value={description}
          onChange={onDescriptionChange}
          className="mt-2 block w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-base font-medium text-gray-900 transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 hover:border-indigo-300 focus:outline-none shadow-sm min-h-[120px]"
          placeholder="Describe los productos o servicios de tu marca..."
          required
        />
      </div>
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="group flex items-center rounded-xl border-2 border-gray-300 bg-white px-6 py-4 text-base font-medium text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-opacity-50"
        >
          <ArrowBackIcon className="mr-2 h-5 w-5 transform transition-transform duration-300 group-hover:-translate-x-1" />
          Atrás
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!description.trim()}
          className="group flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-lg"
        >
          Siguiente
          <ArrowForwardIcon className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
