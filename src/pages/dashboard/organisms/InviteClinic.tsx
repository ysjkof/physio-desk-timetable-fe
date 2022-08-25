import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { Loading } from '../../../components/atoms/Loading';
import { Worning } from '../../../components/atoms/Warning';
import {
  FindMyClinicsDocument,
  SearchUsersInput,
  useInviteUserMutation,
} from '../../../graphql/generated/graphql';
import { cls } from '../../../utils/utils';
import { DashboardSectionLayout } from '../components/DashboardSectionLayout';
import useStore from '../../../hooks/useStore';
import { client } from '../../../apollo';
import { useState } from 'react';

export const InviteClinic = () => {
  const { selectedInfo } = useStore();
  const [okMessage, setOkMessage] = useState('');

  const { register, handleSubmit, getValues } = useForm<SearchUsersInput>({
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
            setOkMessage('초대 완료');
            // 할일: 리페치 없애고 캐시로 목표만 수정
            client.refetchQueries({ include: [FindMyClinicsDocument] });
          }
        },
      });
    }
  };

  return selectedInfo.clinic ? (
    selectedInfo.clinic.isStayed && selectedInfo.clinic.isManager ? (
      <>
        <DashboardSectionLayout width="md" title="병원에 초대" heightFull>
          <form onSubmit={handleSubmit(inviteUser)}>
            <div className="relative flex items-center shadow-sm">
              <input
                {...register('name', {
                  required: 'Username is required',
                })}
                id="search-user"
                required
                type="text"
                placeholder="사용자 검색"
                className={cls('input py-1')}
                autoComplete="off"
              />
              <label
                htmlFor="icon-search"
                className="absolute right-0 mr-4 cursor-pointer"
              >
                <input
                  id="icon-search"
                  type="submit"
                  value={''}
                  tabIndex={-1}
                  className="absolute"
                />
                <FontAwesomeIcon icon={faSearch} />
              </label>
            </div>
            {(data?.inviteUser.error || okMessage) && (
              <Worning>{data?.inviteUser.error || okMessage}</Worning>
            )}
          </form>
        </DashboardSectionLayout>
      </>
    ) : (
      <Worning type="hasNotPermission" />
    )
  ) : (
    <Loading />
  );
};
