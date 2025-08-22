'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBrands } from '@/context/BrandContext';
import CustomStepper from '@/components/CustomStepper';
import { Alert, AlertRef } from '@/components/Alert';
import { Step1Name } from './components/Step1Name';
import { Step2Description } from './components/Step2Description';
import { Step3Owner } from './components/Step3Owner';
import { Step4Confirmation } from './components/Step4Confirmation';

type FormData = {
  name: string;
  description: string;
  owner: string;
};

export default function NewBrandPage() {
  const router = useRouter();
  const { addBrand } = useBrands();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    owner: '',
  });
  const alertRef = useRef<AlertRef>(null);
  
  const steps = [
    { label: 'Nombre', description: 'Información básica' },
    { label: 'Descripción', description: 'Detalles de la marca' },
    { label: 'Dueño', description: 'Responsable' },
    { label: 'Confirmar', description: 'Revisar datos' },
  ];

  const currentStep = step - 1; // Ajustar índice ya que los pasos empiezan en 1

  // Animation for step transitions
  const [transition, setTransition] = useState('opacity-0 translate-y-4');
  
  useEffect(() => {
    setTransition('opacity-0 translate-y-4');
    const timer = setTimeout(() => {
      setTransition('opacity-100 translate-y-0');
    }, 50);
    return () => clearTimeout(timer);
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    alertRef.current?.show(message, type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addBrand(formData);
      showAlert('¡Marca creada exitosamente!', 'success');
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error creando la marca:', error);
      showAlert('Error al crear la marca. Por favor, inténtalo de nuevo.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
   
    let isValid = true;
    
    if (step === 1 && !formData.name.trim()) {
      showAlert('Por favor, completa el campo de nombre', 'error');
      isValid = false;
    } else if (step === 2 && !formData.description.trim()) {
      showAlert('Por favor, completa el campo de descripción', 'error');
      isValid = false;
    } else if (step === 3 && !formData.owner.trim()) {
      showAlert('Por favor, completa el campo de dueño', 'error');
      isValid = false;
    }
    
    if (isValid) {
      setTransition('opacity-0 -translate-y-4');
      setTimeout(() => setStep(prev => prev + 1), 200);
    }
  };
  
  const prevStep = () => {
    setTransition('opacity-0 translate-y-4');
    setTimeout(() => setStep(prev => prev - 1), 200);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Name 
            name={formData.name}
            onNameChange={handleChange}
            onNext={nextStep}
            transition={transition}
          />
        );

      case 2:
        return (
          <Step2Description
            description={formData.description}
            onDescriptionChange={handleChange}
            onNext={nextStep}
            onBack={prevStep}
            transition={transition}
          />
        );

      case 3:
        return (
          <Step3Owner
            owner={formData.owner}
            onOwnerChange={handleChange}
            onNext={nextStep}
            onBack={prevStep}
            transition={transition}
          />
        );

      case 4:
        return (
          <Step4Confirmation
            formData={formData}
            onSubmit={handleSubmit}
            onBack={prevStep}
            isSubmitting={isSubmitting}
            transition={transition}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Alert ref={alertRef} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Crear Nueva Marca
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Sigue los pasos para registrar una nueva marca en el sistema.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-10">
          <CustomStepper steps={steps} activeStep={currentStep} />
        </div>

        {/* Contenedor del Formulario */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="px-6 py-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStep()}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
