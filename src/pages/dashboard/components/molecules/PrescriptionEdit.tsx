import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { client } from '../../../../apollo';
import FormError from '../../../../_legacy_components/atoms/FormError';
import Button from '../../../../_legacy_components/molecules/Button';
import { REG_EXP } from '../../../../constants/regex';
import {
  EDIT_PRESCRIPTION_DOCUMENT,
  FIND_PRESCRIPTIONS_DOCUMENT,
} from '../../../../graphql';
import { toastVar } from '../../../../store';
import { changeValueInArray, cls } from '../../../../utils/common.utils';
import type {
  EditPrescriptionInput,
  EditPrescriptionMutation,
  FindPrescriptionsQuery,
} from '../../../../types/generated.types';
import type { CardProps } from '../../../../types/props.types';

interface PrescriptionEditForm
  extends Pick<EditPrescriptionInput, 'description'> {
  name: string;
}

export default function PrescriptionEdit({
  prescription,
  clinicId,
}: CardProps) {
  const { id, name, activate, description, prescriptionAtoms } = prescription;

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<PrescriptionEditForm>({
    mode: 'onChange',
    defaultValues: { name, description },
  });

  const [editPrescriptionMutation] = useMutation<EditPrescriptionMutation>(
    EDIT_PRESCRIPTION_DOCUMENT
  );

  const onSubmit = () => {
    const { description: newDescription, name: newName } = getValues();

    if (description === newDescription && name === newName) return;
    const newValue = {
      name: newName,
      description: newDescription,
    };

    editPrescriptionMutation({
      variables: {
        input: {
          id,
          ...newValue,
        },
      },
      onCompleted(data) {
        const { error } = data.editPrescription;
        if (error) return toastVar({ messages: [error] });

        client.cache.updateQuery<FindPrescriptionsQuery>(
          {
            query: FIND_PRESCRIPTIONS_DOCUMENT,
            variables: {
              input: {
                clinicId,
                onlyLookUpActive: false,
              },
            },
          },
          (cacheData) => {
            if (
              !cacheData ||
              !cacheData.findPrescriptions ||
              !cacheData.findPrescriptions.prescriptions
            )
              return cacheData;

            const index = cacheData.findPrescriptions.prescriptions.findIndex(
              (prescription) => prescription.id === id
            );
            if (index === -1) return cacheData;
            const changePrescription = {
              ...cacheData.findPrescriptions.prescriptions[index],
              ...newValue,
            };

            return {
              ...cacheData,
              findPrescriptions: {
                ...cacheData.findPrescriptions,
                prescriptions: changeValueInArray(
                  cacheData.findPrescriptions.prescriptions,
                  changePrescription,
                  index
                ),
              },
            };
          }
        );
      },
    });
  };

  const getFormError = (formErrors: typeof errors) => {
    const { description, name } = formErrors;
    if (name?.message) return name.message;
    if (name?.type === 'pattern') return REG_EXP.prescription.condition;
    if (description?.message) return description.message;
    return '';
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative px-6">
      <FormError
        className="left-0 -top-8"
        errorMessage={getFormError(errors)}
      />
      ;
      <div className="">
        <input
          id="prescription-edit__name"
          type="text"
          placeholder="처방 이름을 입력하세요"
          required
          maxLength={REG_EXP.prescription.maxLength}
          {...register('name', {
            required: '처방이름을 입력해주세요',
            pattern: REG_EXP.prescription.pattern,
          })}
          autoComplete="off"
          className="w-full px-1 text-sm font-medium focus:outline-none"
        />
      </div>
      <div className="mb-0.5 flex flex-wrap gap-2">
        {prescriptionAtoms?.map((atom) => (
          <span
            key={atom.id}
            className={cls('py-0', activate ? 'badge-green' : 'badge-gray')}
          >
            {atom.name}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <textarea
          id="prescription-edit__description"
          placeholder="설명을 입력하세요"
          {...register('description', {
            maxLength: { value: 200, message: '최대 200자입니다' },
          })}
          className="w-5/6 border px-1 focus:outline-none"
          rows={2}
        />
        <Button
          type="submit"
          isSmall
          canClick={isValid}
          loading={false}
          className="h-fit  py-0.5 focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
        >
          확인
        </Button>
      </div>
    </form>
  );
}
