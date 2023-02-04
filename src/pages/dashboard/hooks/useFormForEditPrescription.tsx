import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { FIND_ATOM_PRESCRIPTIONS_DOCUMENT } from '../../../graphql';
import { REG_EXP } from '../../../constants/regex';
import { useEditPrescription } from '../../../hooks/useEditPrescription';
import type {
  EditPrescriptionMutationVariables,
  FindAtomPrescriptionsQuery,
} from '../../../types/generated.types';
import type { FormForEditPrescriptionFields } from '../../../types/form.types';
import type { UseFormForEditPrescriptionProps } from '../../../types/props.types';

export const useFormForEditPrescription = ({
  defaultValues,
}: UseFormForEditPrescriptionProps) => {
  const {
    register,
    handleSubmit: handleSubmitWrapper,
    formState: { errors },
  } = useForm<FormForEditPrescriptionFields>({
    mode: 'onChange',
    defaultValues,
    values: defaultValues,
  });

  const { data } = useQuery<FindAtomPrescriptionsQuery>(
    FIND_ATOM_PRESCRIPTIONS_DOCUMENT
  );
  const atomPrescription = data?.findAtomPrescriptions.results || [];

  const [editPrescriptionMutation] = useEditPrescription();

  const { prescriptionId } = useParams();

  const onSubmit: SubmitHandler<FormForEditPrescriptionFields> = (data) => {
    if (!prescriptionId)
      throw new Error('잘못된 접근입니다. prescriptionId가 없습니다.');

    const { name, description } = data;

    const variables: EditPrescriptionMutationVariables = {
      input: {
        id: +prescriptionId,
        name: name?.trim(),
        description,
      },
    };
    editPrescriptionMutation({ variables });
  };

  const handleSubmit = handleSubmitWrapper(onSubmit);

  const nameError = errors.name?.message
    ? errors.name.message
    : errors.name?.type === 'pattern' && REG_EXP.prescription.condition;
  const descriptionError =
    errors.description?.message && errors.description.message;

  const error = {
    nameError,
    descriptionError,
  };

  return {
    handleSubmit,
    register,
    atomPrescription,
    nameError,
    error,
  };
};
