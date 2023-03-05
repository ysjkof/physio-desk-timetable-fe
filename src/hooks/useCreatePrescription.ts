import { useMutation } from '@apollo/client';
import {
  CREATE_PRESCRIPTION_DOCUMENT,
  GET_PRESCRIPTIONS_BY_CLINIC_DOCUMENT,
} from '../graphql';
import { setAlert, setToast, useStore } from '../store';
import { client } from '../apollo';
import type {
  CreatePrescriptionMutation,
  CreatePrescriptionMutationVariables,
  GetPrescriptionsByClinicQuery,
  GetPrescriptionsByClinicQueryVariables,
} from '../types/generatedTypes';
import type { PrescriptionForFind } from '../types/processedGeneratedTypes';

export const useCreatePrescription = () => {
  const id = useStore((state) => state.pickedClinicId);
  const variables: GetPrescriptionsByClinicQueryVariables = { input: { id } };

  const getCombinedData = (
    cacheData: GetPrescriptionsByClinicQuery,
    newPrescription: PrescriptionForFind
  ) => {
    const newData = structuredClone(cacheData);
    newData.getPrescriptionsByClinic.prescriptions?.push(newPrescription);
    newData.getPrescriptionsByClinic.count += 1;
    return newData;
  };

  return useMutation<
    CreatePrescriptionMutation,
    CreatePrescriptionMutationVariables
  >(CREATE_PRESCRIPTION_DOCUMENT, {
    onCompleted: (data) => {
      const { error, prescription } = data.createPrescription;
      if (error) return setAlert({ messages: [error] });
      if (!prescription)
        return setToast({
          messages: ['처방을 등록했지만 반환된 처방이 없습니다.'],
        });

      setAlert({
        messages: [`처방(${prescription.name})을 만들었습니다`],
        isPositive: true,
      });

      client?.cache.updateQuery<GetPrescriptionsByClinicQuery>(
        { query: GET_PRESCRIPTIONS_BY_CLINIC_DOCUMENT, variables },
        (cacheData) => {
          if (!cacheData?.getPrescriptionsByClinic.prescriptions)
            return cacheData;
          return getCombinedData(cacheData, prescription);
        }
      );
    },
  });
};
