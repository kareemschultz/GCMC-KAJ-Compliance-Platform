import { createContext, useContext } from 'react';

export interface NewClientWizardData {
  type: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tin: string;
  nis: string;
  vat: string;
  regNumber: string;
  primaryIdType: string;
  primaryIdNumber: string;
  secondaryIdType: string;
  secondaryIdNumber: string;
  firstName: string;
  middleName: string;
  surname: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  passportNumber: string;
  passportExpiry: string;
  idIssueDate: string;
  isLocalContentQualified: boolean;
  isLocalAccount: boolean;
  selectedServices: string[];
  uploadedFiles: Record<string, File>;
}

export interface NewClientWizardContextType {
  formData: NewClientWizardData;
  setFormData: React.Dispatch<React.SetStateAction<NewClientWizardData>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  totalSteps: number;
  handleNext: () => void;
  handleBack: () => void;
  isLoading: boolean;
  validateStep: (step: number) => boolean;
  toggleService: (serviceName: string) => void;
  handleFileUpload: (requirementName: string, file: File) => void;
  handleRemoveFile: (requirementName: string) => void;
}

export const NewClientWizardContext = createContext<NewClientWizardContextType | undefined>(undefined);

export const useNewClientWizard = () => {
  const context = useContext(NewClientWizardContext);
  if (!context) {
    throw new Error('useNewClientWizard must be used within a NewClientWizardProvider');
  }
  return context;
};
