import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { login } from '../authServices';
import { toastVar } from '../../../store';
import Input from '../../../components/molecules/Input';
import FormError from '../../../components/atoms/FormError';
import Button from '../../../components/molecules/Button';
import { REG_EXP } from '../../../constants/regex';
import { MUOOL } from '../../../constants/constants';
import { Login as LoginDocument } from '../../../graphql/documentNode';
import type {
  LoginInput,
  LoginMutation,
} from '../../../models/generated.models';

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<LoginInput>({ mode: 'onChange' });

  const [loginMutation, { loading }] =
    useMutation<LoginMutation>(LoginDocument);

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
            login: { ok, token, error },
          } = data;

          if (error) {
            return toastVar({ messages: [error] });
          }

          if (ok && token) {
            return login(token, () => navigate('/'));
          }
        },
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>로그인 | {MUOOL}</title>
      </Helmet>

      <h4 className="mb-6 text-center text-base font-semibold">
        물리치료사를 위한 하나의 앱
      </h4>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 mb-5 grid w-full gap-3"
      >
        <Input
          id="login__email"
          label={'Email'}
          type="email"
          placeholder="Email"
          maxLength={REG_EXP.email.maxLength}
          register={register('email', {
            required: 'Email을 입력하세요',
            pattern: REG_EXP.email.pattern,
          })}
          children={
            <>
              {errors.email?.message ? (
                <FormError errorMessage={errors.email.message} />
              ) : (
                errors.email?.type === 'pattern' && (
                  <FormError errorMessage={REG_EXP.email.condition} />
                )
              )}
            </>
          }
        />
        <Input
          id="login__password"
          label="비밀번호"
          type="password"
          placeholder="Password"
          register={register('password', {
            required: '비밀번호를 입력하세요',
            pattern:
              process.env.NODE_ENV === 'production'
                ? REG_EXP.password.pattern
                : undefined,
          })}
        >
          {errors.password?.message ? (
            <FormError errorMessage={errors.password.message} />
          ) : (
            errors.password?.type === 'pattern' && (
              <FormError errorMessage={REG_EXP.password.condition} />
            )
          )}
        </Input>
        <Button type="submit" canClick={isValid} loading={loading}>
          로그인
        </Button>
      </form>
    </>
  );
}
