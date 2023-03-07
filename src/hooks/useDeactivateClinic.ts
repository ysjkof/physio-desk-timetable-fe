import { useMutation } from '@apollo/client';
import {
  DEACTIVATE_CLINIC_DOCUMENT,
  GET_MY_MEMBERS_DOCUMENT,
} from '../graphql';
import { setAlert } from '../store';
import { client } from '../apollo';
import type {
  DeactivateClinicMutation,
  DeactivateClinicMutationVariables,
} from '../types/generatedTypes';

export const useDeactivateClinic = ({ clinicId }: { clinicId: number }) => {
  const [deactivateClinicMutation] = useMutation<
    DeactivateClinicMutation,
    DeactivateClinicMutationVariables
  >(DEACTIVATE_CLINIC_DOCUMENT);

  const deactivateClinic = () => {
    deactivateClinicMutation({
      variables: { input: { clinicId } },
      onCompleted(data) {
        const { error, ok } = data.deactivateClinic;
        if (error) return setAlert({ messages: [`오류: ${error}`] });

        if (ok) {
          client?.refetchQueries({
            include: [GET_MY_MEMBERS_DOCUMENT],
          });
          return setAlert({
            messages: [`병원이 폐쇄됐습니다`],
            isPositive: true,
          });
        }

        setAlert({ messages: ['병원 폐쇄를 실패했습니다'] });
      },
    });
  };

  return { deactivateClinic };
};
