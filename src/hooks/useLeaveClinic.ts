import { useMutation } from '@apollo/client';
import { FIND_MY_CLINICS_DOCUMENT, LEAVE_CLINIC_DOCUMENT } from '../graphql';
import { toastVar } from '../store';
import { client } from '../apollo';
import type {
  LeaveClinicMutation,
  LeaveClinicMutationVariables,
} from '../types/generated.types';

export const useLeaveClinic = ({ memberId }: { memberId: number }) => {
  const [leaveInvitationMutation] = useMutation<
    LeaveClinicMutation,
    LeaveClinicMutationVariables
  >(LEAVE_CLINIC_DOCUMENT);

  const leaveClinic = () => {
    leaveInvitationMutation({
      variables: { input: { memberId } },
      onCompleted(data) {
        if (data.leaveClinic.error)
          return toastVar({
            messages: ['초대 거절 중에 에러 발생', data.leaveClinic.error],
          });

        // TODO: 캐시 업데이트
        if (data.leaveClinic.ok) {
          alert('삭제 완료');
          client.refetchQueries({ include: [FIND_MY_CLINICS_DOCUMENT] });
          return;
        }
        alert('삭제 실패');
      },
    });
  };

  return { leaveClinic };
};
