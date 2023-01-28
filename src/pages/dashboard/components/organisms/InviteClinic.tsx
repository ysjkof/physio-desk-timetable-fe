import { lazy, useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { client } from '../../../../apollo';
import Warning from '../../../../_legacy_components/atoms/Warning';
import Input from '../../../../_legacy_components/molecules/Input';
import { REG_EXP } from '../../../../constants/regex';
import FormError from '../../../../_legacy_components/atoms/FormError';
import FormSection from '../molecules/FormSection';
import {
  FIND_MY_CLINICS_DOCUMENT,
  INVITE_USER_DOCUMENT,
} from '../../../../graphql';
import { ClinicsOfClient } from '../../../../models';
import { clinicListsVar } from '../../../../store';
import {
  ClinicType,
  InviteUserMutation,
  SearchUsersInput,
} from '../../../../types/generated.types';

const Loading = lazy(
  () => import('../../../../_legacy_components/atoms/Loading')
);

export default function InviteClinic() {
  useReactiveVar(clinicListsVar); // ui 새로고침 용
  const [okMessage, setOkMessage] = useState('');
  const { selectedClinic } = ClinicsOfClient;

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SearchUsersInput>({
    mode: 'onChange',
  });

  const [inviteUserMutation, { loading: inviteUserLoading, data }] =
    useMutation<InviteUserMutation>(INVITE_USER_DOCUMENT);

  const inviteUser = () => {
    if (inviteUserLoading) return;
    if (!selectedClinic) throw new Error('병원이 선택되지 않았습니다');

    const { name } = getValues();

    if (confirm(`${name}을(를) ${selectedClinic.name}에 초대합니까?`)) {
      inviteUserMutation({
        variables: { input: { clinicId: selectedClinic.id, name } },
        onCompleted(data) {
          if (data.inviteUser.ok) {
            setOkMessage(
              `"${selectedClinic.name || '병원'}"에 "${name}"님을 초대했습니다`
            );
            client.refetchQueries({ include: [FIND_MY_CLINICS_DOCUMENT] });
          }
        },
      });
    }
  };

  if (!selectedClinic) return <Loading />;

  if (selectedClinic.type === ClinicType.Personal)
    return (
      <Warning>
        개인 전용 병원에는 사용자를 초대할 수 없습니다. 왼쪽 위쪽에 화살표
        버튼으로 다른 병원을 선택하세요
      </Warning>
    );

  if (!selectedClinic.isStayed || !selectedClinic.isManager)
    return <Warning type="hasNotPermission" />;

  return (
    <FormSection>
      <form onSubmit={handleSubmit(inviteUser)} className="mt-10 max-w-xs">
        <div className="relative flex items-center shadow-sm">
          <Input
            id="invite-clinic__name"
            label="이름*"
            type="text"
            required
            placeholder="사용자 검색"
            maxLength={REG_EXP.personName.maxLength}
            register={register('name', {
              required: '이름을 입력하세요',
              pattern: REG_EXP.personName.pattern,
            })}
          >
            {errors.name?.message ? (
              <FormError errorMessage={errors.name.message} />
            ) : (
              errors.name?.type === 'pattern' && (
                <FormError errorMessage={REG_EXP.personName.condition} />
              )
            )}
            <button
              className="absolute bottom-2.5 right-2"
              tabIndex={-1}
              type="button"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </Input>
        </div>
        {(data?.inviteUser.error || okMessage) && (
          <Warning>{data?.inviteUser.error || okMessage}</Warning>
        )}
      </form>
    </FormSection>
  );
}
