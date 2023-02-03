import { CreatePrescriptionInput } from './generated.types';

export interface FormOfReserveFields {
  userId: number;
  patientId: number;
  startDate: Date;
  prescriptions: number[];
  memo: string;
}

export interface FormForDayoffFields {
  startDate: Date;
  endDate: Date;
  userId: number;
  memo?: string;
}

export interface FormForCreatePatientFields {
  name: string;
  gender: 'male' | 'female';
  birthday?: Date;
  memo?: string;
}

export interface FormForCreatePrescriptionFields
  extends Pick<
    CreatePrescriptionInput,
    'description' | 'name' | 'prescriptionAtomIds' | 'price' | 'requiredTime'
  > {}
