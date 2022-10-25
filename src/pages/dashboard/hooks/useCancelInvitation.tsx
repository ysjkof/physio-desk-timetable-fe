import { useMutation } from '@apollo/client';
import { client } from '../../../apollo';
import {
  CANCEL_INVITATION_DOCUMENT,
  FIND_MY_CLINICS_DOCUMENT,
} from '../../../graphql';
import type { CancelInvitationMutation } from '../../../models/generated.models';

export default function useCancelInvitation() {
  const [cancelInvitationMutation, { loading }] =
    useMutation<CancelInvitationMutation>(CANCEL_INVITATION_DOCUMENT);
  /**
   * @param {number} id member id
   */
  const invokeCancelInvitation = (id: number, manager?: boolean) => {
    if (confirm('정말 초대를 취소 하겠습니까?')) {
      cancelInvitationMutation({
        variables: {
          input: {
            id,
            manager,
          },
        },
        onCompleted(data) {
          if (data.cancelInvitation.ok) {
            alert('삭제 완료');
            client.refetchQueries({ include: [FIND_MY_CLINICS_DOCUMENT] });
            return;
          }
          alert('삭제 실패');
        },
      });
    }
  };

  return { invokeCancelInvitation, loading };
}
