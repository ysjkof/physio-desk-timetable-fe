import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { InputWrapper } from '../../../../components';
import { Input } from '../../../timetable/components/FormForReservation/InputForReserve';
import { useMe } from '../../../../hooks';
import { useSendChangeEmail } from '../../hooks/useSendChangeEmail';
import type { FormForEditEmailFields } from '../../../../types/props.types';

const FormForEditEmail = () => {
  const [meData] = useMe();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormForEditEmailFields>({
    defaultValues: { email: meData?.email },
  });

  const [hasInputForAuthNumber, setHasInputForAuthNumber] = useState(false);

  const sendEmailToChangeEmail = useSendChangeEmail();

  const onSubmit: SubmitHandler<FormForEditEmailFields> = (data) => {
    const newEmail = data.email.trim();
    if (newEmail === meData?.email) {
      setError('email', {
        message: '이메일을 변경하려면 전과 다른 이메일을 입력하세요',
      });
      return;
    }

    setHasInputForAuthNumber(true);
    sendEmailToChangeEmail(data.email);
  };

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper label="Email" align="col" error={errors.email?.message}>
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
      {hasInputForAuthNumber && (
        <p className="text-sm text-[#BFBFD3]">
          새로 입력한 주소로 이메일을 보냈습니다. 받은 이메일을 확인하세요.
          <br />
          5분이 지나도 이메일이 도착하지 않으면 다시 요청해주세요.
        </p>
      )}
    </div>
  );
};

export default FormForEditEmail;
