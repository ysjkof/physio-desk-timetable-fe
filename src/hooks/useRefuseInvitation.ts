import { useMutation } from '@apollo/client';
import { REFUSE_INVITATION_DOCUMENT } from '../graphql';
import { setAlert, setToast } from '../store';
import { cacheUpdateDeleteMemberOfGetMyMembers } from '../utils/apolloUtils';
import type {
  RefuseInvitationMutation,
  RefuseInvitationMutationVariables,
} from '../types/generatedTypes';

export const useRefuseInvitation = ({ memberId }: { memberId: number }) => {
  const [cancelInvitationMutation] = useMutation<
    RefuseInvitationMutation,
    RefuseInvitationMutationVariables
  >(REFUSE_INVITATION_DOCUMENT);

  const refuseInvitation = () => {
    cancelInvitationMutation({
      variables: { input: { memberId } },
      onCompleted(data) {
        const { error, ok } = data.refuseInvitation;
        if (error) {
          return setToast({
            messages: ['초대 거절 중에 에러 발생', error],
          });
        }

        if (!ok) return setAlert({ messages: ['삭제 실패'] });

        setAlert({ messages: ['삭제 완료'], isPositive: true });

        cacheUpdateDeleteMemberOfGetMyMembers(memberId);
      },
    });
  };

  return { refuseInvitation };
};
