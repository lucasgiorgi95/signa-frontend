'use client';

import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type Step1NameProps = {
  name: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  transition: string;
};

export function Step1Name({ name, onNameChange, onNext, transition }: Step1NameProps) {
  return (
    <div className={`space-y-6 transition-all duration-300 ${transition}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Nombre de la Marca</h2>
        <p className="mt-2 text-gray-500">Comienza por darnos el nombre de tu marca</p>
      </div>
      <div className="relative">
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={onNameChange}
          className="mt-2 block w-full rounded-xl border-2 border-gray-200 bg-white p-4 pl-12 text-base font-medium text-gray-900 transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 hover:border-indigo-300 focus:outline-none shadow-sm"
          placeholder="Ej: Mi Marca"
          required
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <BookmarkIcon className="h-6 w-6" />
        </div>
      </div>
      <div className="pt-4">
        <button
          type="button"
          onClick={onNext}
          disabled={!name.trim()}
          className="group w-full transform rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-lg"
        >
          Siguiente
          <ArrowForwardIcon className="ml-2 inline h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
