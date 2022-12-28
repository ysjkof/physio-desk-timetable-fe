import { useForm } from 'react-hook-form';
import {
  Checkbox,
  DateForm,
  InputWrapper,
  MenuButton,
} from '../../../../components';
import { Input, Textarea } from '../FormForReservation/InputForReserve';
import { Buttons } from '../FormForReservation/FormForReservation';
import { GENDER_KOR } from '../../../../constants/constants';
import { REG_EXP } from '../../../../constants/regex';
import { useCreatePatient } from '../../../../hooks';
import type { FormForCreatePatientFields } from '../../../../types/form.types';
import type { CloseAction } from '../../../../types/props.types';

const FormForCreatePatient = ({ closeAction }: CloseAction) => {
  const { createPatientMutation } = useCreatePatient();

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormForCreatePatientFields>();

  const setParentValue = (date: Date) => {
    setValue('birthday', date);
  };

  const onSubmit = () => {
    createPatientMutation(getValues(), closeAction);
  };

  const nameError =
    errors.name?.message ||
    (errors.name?.type === 'pattern' && REG_EXP.personName.condition);
  const genderError = errors.gender?.message;
  const memoError = errors.memo?.message;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 pt-8"
    >
      <div className="flex flex-col gap-5 px-4">
        <InputWrapper label="이름" required error={nameError}>
          <Input
            label="이름"
            required
            register={register('name', {
              required: '이름을 입력하세요',
              pattern: REG_EXP.personName.pattern,
            })}
          />
        </InputWrapper>
        <InputWrapper label="성별" required error={genderError}>
          <div className="gender-radio flex justify-around">
            {['male', 'female'].map((gender) => (
              <Checkbox
                key={gender}
                id={`create-patient-form__gender-${gender}`}
                label={GENDER_KOR[gender as 'male' | 'female']}
                type="radio"
                value={gender}
                register={register('gender', { required: '성별을 선택하세요' })}
              />
            ))}
          </div>
        </InputWrapper>
        <InputWrapper label="생일">
          <DateForm
            date={getValues('birthday')}
            setParentValue={setParentValue}
          />
        </InputWrapper>
        <InputWrapper label="메모" error={memoError}>
          <Textarea
            label="메모"
            rows={3}
            register={register('memo', {
              maxLength: {
                value: 300,
                message: '메모는 최대 300자 입니다',
              },
            })}
          />
        </InputWrapper>
      </div>
      <Buttons>
        <MenuButton
          type="button"
          className="w-full bg-close-bg text-base font-medium text-font-gray"
          onClick={closeAction}
        >
          닫기
        </MenuButton>
        <MenuButton
          type="submit"
          className="w-full bg-cst-blue text-base font-medium text-white"
        >
          등록하기
        </MenuButton>
      </Buttons>
    </form>
  );
};

export default FormForCreatePatient;
