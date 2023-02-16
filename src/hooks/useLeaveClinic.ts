import { useMutation } from '@apollo/client';
import {
  FIND_MY_CLINICS_DOCUMENT,
  FIND_MY_MEMBERS_DOCUMENT,
  LEAVE_CLINIC_DOCUMENT,
} from '../graphql';
import { setAlert, setToast } from '../store';
import { client } from '../apollo';
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

        // TODO: 캐시 업데이트
        if (ok) {
          client?.refetchQueries({
            include: [FIND_MY_CLINICS_DOCUMENT, FIND_MY_MEMBERS_DOCUMENT],
          });
          return setAlert({
            messages: ['병원에서 탈퇴했습니다'],
            isPositive: true,
          });
        }
        setAlert({ messages: ['병원 탈퇴를 실패했습니다'] });
      },
    });
  };

  return { leaveClinic };
};
