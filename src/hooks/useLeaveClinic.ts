import { useMutation } from '@apollo/client';
import { LEAVE_CLINIC_DOCUMENT } from '../graphql';
import { setAlert, setToast } from '../store';
import { cacheUpdateMemberState } from '../utils/apolloUtils';
import type {
  LeaveClinicMutation,
  LeaveClinicMutationVariables,
} from '../types/generatedTypes';

export const useLeaveClinic = ({ memberId }: { memberId: number }) => {
  const [leaveInvitationMutation] = useMutation<
    LeaveClinicMutation,
    LeaveClinicMutationVariables
  >(LEAVE_CLINIC_DOCUMENT);

  const leaveClinic = () => {
    leaveInvitationMutation({
      variables: { input: { memberId } },
      onCompleted(data) {
        const { error, ok } = data.leaveClinic;
        if (error) return setToast({ messages: [`오류: ${error}`] });

        if (!ok) return setAlert({ messages: ['병원 탈퇴를 실패했습니다'] });

        cacheUpdateMemberState(memberId, { staying: false });

        return setAlert({
          messages: ['병원에서 탈퇴했습니다'],
          isPositive: true,
        });
      },
    });
  };

  return { leaveClinic };
};
