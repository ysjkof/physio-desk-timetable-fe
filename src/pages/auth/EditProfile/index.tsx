import { gql, useApolloClient } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { FormError } from '../../../components/atoms/FormError';
import { Button } from '../../../components/molecules/Button';
import { Input } from '../../../components/molecules/Input';
import { REG_EXP } from '../../../constants/regex';
import {
  EditProfileInput,
  EditProfileMutation,
  useEditProfileMutation,
} from '../../../graphql/generated/graphql';
import { useMe } from '../../../hooks/useMe';

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();

  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { name: prevName, email: prevEmail, id },
      } = userData;

      const { name, email } = getValues();
      if (prevName === name && prevEmail === email) return;

      client.writeFragment({
        id: `User:${id}`,
        fragment: gql`
          fragment EditedUser on User {
            email
            name
            verified
          }
        `,
        data: {
          ...(prevName !== name && {
            name,
          }),
          ...(prevEmail !== email && {
            email,
            verified: false,
          }),
        },
      });
    }
  };

  const [editProfile, { loading }] = useEditProfileMutation({
    onCompleted,
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<EditProfileInput>({
    mode: 'onChange',
    defaultValues: {
      email: userData?.me.email,
      name: userData?.me.name,
    },
  });

  const onSubmit = () => {
    if (!userData) throw new Error('사용자 정보가 없습니다');

    const {
      me: { name: prevName, email: prevEmail },
    } = userData;
    const { email, name, password } = getValues();

    if (prevEmail === email && prevName === name && password === '') return;

    editProfile({
      variables: {
        input: {
          ...(prevEmail !== email && { email }),
          ...(prevName !== name && { name }),
          ...(password !== '' && { password }),
        },
      },
    });
  };
  return (
    <>
      <Helmet>
        <title>Edit Profile | Muool</title>
      </Helmet>
      <div className="container mx-auto h-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto grid w-full max-w-md gap-3 space-y-4 rounded-md bg-white px-4 py-8 shadow"
        >
          <Input
            type="email"
            placeholder="Email"
            name="email"
            label={'Email'}
            register={register('email', {
              required: 'Email을 입력하세요',
              pattern: REG_EXP.EMAIL,
            })}
          >
            {errors.email?.message && (
              <FormError errorMessage={errors.email.message} />
            )}
            {errors.email?.type === 'pattern' && (
              <FormError errorMessage={'Email형식으로 입력하세요'} />
            )}
          </Input>
          <Input
            name="name"
            label={'이름'}
            register={register('name', {
              required: '이름을 입력하세요',
              maxLength: { value: 30, message: '최대 30자 입니다' },
            })}
            type="text"
            placeholder="Name"
          >
            {errors.name?.message && (
              <FormError errorMessage={errors.name.message} />
            )}
          </Input>
          <Input
            type="password"
            placeholder="Password"
            name="password"
            label="비밀번호"
            register={register('password', {
              required: '비밀번호를 입력하세요',
            })}
          >
            {errors.password?.message && (
              <FormError errorMessage={errors.password.message} />
            )}
          </Input>
          <Button
            type="submit"
            canClick={isValid}
            loading={loading}
            textContents="저장하기"
          />
        </form>
      </div>
    </>
  );
};
