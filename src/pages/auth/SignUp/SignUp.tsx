import { useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { REG_EXP } from '../../../constants/regex';
import { setToast } from '../../../store';
import { MUOOL } from '../../../constants/constants';
import { CREATE_ACCOUNT_DOCUMENT } from '../../../graphql';
import FormError from '../../../components/FormError';
import { Input } from '../../timetable/components/FormForReservation/InputForReserve';
import { MenuButton } from '../../../components';
import type {
  CreateAccountInput,
  CreateAccountMutation,
} from '../../../types/generated.types';

export default function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateAccountInput>({
    mode: 'onChange',
  });

  const [createAccountMutation, { loading, data: createdAccountResult }] =
    useMutation<CreateAccountMutation>(CREATE_ACCOUNT_DOCUMENT);

  const emailError =
    errors.email?.message ||
    (errors.email?.type === 'pattern' && REG_EXP.email.condition);
  const nameError =
    errors.name?.message ||
    (errors.name?.type === 'pattern' && REG_EXP.personName.condition);
  const passwordError =
    errors.password?.message ||
    (errors.password?.type === 'pattern' && REG_EXP.password.condition);
  const showError =
    emailError ||
    nameError ||
    passwordError ||
    createdAccountResult?.createAccount.error;

  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data;

    if (error) {
      return setToast({
        messages: [error],
      });
    }

    if (ok) {
      setToast({
        messages: [
          '계정을 만들었습니다.',
          '입력하신 이메일 주소로 인증 코드를 보냈습니다.',
          '이메일 서비스에 따라 1~10분 소요될 수 있습니다.',
          '이메일 인증을 하면 모든 기능을 사용할 수 있습니다.',
          '메일이 오지 않을 경우 스팸메일함을 확인하거나,',
          '오른쪽 상단 내 이름 클릭 -> 나의 정보에서 인증메일 다시받기 해주세요',
        ],
      });
      return navigate('/login');
    }
  };

  const onSubmit = () => {
    if (!loading) {
      const { name, email, password } = getValues();
      if (!name || !email || !password) return;

      createAccountMutation({
        variables: {
          input: { name, email, password },
        },
        onCompleted,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>계정 만들기 | {MUOOL}</title>
      </Helmet>

      <h2 className="mb-8 text-center text-base font-semibold">
        계정을 만드세요
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mb-6 grid w-full gap-4"
      >
        {showError && <FormError top="-1.7rem" error={showError} />}
        <Input
          id="sign-up__email"
          label="Email"
          type="email"
          placeholder="로그인에 사용할 Email을 입력하세요"
          maxLength={REG_EXP.email.maxLength}
          register={register('email', {
            required: 'Email을 입력하세요',
            pattern: REG_EXP.email.pattern,
          })}
        />

        <Input
          id="sign-up__name"
          label="이름"
          type="text"
          placeholder="이름을 입력하세요"
          maxLength={REG_EXP.personName.maxLength}
          register={register('name', {
            required: '이름을 입력하세요',
            pattern: REG_EXP.personName.pattern,
          })}
        />
        <Input
          id="sign-up__password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          maxLength={REG_EXP.password.maxLength}
          register={register('password', {
            required: '비밀번호를 입력하세요',
            pattern:
              process.env.NODE_ENV === 'production'
                ? REG_EXP.password.pattern
                : undefined,
          })}
        />
        <MenuButton
          type="submit"
          className="w-full rounded-md bg-[#6BA6FF] text-base font-bold text-white"
        >
          계정 만들기
        </MenuButton>
      </form>
    </>
  );
}
