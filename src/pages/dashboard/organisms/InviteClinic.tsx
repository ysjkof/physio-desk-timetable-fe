import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { Loading } from '../../../components/atoms/Loading';
import { Worning } from '../../../components/atoms/Warning';
import {
  SearchUsersInput,
  useInviteUserMutation,
} from '../../../graphql/generated/graphql';
import { cls } from '../../../utils/utils';
import { DashboardSectionLayout } from '../components/DashboardSectionLayout';
import useStore from '../../../hooks/useStore';

export const InviteClinic = () => {
  const { selectedInfo } = useStore();

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
      });
    }
  };

  return selectedInfo.clinic ? (
    selectedInfo.clinic.isStayed && selectedInfo.clinic.isManager ? (
      <DashboardSectionLayout
        width="md"
        title="병원에 초대"
        heightFull
        children={
          <>
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
            </form>
            {data?.inviteUser.error && (
              <p className="py-10 text-center font-semibold">
                {data?.inviteUser.error}
              </p>
            )}
          </>
        }
      />
    ) : (
      <Worning type="hasNotPermission" />
    )
  ) : (
    <Loading />
  );
};
