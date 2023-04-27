import { Helmet } from 'react-helmet-async';
import { REG_EXP } from '../../../constants/regex';
import { SERVICE_NAME, isProduction } from '../../../constants/constants';
import { Input, InputWrapper } from '../../../components';
import { MenuButton } from '../../../components';
import { CheckboxOfRequiredAgreements } from './components';
import { useSignUp } from './hook';

export default function SignUp() {
  const {
    handleSubmit,
    register,
    emailError,
    nameError,
    nicknameError,
    passwordError,
    confirmPasswordError,
    agreementError,
  } = useSignUp();

  return (
    <>
      <Helmet title={`회원가입 | ${SERVICE_NAME.ko}`} />

      <h2 className="mb-8 text-center text-base font-semibold">
        {SERVICE_NAME.ko}에 회원가입
      </h2>

      <form onSubmit={handleSubmit} className="relative mb-6 grid w-full gap-4">
        <InputWrapper label="이메일" htmlFor="email" error={emailError}>
          <Input
            name="email"
            type="email"
            placeholder="로그인 아이디(ID)로 사용합니다"
            maxLength={REG_EXP.email.maxLength}
            register={register('email', {
              required: '이메일을 입력하세요',
              pattern: REG_EXP.email.pattern,
            })}
          />
        </InputWrapper>
        <InputWrapper label="이름" htmlFor="name" error={nameError}>
          <Input
            name="name"
            type="text"
            placeholder="변경할 수 없고 화면에 표시됩니다"
            maxLength={REG_EXP.personName.maxLength}
            register={register('name', {
              required: '이름을 입력하세요',
              pattern: REG_EXP.personName.pattern,
            })}
          />
        </InputWrapper>
        <InputWrapper label="별명" htmlFor="nickname" error={nicknameError}>
          <Input
            name="nickname"
            type="text"
            placeholder="화면에 표시됩니다"
            maxLength={REG_EXP.personName.maxLength}
            register={register('nickname', {
              required: '별명을 입력하세요',
              pattern: REG_EXP.personName.pattern,
            })}
          />
        </InputWrapper>
        <InputWrapper label="비밀번호" htmlFor="password" error={passwordError}>
          <Input
            name="password"
            type="password"
            placeholder="비밀번호"
            {...(isProduction
              ? {
                  minLength: REG_EXP.password.minLength,
                  maxLength: REG_EXP.password.maxLength,
                  register: register('password', {
                    required: '비밀번호를 입력하세요',
                    pattern: REG_EXP.password.pattern,
                  }),
                }
              : {
                  register: register('password', {
                    required: '비밀번호를 입력하세요',
                  }),
                })}
          />
        </InputWrapper>
        <InputWrapper
          label="비밀번호 확인"
          htmlFor="confirmPassword"
          error={confirmPasswordError}
        >
          <Input
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            register={register('confirmPassword', {
              required: '비밀번호 확인을 입력하세요',
              validate: {
                matchPassword: (value, { password }) => {
                  return password === value;
                },
              },
            })}
          />
        </InputWrapper>

        <CheckboxOfRequiredAgreements
          register={register('requiredAgreements', {
            required: '동의해야 이용할 수 있습니다',
          })}
          error={agreementError}
        />

        <MenuButton
          type="submit"
          className="w-full rounded-md bg-[#6BA6FF] text-base font-bold text-white"
        >
          가입하기
        </MenuButton>
      </form>
    </>
  );
}
