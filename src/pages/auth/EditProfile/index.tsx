import { gql, useApolloClient } from '@apollo/client';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { FormError } from '../../../components/atoms/FormError';
import { Button } from '../../../components/molecules/Button';
import { Input } from '../../../components/molecules/Input';
import { MUOOL } from '../../../constants/constants';
import { REG_EXP } from '../../../constants/regex';
import {
  EditProfileInput,
  EditProfileMutation,
  useEditProfileMutation,
  useSendAuthenticationEmailMutation,
} from '../../../graphql/generated/graphql';
import { useMe } from '../../../hooks/useMe';
import { toastVar } from '../../../store';

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();

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

  const [editProfile, { loading }] = useEditProfileMutation();

  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok, error },
    } = data;

    if (error) {
      return toastVar({ messages: [error] });
    }

    if (ok && userData) {
      toastVar({ messages: ['사용자 정보 수정완료'], fade: true });

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
      onCompleted,
    });
  };

  const [sendAuthEmailMutation, { loading: sendAuthEmailLoading }] =
    useSendAuthenticationEmailMutation();
  const [wasSendAuthEmail, setWasSendAuthEmail] = useState(false);

  const sendAuthEmail = () => {
    sendAuthEmailMutation({
      onCompleted(data) {
        const { ok, error } = data.sendAuthenticationEmail;
        if (ok) {
          setWasSendAuthEmail(true);
          return toastVar({
            messages: ['인증 이메일을 다시보냈습니다.'],
          });
        }

        if (error) {
          return toastVar({
            messages: [error],
          });
        }
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Edit Profile | {MUOOL}</title>
      </Helmet>
      <div className="container mx-auto h-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto grid w-full max-w-md gap-3 space-y-4 rounded-md bg-white px-4 py-8 shadow"
        >
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="Email"
            maxLength={REG_EXP.email.maxLength}
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
          {userData && !userData.me.verified && (
            <Button
              canClick={!wasSendAuthEmail}
              loading={sendAuthEmailLoading}
              onClick={sendAuthEmail}
            >
              {wasSendAuthEmail
                ? '인증 메일을 다시 보냈습니다'
                : '인증 메일 다시 보내기'}
            </Button>
          )}
          <Input
            id="name"
            label="이름"
            type="text"
            placeholder="이름"
            maxLength={REG_EXP.personName.maxLength}
            register={register('name', {
              required: '이름을 입력하세요',
              pattern: REG_EXP.personName.pattern,
            })}
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
            maxLength={REG_EXP.password.maxLength}
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
