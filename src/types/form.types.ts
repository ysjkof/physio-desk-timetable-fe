export interface FormOfReserveFields {
  userId: number;
  patientId: number;
  startDate: Date;
  prescriptions: number[];
  memo: string;
}

export interface CreatePatientForm {
  name: string;
  gender: 'male' | 'female';
  birthday?: Date;
  memo?: string;
}
