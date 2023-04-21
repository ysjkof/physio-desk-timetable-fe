import { useMutation } from '@apollo/client';
import { REG_EXP } from '../../../../constants/regex';
import { CREATE_ACCOUNT_DOCUMENT } from '../../../../graphql';
import { setAlert } from '../../../../store';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type {
  CreateAccountInput,
  CreateAccountMutation,
} from '../../../../types/generatedTypes';

interface CreateAccountForm extends CreateAccountInput {
  confirmPassword: CreateAccountInput['password'];
  requiredAgreements: boolean;
}

export const useSignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit: handleSubmitOfUseForm,
  } = useForm<CreateAccountForm>({
    mode: 'onChange',
  });

  const [createAccountMutation, { loading }] =
    useMutation<CreateAccountMutation>(CREATE_ACCOUNT_DOCUMENT);

  const onSubmit = () => {
    if (!loading) {
      const { name, email, password } = getValues();
      if (!name || !email || !password) return;

      createAccountMutation({
        variables: {
          input: { name: name.trim(), email: email.trim(), password },
        },
        onCompleted,
      });
    }
  };

  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data;

    if (error) {
      return setAlert({
        messages: [error],
      });
    }

    if (ok) {
      setAlert({
        messages: [
          '인증 이메일 전송을 요청했습니다.',
          '인증 이메일은 10분 내에 도착합니다.',
          '받은 이메일에서 가입을 완료하세요.',
        ],
      });
      return navigate('/login');
    }
  };

  const handleSubmit = handleSubmitOfUseForm(onSubmit);

  const emailError =
    errors.email?.message ||
    (errors.email?.type === 'pattern' && REG_EXP.email.condition);
  const nameError =
    errors.name?.message ||
    (errors.name?.type === 'pattern' && REG_EXP.personName.condition);
  const passwordError =
    errors.password?.message ||
    (errors.password?.type === 'pattern' && REG_EXP.password.condition);
  const confirmPasswordError =
    errors.confirmPassword?.type === 'matchPassword' &&
    '비밀번호가 일치하지 않습니다';
  const agreementError = errors.requiredAgreements?.message;

  return {
    handleSubmit,
    register,
    emailError,
    nameError,
    passwordError,
    confirmPasswordError,
    agreementError,
  };
};
