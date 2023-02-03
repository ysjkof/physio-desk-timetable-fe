import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from '@apollo/client';
import { Checkbox, InputWrapper, MenuButton } from '../../../../components';
import {
  Input,
  Textarea,
} from '../../../timetable/components/FormForReservation/InputForReserve';
import { FIND_ATOM_PRESCRIPTIONS_DOCUMENT } from '../../../../graphql';
import { Buttons } from '../../../timetable/components/FormForReservation/FormForReservation';
import { useCreatePrescription } from '../../../../hooks';
import { ClinicsOfClient } from '../../../../models';
import { REG_EXP } from '../../../../constants/regex';
import type { FormForCreatePrescriptionFields } from '../../../../types/form.types';
import type { FindAtomPrescriptionsQuery } from '../../../../types/generated.types';
import { CloseAction } from '../../../../types/props.types';

const FormForCreatePrescription = ({ closeAction }: CloseAction) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormForCreatePrescriptionFields>({ mode: 'onChange' });

  const { data: findAtomPrescriptions } = useQuery<FindAtomPrescriptionsQuery>(
    FIND_ATOM_PRESCRIPTIONS_DOCUMENT
  );

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col gap-5 bg-white pt-8"
    >
      <div className="flex basis-full flex-col justify-between gap-5 px-4">
        <InputWrapper label="이름" required error={nameError}>
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
            {findAtomPrescriptions?.findAtomPrescriptions.results?.map(
              (option) => (
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
              )
            )}
          </div>
        </InputWrapper>
        <InputWrapper label="소요시간" required error={requiredTimeError}>
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
        <InputWrapper label="가격" required error={priceError}>
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
        <InputWrapper label="설명" error={descriptionError}>
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
          예약하기
        </MenuButton>
      </Buttons>
    </form>
  );
};

export default FormForCreatePrescription;
