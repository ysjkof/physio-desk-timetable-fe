import { useMutation } from '@apollo/client';
import { UPDATE_PRESCRIPTION_DOCUMENT } from '../graphql';
import { setToast } from '../store';
import type {
  UpdatePrescriptionMutation,
  UpdatePrescriptionMutationVariables,
} from '../types/generatedTypes';
import { cacheUpdatePrescription } from '../utils/apolloUtils';
import { UpdatePrescriptionVariables } from '../types/processedGeneratedTypes';

interface Input extends UpdatePrescriptionVariables {
  id: number;
}

export const useUpdatePrescription = () => {
  return useMutation<
    UpdatePrescriptionMutation,
    UpdatePrescriptionMutationVariables
  >(UPDATE_PRESCRIPTION_DOCUMENT, {
    onCompleted(data, clientOptions) {
      const { error } = data.updatePrescription;
      if (error) return setToast({ messages: [error] });

      const prescriptionInput: Input = clientOptions?.variables?.input;

      cacheUpdatePrescription(prescriptionInput.id, prescriptionInput);
    },
  });
};
