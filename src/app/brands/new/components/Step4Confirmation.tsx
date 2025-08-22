'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type Step4ConfirmationProps = {
  formData: {
    name: string;
    description: string;
    owner: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isSubmitting: boolean;
  transition: string;
};

export function Step4Confirmation({ 
  formData, 
  onSubmit, 
  onBack, 
  isSubmitting,
  transition 
}: Step4ConfirmationProps) {
  return (
    <div className={`space-y-6 transition-all duration-300 ${transition}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Confirmar Datos</h2>
        <p className="mt-2 text-gray-500">Revisa la información antes de continuar</p>
      </div>
      
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-sm font-medium text-gray-500">Nombre de la Marca</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{formData.name}</p>
          </div>
          
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
            <p className="mt-1 text-gray-700 whitespace-pre-line">
              {formData.description || 'No se proporcionó descripción'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Dueño/Responsable</h3>
            <p className="mt-1 text-gray-900">{formData.owner}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3 pt-4 sm:flex-row sm:justify-between sm:space-y-0">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="group flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-6 py-4 text-base font-medium text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-opacity-50 disabled:opacity-70"
        >
          <ArrowBackIcon className="mr-2 h-5 w-5 transform transition-transform duration-300 group-hover:-translate-x-1" />
          Atrás
        </button>
        
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="group flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando...
            </>
          ) : (
            <>
              <CheckCircleIcon className="mr-2 h-5 w-5 text-white" />
              Confirmar y Crear Marca
            </>
          )}
        </button>
      </div>
    </div>
  );
}
