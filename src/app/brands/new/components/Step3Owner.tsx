'use client';

import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type Step3OwnerProps = {
  owner: string;
  onOwnerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onBack: () => void;
  transition: string;
};

export function Step3Owner({ 
  owner, 
  onOwnerChange, 
  onNext, 
  onBack,
  transition 
}: Step3OwnerProps) {
  return (
    <div className={`space-y-6 transition-all duration-300 ${transition}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Dueño de la Marca</h2>
        <p className="mt-2 text-gray-500">¿Quién es el responsable de esta marca?</p>
      </div>
      <div className="relative">
        <input
          type="text"
          id="owner"
          name="owner"
          value={owner}
          onChange={onOwnerChange}
          className="mt-2 block w-full rounded-xl border-2 border-gray-200 bg-white p-4 pl-12 text-base font-medium text-gray-900 transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 hover:border-indigo-300 focus:outline-none shadow-sm"
          placeholder="Nombre del dueño o responsable"
          required
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <PersonIcon className="h-6 w-6" />
        </div>
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
          disabled={!owner.trim()}
          className="group flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-lg"
        >
          Siguiente
          <ArrowForwardIcon className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
