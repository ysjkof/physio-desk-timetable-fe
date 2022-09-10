import { checkManager, getMemberState } from '../../../../utils/utils';
import useStore from '../../../../hooks/useStore';
import useCancelInvitation from '../../hooks/useCancelInvitation';
import { loggedInUserVar } from '../../../../store';
import UserCard from '../molecules/UserCard';

export const Members = () => {
  const loggedInUser = loggedInUserVar();
  const { selectedInfo } = useStore();
  const { invokeCancelInvitation, loading: loadingCancel } =
    useCancelInvitation();

  const isManager = checkManager(
    selectedInfo.clinic?.members!,
    loggedInUser!.id
  );

  return (
    <section className="px-10 py-8">
      <UserCard.Container>
        {selectedInfo.clinic?.members?.map((member) => {
          const state = getMemberState(
            member.staying,
            member.accepted,
            member.manager
          );
          return (
            <UserCard
              key={member.user.id}
              name={member.user.name}
              state={state}
              button={
                state === '승인대기' &&
                isManager && (
                  <UserCard.Button
                    type="button"
                    loading={loadingCancel}
                    onClick={() => invokeCancelInvitation(member.id, true)}
                  >
                    <div className="mr-2 h-5 w-5 bg-no" />
                    초대취소
                  </UserCard.Button>
                )
              }
            />
          );
        })}
      </UserCard.Container>
    </section>
  );
};
