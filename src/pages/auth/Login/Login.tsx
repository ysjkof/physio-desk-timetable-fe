import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { setAlert, setConfirm } from '../../../store';
import { REG_EXP } from '../../../constants/regex';
import { SERVICE_NAME, isProduction } from '../../../constants/constants';
import { LOGIN_DOCUMENT } from '../../../graphql';
import { InputWrapper, MenuButton, useLogin } from '../../../components';
import { Input } from '../../../components';
import { useCreateNewVerification } from '../../../hooks';
import type { LoginInput, LoginMutation } from '../../../types/generatedTypes';

export default function Login() {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginInput>({ mode: 'onChange' });

  const [loginMutation, { loading }] =
    useMutation<LoginMutation>(LOGIN_DOCUMENT);

  const login = useLogin();

  const createNewVerification = useCreateNewVerification();
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      if (!email || !password) return;

      loginMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
        onCompleted(data) {
          const {
            login: { ok, token, error, authRequired },
          } = data;

          if (authRequired) {
            return setConfirm({
              messages: ['이메일 인증에서 회원가입을 완료해야 됩니다.'],
              buttonText: '다시보내기',
              confirmAction: () => {
                createNewVerification(email);
              },
              targetName:
                '10분 이상 지나도 인증 이메일이 오지 않으면 다시보내기를 눌러주세요',
            });
          }

          if (error) {
            return setAlert({ messages: [error] });
          }

          if (ok && token) {
            return login(token);
          }
        },
      });
    }
  };

  return (
    <>
      <Helmet title={`로그인 | ${SERVICE_NAME.ko}`} />

      <h2 className="mb-8 text-center text-base font-semibold">
        {SERVICE_NAME.ko}에 로그인
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mb-6 grid w-full gap-4"
      >
        <InputWrapper
          label="이메일"
          htmlFor="email"
          error={
            errors.email?.message ||
            (errors.email?.type === 'pattern' && REG_EXP.email.condition)
          }
        >
          <Input
            type="email"
            placeholder="Email을 입력하세요"
            maxLength={REG_EXP.email.maxLength}
            register={register('email', {
              required: 'Email을 입력하세요',
              pattern: REG_EXP.email.pattern,
            })}
          />
        </InputWrapper>

        <InputWrapper
          label="비밀번호"
          htmlFor="password"
          error={
            errors.password?.message ||
            (errors.password?.type === 'pattern' && REG_EXP.password.condition)
          }
        >
          <Input
            type="password"
            placeholder="비밀번호를 입력하세요"
            register={register('password', {
              required: '비밀번호를 입력하세요',
              pattern: isProduction ? REG_EXP.password.pattern : undefined,
            })}
          />
        </InputWrapper>
        <MenuButton
          type="submit"
          className="rounded-md bg-[#6BA6FF] text-base font-bold text-white"
        >
          로그인
        </MenuButton>
      </form>
    </>
  );
}
