import { createContext, useContext } from 'react';

export const translations = {
  en: {
    title: 'Book Your Appointment',
    selectService: 'Select Service',
    selectProvider: 'Choose Your Provider',
    selectDateTime: 'Select Date & Time',
    contactInfo: 'Contact Information',
    insurance: 'Insurance Information',
    notes: 'Additional Notes',
    submit: 'Book Appointment',
    cancel: 'Cancel',
    next: 'Next',
    back: 'Back',
    required: 'Required',
    optional: 'Optional',
  },
  es: {
    title: 'Reserve su Cita',
    selectService: 'Seleccionar Servicio',
    selectProvider: 'Elija su Proveedor',
    selectDateTime: 'Seleccionar Fecha y Hora',
    contactInfo: 'Información de Contacto',
    insurance: 'Información del Seguro',
    notes: 'Notas Adicionales',
    submit: 'Reservar Cita',
    cancel: 'Cancelar',
    next: 'Siguiente',
    back: 'Atrás',
    required: 'Requerido',
    optional: 'Opcional',
  },
  zh: {
    title: '预约',
    selectService: '选择服务',
    selectProvider: '选择医生',
    selectDateTime: '选择日期和时间',
    contactInfo: '联系信息',
    insurance: '保险信息',
    notes: '备注',
    submit: '预约',
    cancel: '取消',
    next: '下一步',
    back: '返回',
    required: '必填',
    optional: '选填',
  },
  ja: {
    title: '予約',
    selectService: 'サービスを選択',
    selectProvider: '医師を選択',
    selectDateTime: '日時を選択',
    contactInfo: '連絡先情報',
    insurance: '保険情報',
    notes: '備考',
    submit: '予約する',
    cancel: 'キャンセル',
    next: '次へ',
    back: '戻る',
    required: '必須',
    optional: '任意',
  },
};

export type Translation = typeof translations.en;

export interface BookingLanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translation;
}

export const BookingLanguageContext = createContext<BookingLanguageContextType | undefined>(undefined);

export const useBookingLanguage = () => {
  const context = useContext(BookingLanguageContext);
  if (!context) {
    throw new Error('useBookingLanguage must be used within BookingLanguageProvider');
  }
  return context;
};