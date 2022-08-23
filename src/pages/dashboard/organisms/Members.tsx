import { useAcceptInvitationMutation } from '../../../graphql/generated/graphql';
import { cls } from '../../../utils/utils';
import { DashboardSectionLayout } from '../components/DashboardSectionLayout';
import useStore from '../../../hooks/useStore';
import { useMe } from '../../../hooks/useMe';

export const Members = () => {
  const { data } = useMe();
  const { selectedInfo } = useStore();
  const [acceptInvitation] = useAcceptInvitationMutation();

  function onClick() {
    if (confirm('초대를 수락합니다')) {
      acceptInvitation({
        variables: {
          input: {
            clinicId: selectedInfo.clinic?.id ?? 0,
          },
        },
      });
    }
  }

  return (
    <DashboardSectionLayout
      title="구성원"
      heightFull
      width="md"
      children={
        <>
          <div className="grid grid-cols-[2.4rem_1fr_4rem_4rem] gap-3 border-b">
            <span className="">권한</span>
            <span className="">이름</span>
            <span className=""></span>
            <span className="text-center">상태</span>
          </div>
          <ul className="space-y-2">
            {selectedInfo.clinic?.members?.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-[2.4rem_1fr_4.2rem_4rem] items-center gap-3 "
              >
                <span className="inline-block w-10 ">
                  {member.manager ? '관리자' : '회원'}
                </span>
                <span
                  className={cls(
                    'py-1',
                    data?.me.id === member.user.id ? 'font-bold' : ''
                  )}
                >
                  {member.user.name}
                </span>
                <div className="mx-auto">
                  {!member.staying &&
                    !member.accepted &&
                    data?.me.id === member.user.id && (
                      <button
                        className="btn rounded-md bg-blue-500/90 py-1 px-2 text-white hover:bg-blue-800"
                        type="button"
                        onClick={onClick}
                      >
                        수락하기
                      </button>
                    )}
                </div>
                {!member.staying && !member.accepted && (
                  <span className="text-center text-red-500">승인대기</span>
                )}
                {member.staying && member.accepted && ''}
                {!member.staying && member.accepted && '떠난 회원'}
              </div>
            ))}
          </ul>
        </>
      }
    />
  );
};
