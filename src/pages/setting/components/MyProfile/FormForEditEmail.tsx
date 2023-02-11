import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { InputWrapper } from '../../../../components';
import { Input } from '../../../timetable/components/FormForReservation/InputForReserve';
import { useMe } from '../../../../hooks';
import type { FormForEditEmailFields } from '../../../../types/props.types';

const FormForEditEmail = () => {
  const [meData] = useMe();
  const { register, handleSubmit } = useForm<FormForEditEmailFields>({
    defaultValues: { email: meData?.email },
  });
  const [hasInputForAuthNumber, setHasInputForAuthNumber] = useState(false);

  const onSubmit: SubmitHandler<FormForEditEmailFields> = (data) => {
    if (!data.email) return null;
    // TODO: 이메일 변경 인증 이메일 전송하기
    setHasInputForAuthNumber(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper label="Email" align="col">
          <div className="flex gap-2">
            <Input label="Email" register={register('email')} />
            <button
              className="css_default-button rounded-md border border-[#8D8DAD] px-6 py-5 text-[#8D8DAD]"
              type="submit"
            >
              변경 요청하기
            </button>
          </div>
        </InputWrapper>
      </form>
      {hasInputForAuthNumber && <FormForAuthenticationCode />}
    </div>
  );
};

interface FormForAuthenticationCodeFields {
  code: number;
}
const FormForAuthenticationCode = () => {
  const { register, handleSubmit } = useForm<FormForAuthenticationCodeFields>();

  const onSubmit: SubmitHandler<FormForAuthenticationCodeFields> = (data) => {
    if (!data.code) return null;
    // TODO: 코드 인증 요청하기
    // TODO: 인증되면 인증완료 표현하기
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <InputWrapper label="인증번호" align="col">
        <div className="flex w-2/3 gap-2">
          <Input label="인증번호" register={register('code')} />
          <button
            className="css_default-button rounded-md border border-[#8D8DAD] px-6 py-5 text-[#8D8DAD]"
            type="submit"
          >
            인증하기
          </button>
        </div>
      </InputWrapper>
      <p className="text-sm text-[#BFBFD3]">
        5분 내에 인증번호가 도착합니다. 5분이 뒤까지 도착하지 않으면 다시
        요청해주세요.
      </p>
    </form>
  );
};

export default FormForEditEmail;
