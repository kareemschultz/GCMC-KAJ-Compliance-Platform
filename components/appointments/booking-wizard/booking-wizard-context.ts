import { createContext, useContext } from 'react';

export interface BookingWizardContextType {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    brand: "GCMC" | "KAJ" | null;
    setBrand: React.Dispatch<React.SetStateAction<"GCMC" | "KAJ" | null>>;
    service: string | null;
    setService: React.Dispatch<React.SetStateAction<string | null>>;
    date: Date | undefined;
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    timeSlot: string | null;
    setTimeSlot: React.Dispatch<React.SetStateAction<string | null>>;
    isSubmitting: boolean;
    handleBrandSelect: (brand: "GCMC" | "KAJ") => void;
    handleServiceSelect: (serviceId: string) => void;
    handleDateSelect: (date: Date | undefined) => void;
    handleTimeSelect: (slot: string) => void;
    onSubmit: (data: any) => Promise<void>;
    getSelectedServiceDetails: () => { id: string; name: string; duration: number; price: number; } | undefined;
    form: any;
}

export const BookingWizardContext = createContext<BookingWizardContextType | undefined>(undefined);

export const useBookingWizard = () => {
    const context = useContext(BookingWizardContext);
    if (!context) {
        throw new Error('useBookingWizard must be used within a BookingWizardProvider');
    }
    return context;
};
