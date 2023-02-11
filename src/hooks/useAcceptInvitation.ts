import { useMutation } from '@apollo/client';
import { ACCEPT_INVITATION_DOCUMENT } from '../graphql';
import { setToast, useStore } from '../store';
import { cacheUpdateMemberAccepted } from '../utils/apolloCache.utils';
import type {
  AcceptInvitationMutation,
  AcceptInvitationMutationVariables,
} from '../types/generated.types';

export const useAcceptInvitation = ({ memberId }: { memberId: number }) => {
  const [acceptInvitationMutation] = useMutation<
    AcceptInvitationMutation,
    AcceptInvitationMutationVariables
  >(ACCEPT_INVITATION_DOCUMENT);

  const client = useStore((state) => state.client);

  const acceptInvitation = () => {
    acceptInvitationMutation({
      variables: { input: { memberId } },
      onCompleted(data) {
        if (data.acceptInvitation.error)
          return setToast({ messages: ['병원 초대 수락 중 에러 발생'] });
        if (data.acceptInvitation.ok) {
          setToast({ messages: ['병원 초대를 수락했습니다'] });
          cacheUpdateMemberAccepted(client, memberId);
        }
      },
    });
  };

  return { acceptInvitation };
};
