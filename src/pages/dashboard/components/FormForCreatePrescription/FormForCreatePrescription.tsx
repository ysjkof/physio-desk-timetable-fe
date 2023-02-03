import { Checkbox, InputWrapper, MenuButton } from '../../../../components';
import {
  Input,
  Textarea,
} from '../../../timetable/components/FormForReservation/InputForReserve';
import { Buttons } from '../../../timetable/components/FormForReservation/FormForReservation';
import { REG_EXP } from '../../../../constants/regex';
import { useFormForPrescription } from '../../hooks/useFormForPrescription';
import type { CloseAction } from '../../../../types/props.types';

const FormForCreatePrescription = ({ closeAction }: CloseAction) => {
  const { handleSubmit, onSubmit, register, atomPrescription, error } =
    useFormForPrescription();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col gap-5 bg-white pt-8"
    >
      <div className="flex basis-full flex-col justify-between gap-5 px-4">
        <InputWrapper label="이름" required error={error.nameError}>
          <Input
            label="이름"
            placeholder="도수30, 집중형충격파1, MT20"
            type="text"
            register={register('name', {
              required: '처방이름을 입력해주세요',
              pattern: REG_EXP.prescription.pattern,
            })}
          />
        </InputWrapper>
        <InputWrapper label="처방" required>
          <div className="flex w-full flex-wrap gap-4 px-2 py-1.5">
            {atomPrescription.map((option) => (
              <Checkbox
                key={option.id}
                id={option.name}
                label={option.name}
                type="checkbox"
                value={option.id}
                register={register('prescriptionAtomIds', {
                  required: true,
                })}
              />
            ))}
          </div>
        </InputWrapper>
        <InputWrapper label="소요시간" required error={error.requiredTimeError}>
          <Input
            label="소요시간"
            placeholder="10분 단위, 0 이상의 숫자"
            step={10}
            register={register('requiredTime', {
              required: '시간을 입력해주세요',
              min: { value: 10, message: '최소 10분입니다' },
              max: { value: 180, message: '최대 180분입니다' },
              pattern: REG_EXP.numberEnd0.pattern,
            })}
            className="mr-2 w-20"
            type="number"
          />
          분
        </InputWrapper>
        <InputWrapper label="가격" required error={error.priceError}>
          <Input
            label="가격"
            placeholder="0 이상의 숫자"
            register={register('price', {
              required: '가격을 입력해주세요',
              min: { value: 0, message: '최소 0입니다' },
              max: {
                value: 100_000_000,
                message: '더 이상 불가합니다',
              },
            })}
            className="mr-2 w-48"
            type="number"
          />
          원
        </InputWrapper>
        <InputWrapper label="설명" error={error.descriptionError}>
          <Textarea
            label="설명"
            placeholder="처방에 대한 설명"
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
          onClick={handleSubmit(onSubmit)}
          type="submit"
          className="w-full bg-cst-blue text-base font-medium text-white"
        >
          등록하기
        </MenuButton>
      </Buttons>
    </form>
  );
};

export default FormForCreatePrescription;
