import { useMutation } from '@apollo/client';
import { ACCEPT_INVITATION_DOCUMENT } from '../graphql';
import { setAlert } from '../store';
import { cacheUpdateMemberAccepted } from '../utils/apolloUtils';
import type {
  AcceptInvitationMutation,
  AcceptInvitationMutationVariables,
} from '../types/generatedTypes';

export const useAcceptInvitation = ({ memberId }: { memberId: number }) => {
  const [acceptInvitationMutation] = useMutation<
    AcceptInvitationMutation,
    AcceptInvitationMutationVariables
  >(ACCEPT_INVITATION_DOCUMENT);

  const acceptInvitation = () => {
    acceptInvitationMutation({
      variables: { input: { memberId } },
      onCompleted(data) {
        const { error, ok } = data.acceptInvitation;
        if (error) return setAlert({ messages: [`오류: ${error}`] });

        if (ok) {
          cacheUpdateMemberAccepted(memberId);
          return setAlert({
            messages: ['초대를 수락했습니다'],
            isPositive: true,
          });
        }

        setAlert({
          messages: ['초대 수락을 실패했습니다'],
        });
      },
    });
  };

  return { acceptInvitation };
};
