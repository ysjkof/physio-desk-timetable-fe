import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from '@apollo/client';
import { FIND_ATOM_PRESCRIPTIONS_DOCUMENT } from '../../../graphql';
import { useCreatePrescription } from '../../../hooks';
import { ClinicsOfClient } from '../../../models';
import { REG_EXP } from '../../../constants/regex';
import type { FindAtomPrescriptionsQuery } from '../../../types/generated.types';
import type { FormForCreatePrescriptionFields } from '../../../types/form.types';

export const useFormForPrescription = () => {
  const {
    register,
    handleSubmit,
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
    const variables = {
      input: {
        clinicId: ClinicsOfClient.getSelectedClinic().id,
        name: name.trim(),
        requiredTime: +requiredTime,
        price: +price,
        description,
        prescriptionAtomIds: prescriptionAtomIds.map((id) => +id),
      },
    };
    createPrescription({ variables });
  };

  const nameError = errors.name?.message
    ? errors.name.message
    : errors.name?.type === 'pattern' && REG_EXP.prescription.condition;
  const requiredTimeError = errors.requiredTime?.message
    ? errors.requiredTime.message
    : errors.requiredTime?.type === 'pattern' && REG_EXP.numberEnd0.condition;
  const priceError = errors.price?.message && errors.price.message;
  const descriptionError =
    errors.description?.message && errors.description.message;

  const error = {
    nameError,
    requiredTimeError,
    priceError,
    descriptionError,
  };

  return {
    handleSubmit,
    onSubmit,
    register,
    atomPrescription,
    nameError,
    error,
  };
};
