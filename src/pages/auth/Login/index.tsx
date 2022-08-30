import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  LoginInput,
  LoginMutation,
  useLoginMutation,
} from '../../../graphql/generated/graphql';
import { Input } from '../../../components/molecules/Input';
import { FormError } from '../../../components/atoms/FormError';
import { Button } from '../../../components/molecules/Button';
import { REG_EXP } from '../../../constants/regex';
import { login } from '../authServices';
import { toastVar } from '../../../store';

export const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
    setError,
  } = useForm<LoginInput>({ mode: 'onChange' });

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token, error },
    } = data;
    if (!ok) {
      toastVar({ message: '로그인이 유효하지 않습니다.' });
    }

    if (ok && token) {
      login(token, () => navigate('/'));
    } else if (error) {
      toastVar({ message: `에러 발생; ${error}` });
    }
  };

  const [loginMutation, { loading }] = useLoginMutation({
    onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Muool</title>
      </Helmet>

      <h4 className="mb-6 text-center text-base font-semibold">
        물리치료사를 위한 하나의 앱
      </h4>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 mb-5 grid w-full gap-3"
      >
        <Input
          id="email"
          type="email"
          placeholder="Email"
          label={'Email'}
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
          id="password"
          type="password"
          placeholder="Password"
          label="비밀번호"
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
        <Button
          type="submit"
          canClick={isValid}
          loading={loading}
          textContents={'로그인'}
        />
      </form>
    </>
  );
};
