import {
  FindMyClinicsDocument,
  useAcceptInvitationMutation,
  useCancelInvitationMutation,
} from '../../../../graphql/generated/graphql';
import { cls } from '../../../../utils/utils';
import { DashboardSectionLayout } from '../template/DashboardSectionLayout';
import useStore from '../../../../hooks/useStore';
import { useMe } from '../../../../hooks/useMe';
import { Button } from '../../../../components/molecules/Button';
import { client } from '../../../../apollo';

export const Members = () => {
  const { data } = useMe();
  const { selectedInfo } = useStore();

  const [cancelInvitation] = useCancelInvitationMutation();
  const invokeCancelInvitation = (id: number) => {
    if (confirm('정말 초대를 취소 하겠습니까?')) {
      cancelInvitation({
        variables: {
          input: {
            id,
          },
        },
        onCompleted(data) {
          if (data.cancelInvitation.ok) {
            alert('삭제 완료');
            client.refetchQueries({ include: [FindMyClinicsDocument] });
            return;
          }
          alert('삭제 실패');
        },
      });
    }
  };
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
                className="grid grid-cols-[2.4rem_1fr_4rem_4rem] items-center gap-3 "
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
                {!member.staying && !member.accepted && (
                  <>
                    <Button
                      loading={false}
                      canClick
                      isSmall
                      onClick={() => invokeCancelInvitation(member.id)}
                    >
                      초대 취소
                    </Button>
                    <span className="text-center text-red-500">승인대기</span>
                  </>
                )}
                {!member.staying && member.accepted && (
                  <>
                    <span />
                    <span className="text-center text-red-500">떠난 회원</span>
                  </>
                )}
              </div>
            ))}
          </ul>
        </>
      }
    />
  );
};
