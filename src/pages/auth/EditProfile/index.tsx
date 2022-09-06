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
import { toastVar } from '../../../store';

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

      toastVar({ messages: ['사용자 정보 수정완료'], fade: true });

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
          ...(email && prevEmail !== email && { email }),
          ...(name && prevName !== name && { name: name.trim() }),
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
            id="email"
            label={'Email'}
            register={register('email', {
              required: 'Email을 입력하세요',
              pattern: REG_EXP.email.pattern,
            })}
          >
            {errors.email?.message && (
              <FormError errorMessage={errors.email.message} />
            )}
            {errors.email?.type === 'pattern' && (
              <FormError errorMessage={REG_EXP.email.condition} />
            )}
          </Input>
          <Input
            id="name"
            label={'이름'}
            register={register('name', {
              required: '이름을 입력하세요',
              pattern: REG_EXP.personName.pattern,
            })}
            type="text"
            placeholder="Name"
          >
            {errors.name?.message && (
              <FormError errorMessage={errors.name.message} />
            )}
            {errors.name?.type === 'pattern' && (
              <FormError errorMessage={REG_EXP.personName.condition} />
            )}
          </Input>
          <Input
            id="password"
            label="비밀번호"
            type="password"
            placeholder="Password"
            register={register('password', {
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
            저장하기
          </Button>
        </form>
      </div>
    </>
  );
};
