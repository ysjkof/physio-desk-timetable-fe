import { checkManager, cls } from '../../../../utils/utils';
import { DashboardSectionLayout } from '../template/DashboardSectionLayout';
import useStore from '../../../../hooks/useStore';
import { Button } from '../../../../components/molecules/Button';
import useCancelInvitation from '../../hooks/useCancelInvitation';
import { loggedInUserVar } from '../../../../store';

export const Members = () => {
  const loggedInUser = loggedInUserVar();
  const { selectedInfo } = useStore();
  const { invokeCancelInvitation, loading: loadingCancel } =
    useCancelInvitation();

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
                    loggedInUser?.id === member.user.id ? 'font-bold' : ''
                  )}
                >
                  {member.user.name}
                </span>
                {!member.staying && !member.accepted && (
                  <>
                    {checkManager(
                      selectedInfo.clinic?.members!,
                      loggedInUser!.id
                    ) ? (
                      <Button
                        type="button"
                        loading={loadingCancel}
                        canClick={!loadingCancel}
                        isSmall
                        onClick={() => invokeCancelInvitation(member.id, true)}
                      >
                        초대 취소
                      </Button>
                    ) : (
                      <span />
                    )}
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
