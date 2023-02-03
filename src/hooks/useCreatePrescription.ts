import { useMutation } from '@apollo/client';
import {
  CREATE_PRESCRIPTION_DOCUMENT,
  FIND_PRESCRIPTIONS_DOCUMENT,
} from '../graphql';
import { toastVar } from '../store';
import { ClinicsOfClient } from '../models';
import { client } from '../apollo';
import type {
  CreatePrescriptionMutation,
  CreatePrescriptionMutationVariables,
  FindPrescriptionsQuery,
} from '../types/generated.types';
import type { PrescriptionForFind } from '../types/props.types';

export const useCreatePrescription = () => {
  const clinicId = ClinicsOfClient.getSelectedClinic().id;
  const variables = {
    input: { clinicId, onlyLookUpActive: false },
  };

  const getCombinedData = (
    cacheData: FindPrescriptionsQuery,
    newPrescription: PrescriptionForFind
  ) => {
    const newData = { ...cacheData };
    newData.findPrescriptions.prescriptions?.push(newPrescription);
    return newData;
  };

  return useMutation<
    CreatePrescriptionMutation,
    CreatePrescriptionMutationVariables
  >(CREATE_PRESCRIPTION_DOCUMENT, {
    onCompleted: (data) => {
      const { error, prescription } = data.createPrescription;

      if (error) return toastVar({ messages: [error] });
      if (!prescription)
        return toastVar({
          messages: ['처방을 등록했지만 반환된 처방이 없습니다.'],
        });

      client.cache.updateQuery<FindPrescriptionsQuery>(
        { query: FIND_PRESCRIPTIONS_DOCUMENT, variables },
        (cacheData) => {
          if (!cacheData?.findPrescriptions.prescriptions) return cacheData;
          return getCombinedData(cacheData, prescription);
        }
      );
    },
  });
};
