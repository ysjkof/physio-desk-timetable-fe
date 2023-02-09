import { InputWrapper, MenuButton } from '../../../../components';
import {
  Input,
  Textarea,
} from '../../../timetable/components/FormForReservation/InputForReserve';
import { Buttons } from '../../../timetable/components/FormForReservation/FormForReservation';
import { REG_EXP } from '../../../../constants/regex';
import { useFormForEditPrescription } from '../../hooks/useFormForEditPrescription';
import { useGetPrescription } from '../../../../hooks';
import type { CloseAction } from '../../../../types/props.types';

const FormForEditPrescription = ({ closeAction }: CloseAction) => {
  const { data } = useGetPrescription();
  const prescription = data?.getPrescriptions.prescriptions?.[0];
  const defaultValues = prescription && {
    id: prescription.id,
    name: prescription.name,
    description: prescription.description,
  };

  const { handleSubmit, register, error } = useFormForEditPrescription({
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-5 bg-white pt-8"
    >
      <div className="flex basis-full flex-col justify-between gap-5 px-4">
        <InputWrapper label="이름" required error={error.nameError}>
          <Input
            label="이름"
            placeholder="이름"
            type="text"
            register={register('name', {
              required: '처방이름을 입력해주세요',
              pattern: REG_EXP.prescription.pattern,
            })}
          />
        </InputWrapper>
        <InputWrapper label="설명" error={error.descriptionError}>
          <Textarea
            label="설명"
            placeholder="설명"
            rows={3}
            register={register('description', {
              maxLength: { value: 200, message: '최대 200자입니다' },
            })}
          />
        </InputWrapper>
      </div>
      <Buttons>
        {closeAction && (
          <MenuButton
            type="button"
            className="w-full bg-close-bg text-base font-medium text-font-gray"
            onClick={closeAction}
          >
            닫기
          </MenuButton>
        )}
        <MenuButton
          onClick={handleSubmit}
          type="submit"
          className="w-full bg-cst-blue text-base font-medium text-white"
        >
          수정하기
        </MenuButton>
      </Buttons>
    </form>
  );
};

export default FormForEditPrescription;
