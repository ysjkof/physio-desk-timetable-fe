import { client } from '../../../apollo';
import {
  FindMyClinicsDocument,
  useCancelInvitationMutation,
} from '../../../graphql/generated/graphql';

export default function useCancelInvitation() {
  const [cancelInvitation, { loading }] = useCancelInvitationMutation();
  /**
   * @param {number} id member id
   */
  const invokeCancelInvitation = (id: number, manager?: boolean) => {
    if (confirm('정말 초대를 취소 하겠습니까?')) {
      cancelInvitation({
        variables: {
          input: {
            id,
            manager,
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

  return { invokeCancelInvitation, loading };
}
