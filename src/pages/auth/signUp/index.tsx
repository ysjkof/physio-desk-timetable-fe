import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import {
  CreateAccountInput,
  CreateAccountMutation,
  useCreateAccountMutation,
} from '../../../graphql/generated/graphql';
import { Input } from '../../../components/molecules/input';
import { FormError } from '../../../components/form-error';
import { Button } from '../../../components/molecules/button';
import { REGEX } from '../../../constants/regex';

export const SignUp = () => {
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<CreateAccountInput>({
    mode: 'onChange',
  });
  const navigate = useNavigate();
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      alert('Account Created! Log in now!');
      navigate('/');
    }
  };
  const [
    createAccountMutation,
    { loading, data: createaAccountMutationResult },
  ] = useCreateAccountMutation({ onCompleted });
  const onSubmit = () => {
    if (!loading) {
      const { name, email, password } = getValues();
      createAccountMutation({
        variables: {
          input: { name, email, password },
        },
      });
    }
  };
  return (
    <>
      <Helmet>
        <title>Create Account | Muool</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 mb-5 grid w-full gap-3"
      >
        <Input
          name="name"
          label={'이름'}
          register={register('name', {
            required: '이름을 입력하세요',
            maxLength: { value: 30, message: '최대 30자 입니다' },
          })}
          type="text"
          placeholder="Name"
          children={
            errors.name?.message && (
              <FormError errorMessage={errors.name.message} />
            )
          }
        />
        <Input
          type="email"
          placeholder="Email"
          name="email"
          label={'Email'}
          register={register('email', {
            required: 'Email을 입력하세요',
            pattern: REGEX.EMAIL,
          })}
          children={
            <>
              <div className="group absolute left-[2.5rem] top-[0.08rem] cursor-pointer">
                <FontAwesomeIcon icon={faCircleQuestion} fontSize={14} />
                <p className="bubble-arrow-t-2-5 absolute top-7 -left-12 hidden w-44 rounded-md bg-black px-3 py-2 text-center text-white group-hover:block">
                  Email은 로그인에 사용됩니다
                </p>
              </div>
              {errors.email?.message && (
                <FormError errorMessage={errors.email.message} />
              )}
              {errors.email?.type === 'pattern' && (
                <FormError errorMessage={'Email형식으로 입력하세요'} />
              )}
            </>
          }
        />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          label="비밀번호"
          register={register('password', { required: '비밀번호를 입력하세요' })}
          children={
            errors.password?.message && (
              <FormError errorMessage={errors.password.message} />
            )
          }
        />
        <Button
          type="submit"
          canClick={isValid}
          loading={loading}
          textContents={'계정 만들기'}
        />
        {createaAccountMutationResult?.createAccount.error && (
          <FormError
            errorMessage={createaAccountMutationResult.createAccount.error}
          />
        )}
      </form>
    </>
  );
};
