'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';

type Step = {
  label: string;
  description?: string;
};

type CustomStepperProps = {
  steps: Step[];
  activeStep: number;
};

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#6366f1', // indigo-500
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#6366f1', // indigo-500
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#e2e8f0', // gray-200
    borderTopWidth: 2,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean; completed?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: ownerState.completed ? '#6366f1' : ownerState.active ? '#6366f1' : '#9ca3af',
    display: 'flex',
    height: 24,
    width: 24,
    borderRadius: '50%',
    border: `2px solid ${ownerState.completed ? '#6366f1' : ownerState.active ? '#6366f1' : '#e2e8f0'}`,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ownerState.completed || ownerState.active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
    fontSize: '0.75rem',
    fontWeight: 600,
    '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
    ...(ownerState.active && {
      color: '#6366f1', // indigo-500
    }),
    '& .QontoStepIcon-completedIcon': {
      color: '#6366f1', // indigo-500
      zIndex: 1,
      fontSize: 18,
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props;

  return (
    <QontoStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? (
        <Check className="h-4 w-4" />
      ) : (
        <span className="text-sm font-medium">{icon}</span>
      )}
    </QontoStepIconRoot>
  );
}

export default function CustomStepper({ steps, activeStep }: CustomStepperProps) {
  return (
    <Stepper 
      alternativeLabel 
      activeStep={activeStep} 
      connector={<QontoConnector />}
      sx={{ 
        width: '100%',
        mb: 6,
        '& .MuiStepLabel-label': {
          color: '#64748b', // gray-500
          '&.Mui-active': {
            color: '#1e293b', // gray-800
            fontWeight: 500,
          },
          '&.Mui-completed': {
            color: '#1e293b', // gray-800
          },
        },
      }}
    >
      {steps.map((step, index) => (
        <Step key={step.label}>
          <StepLabel 
            StepIconComponent={QontoStepIcon}
            optional={
              step.description ? (
                <span className="text-xs text-gray-500">{step.description}</span>
              ) : null
            }
          >
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
