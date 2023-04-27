import type { Gender } from './commonTypes';
import type {
  CreateAccountInput,
  CreatePrescriptionInput,
  UpdatePrescriptionInput,
} from './generatedTypes';

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
  gender: Gender;
  birthday?: number;
  memo?: string;
}

export interface FormForCreatePrescriptionFields
  extends Pick<
    CreatePrescriptionInput,
    'description' | 'name' | 'prescriptionAtomIds' | 'price' | 'requiredTime'
  > {}

export interface FormForEditPrescriptionFields
  extends Pick<UpdatePrescriptionInput, 'id' | 'description' | 'name'> {}

export interface ConfirmFormFields {
  agree: boolean;
}

export interface CreateAccountForm extends CreateAccountInput {
  confirmPassword: CreateAccountInput['password'];
  requiredAgreements: boolean;
}

export interface FormForEditMyProfileFields
  extends Pick<Partial<CreateAccountInput>, 'name' | 'nickname'> {
  currentPassword?: string;
  newPassword1?: string;
  newPassword2?: string;
}

export interface PropsWithName {
  name: string;
}

export interface FormForCreateClinicFields extends PropsWithName {}

export interface SearchPatientFormFields extends PropsWithName {}
