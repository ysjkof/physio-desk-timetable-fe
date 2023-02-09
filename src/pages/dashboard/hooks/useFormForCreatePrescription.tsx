import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from '@apollo/client';
import { FIND_ATOM_PRESCRIPTIONS_DOCUMENT } from '../../../graphql';
import { useCreatePrescription } from '../../../hooks';
import { ClinicsOfClient } from '../../../models';
import { REG_EXP } from '../../../constants/regex';
import type {
  CreatePrescriptionMutationVariables,
  FindAtomPrescriptionsQuery,
} from '../../../types/generated.types';
import type { FormForCreatePrescriptionFields } from '../../../types/form.types';

export const useFormForCreatePrescription = () => {
  const {
    register,
    handleSubmit: handleSubmitWrapper,
    formState: { errors },
  } = useForm<FormForCreatePrescriptionFields>({ mode: 'onChange' });

  const { data } = useQuery<FindAtomPrescriptionsQuery>(
    FIND_ATOM_PRESCRIPTIONS_DOCUMENT
  );

  const atomPrescription = data?.findAtomPrescriptions.results || [];

  const [createPrescription] = useCreatePrescription();

  const onSubmit: SubmitHandler<FormForCreatePrescriptionFields> = (data) => {
    const { name, prescriptionAtomIds, requiredTime, price, description } =
      data;

    const variables: CreatePrescriptionMutationVariables = {
      input: {
        clinicId: ClinicsOfClient.getSelectedClinic().id,
        name: name.trim(),
        requiredTime,
        price,
        description,
        prescriptionAtomIds: prescriptionAtomIds.map((id) => +id),
      },
    };
    createPrescription({ variables });
  };

  const handleSubmit = handleSubmitWrapper(onSubmit);

  const nameError = errors.name?.message
    ? errors.name.message
    : errors.name?.type === 'pattern' && REG_EXP.prescription.condition;
  const prescriptionAtomIds =
    errors.prescriptionAtomIds?.message && errors.prescriptionAtomIds.message;
  const requiredTimeError = errors.requiredTime?.message
    ? errors.requiredTime.message
    : errors.requiredTime?.type === 'step10' && REG_EXP.numberEnd0.condition;
  const priceError = errors.price?.message && errors.price.message;
  const descriptionError =
    errors.description?.message && errors.description.message;

  const error = {
    nameError,
    prescriptionAtomIds,
    requiredTimeError,
    priceError,
    descriptionError,
  };

  return {
    handleSubmit,
    register,
    atomPrescription,
    error,
  };
};
