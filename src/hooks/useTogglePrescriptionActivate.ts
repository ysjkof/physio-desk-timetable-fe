import { useMutation } from '@apollo/client';
import { UPDATE_PRESCRIPTION_DOCUMENT } from '../graphql';
import { setToast } from '../store';
import { cacheUpdatePrescription } from '../utils/apolloUtils';
import type {
  UpdatePrescriptionMutation,
  UpdatePrescriptionMutationVariables,
} from '../types/generatedTypes';

export const useTogglePrescriptionActivate = () => {
  const [callMutation] = useMutation<
    UpdatePrescriptionMutation,
    UpdatePrescriptionMutationVariables
  >(UPDATE_PRESCRIPTION_DOCUMENT);

  const toggleActivation = (id: number, activate: boolean) => {
    const inputActivate = !activate;
    const variables = { input: { id, activate: inputActivate } };
    callMutation({
      variables,
      onCompleted(data) {
        const { error } = data.updatePrescription;
        if (error) return setToast({ messages: [error] });

        cacheUpdatePrescription(id, { activate: inputActivate });
      },
    });
  };

  return { toggleActivation };
};
