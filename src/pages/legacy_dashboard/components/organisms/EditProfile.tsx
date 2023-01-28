import { gql, useApolloClient, useMutation } from '@apollo/client';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import FormError from '../../../../_legacy_components/atoms/FormError';
import Button from '../../../../_legacy_components/molecules/Button';
import Input from '../../../../_legacy_components/molecules/Input';
import { MUOOL } from '../../../../constants/constants';
import { REG_EXP } from '../../../../constants/regex';
import { useMe } from '../../../../hooks';
import { toastVar } from '../../../../store';
import FormSection from '../molecules/FormSection';
import EditEmail from './EditEmail';
import type {
  EditProfileInput,
  EditProfileMutation,
} from '../../../../types/generated.types';
import { EDIT_PROFILE_DOCUMENT } from '../../../../graphql';

export default function EditProfile() {
  const [isEditEmail, setIsEditEmail] = useState(false);
  const { data: userData } = useMe();
  const client = useApolloClient();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<Omit<EditProfileInput, 'email'>>({
    mode: 'onChange',
    defaultValues: {
      name: userData?.me.name,
    },
  });

  const [editProfile, { loading }] = useMutation<EditProfileMutation>(
    EDIT_PROFILE_DOCUMENT
  );

  const onSubmit = () => {
    if (!userData) throw new Error('사용자 정보가 없습니다');
    const prevName = userData.me.name;
    const { name, password } = getValues();

    if (prevName === name && password === '') return;

    editProfile({
      variables: {
        input: {
          ...(name && prevName !== name && { name: name.trim() }),
          ...(password !== '' && { password }),
        },
      },
      onCompleted(data) {
        const { ok, error } = data.editProfile;
        if (error) {
          return toastVar({ messages: [error] });
        }
        if (ok && userData) {
          toastVar({ messages: ['사용자 정보 수정완료'], fade: true });
          const { name: freshName, id } = userData.me;

          const { name: nameOfForm } = getValues();
          if (freshName === nameOfForm) return;

          client.writeFragment({
            id: `User:${id}`,
            fragment: gql`
              fragment NameFields on User {
                name
              }
            `,
            data: {
              ...(freshName !== nameOfForm && {
                name: nameOfForm,
              }),
            },
          });
        }
      },
    });
  };

  const openEditEmail = () => setIsEditEmail((prev) => !prev);
  return (
    <>
      <Helmet>
        <title>Edit Profile | {MUOOL}</title>
      </Helmet>
      <FormSection>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 w-full max-w-sm space-y-6"
        >
          <div className="relative flex w-full flex-col gap-2">
            Email
            <span className="mt-4 overflow-hidden text-ellipsis px-2 text-sm font-medium">
              {userData?.me.email}
            </span>
          </div>
          <Button isWidthFull canClick loading={false} onClick={openEditEmail}>
            {isEditEmail ? '닫기' : '이메일 바꾸기'}
          </Button>
          {isEditEmail ? <EditEmail /> : ''}
          <Input
            id="edit-profile__name"
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
            id="edit-profile__password"
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
          <Button
            type="submit"
            isWidthFull
            canClick={isValid}
            loading={loading}
          >
            저장하기
          </Button>
        </form>
      </FormSection>
    </>
  );
}
