
export type NotificationRecipient = 'proprietario' | 'financeira' | 'possuidor';

export interface NotificationData {
  id: string;
  vistoriaId: string;
  recipientType: NotificationRecipient;
  recipientName: string;
  recipientAddress: string;
  vehicleData: {
    placa: string;
    uf: string;
    marca: string;
    modelo: string;
    chassi: string;
  };
  notificationDate: string;
  presidenteName: string;
}

export interface NotificationFormData {
  vistoriaId: string;
  recipientType: NotificationRecipient;
}
