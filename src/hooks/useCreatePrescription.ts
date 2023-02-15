import { useMutation } from '@apollo/client';
import {
  CREATE_PRESCRIPTION_DOCUMENT,
  FIND_PRESCRIPTIONS_DOCUMENT,
} from '../graphql';
import { setToast, useStore } from '../store';
import type {
  CreatePrescriptionMutation,
  CreatePrescriptionMutationVariables,
  FindPrescriptionsQuery,
} from '../types/generatedTypes';
import type { PrescriptionForFind } from '../types/processedGeneratedTypes';

export const useCreatePrescription = () => {
  const clinicId = useStore((state) => state.pickedClinicId);

  const variables = { input: { clinicId, onlyLookUpActive: false } };

  const getCombinedData = (
    cacheData: FindPrescriptionsQuery,
    newPrescription: PrescriptionForFind
  ) => {
    const newData = structuredClone(cacheData);
    newData.findPrescriptions.prescriptions?.push(newPrescription);
    return newData;
  };

  return useMutation<
    CreatePrescriptionMutation,
    CreatePrescriptionMutationVariables
  >(CREATE_PRESCRIPTION_DOCUMENT, {
    onCompleted: (data, clientOptions) => {
      const { error, prescription } = data.createPrescription;
      if (error) return setToast({ messages: [error] });
      if (!prescription)
        return setToast({
          messages: ['처방을 등록했지만 반환된 처방이 없습니다.'],
        });

      clientOptions?.client?.cache.updateQuery<FindPrescriptionsQuery>(
        { query: FIND_PRESCRIPTIONS_DOCUMENT, variables },
        (cacheData) => {
          if (!cacheData?.findPrescriptions.prescriptions) return cacheData;
          return getCombinedData(cacheData, prescription);
        }
      );
    },
  });
};
