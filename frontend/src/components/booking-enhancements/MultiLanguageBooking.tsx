import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EnhancedBookingForm } from '../EnhancedBookingForm';

interface Translation {
  selectService: string;
  selectDateTime: string;
  patientInfo: string;
  reviewConfirm: string;
  service: string;
  provider: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  insurance: string;
  notes: string;
  bookAppointment: string;
  confirmBooking: string;
  appointmentConfirmed: string;
  confirmationCode: string;
  noAvailableSlots: string;
  selectProvider: string;
  next: string;
  back: string;
  cancel: string;
}

const translations: Record<string, Translation> = {
  en: {
    selectService: 'Select a Service',
    selectDateTime: 'Select Date & Time',
    patientInfo: 'Patient Information',
    reviewConfirm: 'Review & Confirm',
    service: 'Service',
    provider: 'Provider',
    date: 'Date',
    time: 'Time',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    insurance: 'Insurance',
    notes: 'Additional Notes',
    bookAppointment: 'Book Appointment',
    confirmBooking: 'Confirm Booking',
    appointmentConfirmed: 'Appointment Confirmed!',
    confirmationCode: 'Confirmation Code',
    noAvailableSlots: 'No available appointments for this date',
    selectProvider: 'Select a Provider',
    next: 'Next',
    back: 'Back',
    cancel: 'Cancel',
  },
  es: {
    selectService: 'Seleccionar Servicio',
    selectDateTime: 'Seleccionar Fecha y Hora',
    patientInfo: 'Información del Paciente',
    reviewConfirm: 'Revisar y Confirmar',
    service: 'Servicio',
    provider: 'Proveedor',
    date: 'Fecha',
    time: 'Hora',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    insurance: 'Seguro',
    notes: 'Notas Adicionales',
    bookAppointment: 'Reservar Cita',
    confirmBooking: 'Confirmar Reserva',
    appointmentConfirmed: '¡Cita Confirmada!',
    confirmationCode: 'Código de Confirmación',
    noAvailableSlots: 'No hay citas disponibles para esta fecha',
    selectProvider: 'Seleccionar Proveedor',
    next: 'Siguiente',
    back: 'Atrás',
    cancel: 'Cancelar',
  },
  zh: {
    selectService: '选择服务',
    selectDateTime: '选择日期和时间',
    patientInfo: '患者信息',
    reviewConfirm: '查看并确认',
    service: '服务',
    provider: '医生',
    date: '日期',
    time: '时间',
    firstName: '名',
    lastName: '姓',
    email: '电子邮件',
    phone: '电话',
    insurance: '保险',
    notes: '附加说明',
    bookAppointment: '预约',
    confirmBooking: '确认预约',
    appointmentConfirmed: '预约已确认！',
    confirmationCode: '确认码',
    noAvailableSlots: '该日期没有可用的预约',
    selectProvider: '选择医生',
    next: '下一步',
    back: '返回',
    cancel: '取消',
  },
};

interface BookingLanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translation;
}

const BookingLanguageContext = createContext<BookingLanguageContextType | undefined>(undefined);

export const useBookingLanguage = () => {
  const context = useContext(BookingLanguageContext);
  if (!context) {
    throw new Error('useBookingLanguage must be used within BookingLanguageProvider');
  }
  return context;
};

interface BookingLanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: string;
}

export const BookingLanguageProvider: React.FC<BookingLanguageProviderProps> = ({
  children,
  defaultLanguage = 'en',
}) => {
  const [language, setLanguage] = useState(defaultLanguage);
  const t = translations[language] || translations.en;

  return (
    <BookingLanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </BookingLanguageContext.Provider>
  );
};

interface MultiLanguageBookingProps {
  open: boolean;
  onClose: () => void;
  initialService?: string;
  onSuccess?: (appointmentId: string) => void;
  availableLanguages?: string[];
}

export const MultiLanguageBooking: React.FC<MultiLanguageBookingProps> = ({
  open,
  onClose,
  initialService,
  onSuccess,
  availableLanguages = ['en', 'es', 'zh'],
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  return (
    <BookingLanguageProvider defaultLanguage={selectedLanguage}>
      <div style={{ position: 'relative' }}>
        {open && (
          <div style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
          }}>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 4,
                border: '1px solid #ccc',
                backgroundColor: 'white',
              }}
            >
              {availableLanguages.map(lang => (
                <option key={lang} value={lang}>
                  {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : '中文'}
                </option>
              ))}
            </select>
          </div>
        )}
        <EnhancedBookingForm
          open={open}
          onClose={onClose}
          initialService={initialService}
          onSuccess={onSuccess}
        />
      </div>
    </BookingLanguageProvider>
  );
};