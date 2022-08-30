import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { Loading } from '../../../components/atoms/Loading';
import { Worning } from '../../../components/atoms/Warning';
import { Input } from '../../../components/molecules/Input';
import {
  ClinicType,
  FindMyClinicsDocument,
  SearchUsersInput,
  useInviteUserMutation,
} from '../../../graphql/generated/graphql';
import { DashboardSectionLayout } from '../components/DashboardSectionLayout';
import useStore from '../../../hooks/useStore';
import { client } from '../../../apollo';
import { useState } from 'react';
import { REG_EXP } from '../../../constants/regex';
import { FormError } from '../../../components/atoms/FormError';
import { toastVar } from '../../../store';

export const InviteClinic = () => {
  const { selectedInfo } = useStore();
  const [okMessage, setOkMessage] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SearchUsersInput>({
    mode: 'onChange',
  });

  const [inviteUserMutation, { loading: inviteUserLoading, data }] =
    useInviteUserMutation();

  const inviteUser = () => {
    if (inviteUserLoading) return;
    if (!selectedInfo.clinic) throw new Error('병원이 선택되지 않았습니다');

    const { name } = getValues();

    if (confirm(`${name}을(를) 그룹에 초대합니까?`)) {
      inviteUserMutation({
        variables: { input: { clinicId: selectedInfo.clinic.id, name } },
        onCompleted(data) {
          if (data.inviteUser.ok) {
            setOkMessage(
              `"${
                selectedInfo.clinic?.name || '병원'
              }"에 "${name}"님을 초대했습니다`
            );
            client.refetchQueries({ include: [FindMyClinicsDocument] });
          }
        },
      });
    }
  };

  if (!selectedInfo.clinic) return <Loading />;
  if (selectedInfo.clinic && selectedInfo.clinic.type === ClinicType.Personal)
    return (
      <Worning>
        {
          '개인용 병원에는 사용자를 초대할 수 없습니다. 왼쪽 위쪽에 화살표 버튼으로 다른 병원을 선택하세요'
        }
      </Worning>
    );
  if (selectedInfo.clinic.isStayed && selectedInfo.clinic.isManager)
    return (
      <DashboardSectionLayout width="md" title="병원에 초대" heightFull>
        <form onSubmit={handleSubmit(inviteUser)}>
          <div className="relative flex items-center shadow-sm">
            <Input
              id="search-user"
              label={'이름*'}
              required
              placeholder="사용자 검색"
              type="text"
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
              <button className="absolute bottom-2.5 right-2" tabIndex={-1}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </Input>
          </div>
          {(data?.inviteUser.error || okMessage) && (
            <Worning>{data?.inviteUser.error || okMessage}</Worning>
          )}
        </form>
      </DashboardSectionLayout>
    );

  return <Worning type="hasNotPermission" />;
};
