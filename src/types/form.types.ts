import {
  CreatePrescriptionInput,
  EditPrescriptionInput,
} from './generated.types';

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

export interface FormForEditPrescriptionFields
  extends Pick<EditPrescriptionInput, 'id' | 'description' | 'name'> {}

export interface ConfirmFormFields {
  agree: boolean;
}

export interface FormForEditMyProfileFields {
  name?: string;
  currentPassword?: string;
  newPassword1?: string;
  newPassword2?: string;
}

export interface FormForCreateClinicFields {
  name: string;
}
