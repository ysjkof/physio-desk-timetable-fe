import { SubmitHandler, useForm } from 'react-hook-form';
import { Checkbox, InputWrapper, MenuButton } from '../../../../components';
import { Input, Textarea } from '../../../../components';
import { Buttons } from '../FormForReservation/FormForReservation';
import { GENDER_KOR } from '../../../../constants/constants';
import { REG_EXP } from '../../../../constants/regex';
import { useCreatePatient } from '../../../../hooks';
import { isValidDateFrom8Digit } from '../../../../utils/dateUtils';
import type { FormForCreatePatientFields } from '../../../../types/formTypes';
import type { CloseAction } from '../../../../types/propsTypes';
import { Gender } from '../../../../types/commonTypes';

const FormForCreatePatient = ({ closeAction }: CloseAction) => {
  const { createPatientMutation } = useCreatePatient();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<FormForCreatePatientFields>();

  const onSubmit: SubmitHandler<FormForCreatePatientFields> = (data) => {
    if (data.birthday && !isValidDateFrom8Digit(String(data.birthday))) {
      return setError('birthday', { message: '잘못된 날짜입니다.' });
    }
    createPatientMutation(data, closeAction);
  };

  const nameError =
    errors.name?.message ||
    (errors.name?.type === 'pattern' && REG_EXP.personName.condition);
  const genderError = errors.gender?.message;
  const memoError = errors.memo?.message;
  const birthError =
    errors.birthday?.message ||
    (errors.birthday?.type === 'pattern' && REG_EXP.birthday.condition);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 pt-8"
    >
      <div className="flex flex-col gap-5 px-4">
        <InputWrapper label="이름" htmlFor="이름" required error={nameError}>
          <Input
            id="이름"
            required
            register={register('name', {
              required: '이름을 입력하세요',
              pattern: REG_EXP.personName.pattern,
            })}
          />
        </InputWrapper>
        <InputWrapper label="성별" htmlFor="성별" required error={genderError}>
          <div className="gender-radio flex justify-around">
            {['male', 'female'].map((gender) => (
              <Checkbox
                key={gender}
                id={`create-patient-gender-${gender}`}
                label={GENDER_KOR[gender as Gender]}
                type="radio"
                value={gender}
                register={register('gender', { required: '성별을 선택하세요' })}
              />
            ))}
          </div>
        </InputWrapper>
        <InputWrapper label="생일" htmlFor="생일" error={birthError}>
          <Input
            id="생일"
            type="number"
            placeholder="생년월일 숫자만 8자를 입력하세요"
            register={register('birthday', {
              pattern: REG_EXP.birthday.pattern,
            })}
          />
        </InputWrapper>
        <InputWrapper label="메모" htmlFor="메모" error={memoError}>
          <Textarea
            id="메모"
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
