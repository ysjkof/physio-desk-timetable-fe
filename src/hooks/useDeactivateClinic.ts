import { useMutation } from '@apollo/client';
import {
  DEACTIVATE_CLINIC_DOCUMENT,
  FIND_MY_CLINICS_DOCUMENT,
} from '../graphql';
import { setToast } from '../store';
import {
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
      onCompleted(data, clientOptions) {
        if (data.deactivateClinic.error)
          return setToast({ messages: [data.deactivateClinic.error] });

        clientOptions?.client?.refetchQueries({
          include: [FIND_MY_CLINICS_DOCUMENT],
        });
        // client.refetchQueries({ include: [FIND_MY_CLINICS_DOCUMENT] });
        setToast({
          messages: [`병원이 폐쇄됐습니다`],
        });
      },
    });
  };

  return { deactivateClinic };
};
