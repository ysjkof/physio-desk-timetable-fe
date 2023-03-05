import { useMutation } from '@apollo/client';
import {
  GET_MY_CLINICS_DOCUMENT,
  REFUSE_INVITATION_DOCUMENT,
} from '../graphql';
import { setToast } from '../store';
import { client } from '../apollo';
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
        if (data.refuseInvitation.error)
          return setToast({
            messages: ['초대 거절 중에 에러 발생', data.refuseInvitation.error],
          });

        // TODO: 리페치를 캐시 업데이트로
        if (data.refuseInvitation.ok) {
          alert('삭제 완료');
          client?.refetchQueries({
            include: [GET_MY_CLINICS_DOCUMENT],
          });
          return;
        }
        alert('삭제 실패');
      },
    });
  };

  return { refuseInvitation };
};
