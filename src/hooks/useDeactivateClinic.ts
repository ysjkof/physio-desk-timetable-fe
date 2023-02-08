import { useMutation } from '@apollo/client';
import {
  DEACTIVATE_CLINIC_DOCUMENT,
  FIND_MY_CLINICS_DOCUMENT,
} from '../graphql';
import { toastVar } from '../store';
import { client } from '../apollo';
import {
  DeactivateClinicMutation,
  DeactivateClinicMutationVariables,
} from '../types/generated.types';

export const useDeactivateClinic = ({ clinicId }: { clinicId: number }) => {
  const [deactivateClinicMutation] = useMutation<
    DeactivateClinicMutation,
    DeactivateClinicMutationVariables
  >(DEACTIVATE_CLINIC_DOCUMENT);

  const deactivateClinic = () => {
    deactivateClinicMutation({
      variables: { input: { clinicId } },
      onCompleted(data) {
        if (data.deactivateClinic.error)
          return toastVar({ messages: [data.deactivateClinic.error] });

        client.refetchQueries({ include: [FIND_MY_CLINICS_DOCUMENT] });
        toastVar({
          messages: [`병원이 폐쇄됐습니다`],
          fade: true,
          bgColor: true,
        });
      },
    });
  };

  return { deactivateClinic };
};
