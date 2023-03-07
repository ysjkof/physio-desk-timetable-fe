import { useMutation } from '@apollo/client';
import { UPDATE_PRESCRIPTION_DOCUMENT } from '../graphql';
import { setToast } from '../store';
import { cacheUpdatePrescription } from '../utils/apolloUtils';
import type {
  UpdatePrescriptionMutation,
  UpdatePrescriptionMutationVariables,
} from '../types/generatedTypes';

export const useTogglePrescriptionActivation = () => {
  const [callMutation] = useMutation<
    UpdatePrescriptionMutation,
    UpdatePrescriptionMutationVariables
  >(UPDATE_PRESCRIPTION_DOCUMENT);

  const toggleActivation = (id: number, isActive: boolean) => {
    const inputActive = !isActive;
    const variables: UpdatePrescriptionMutationVariables = {
      input: { id, isActive: inputActive },
    };

    callMutation({
      variables,
      onCompleted(data) {
        const { error } = data.updatePrescription;
        if (error) return setToast({ messages: [error] });

        cacheUpdatePrescription(id, { isActive: inputActive });
      },
    });
  };

  return { toggleActivation };
};
