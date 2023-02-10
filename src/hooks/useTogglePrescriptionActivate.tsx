import { useMutation } from '@apollo/client';
import {
  EDIT_PRESCRIPTION_DOCUMENT,
  FIND_PRESCRIPTIONS_DOCUMENT,
} from '../graphql';
import { toastVar } from '../store';
import { ClinicsOfClient } from '../models';
import type {
  EditPrescriptionMutation,
  EditPrescriptionMutationVariables,
  FindPrescriptionsQuery,
  FindPrescriptionsQueryVariables,
} from '../types/generated.types';
import { changeValueInArray } from '../utils/common.utils';

export const useTogglePrescriptionActivate = () => {
  const [callMutation] = useMutation<
    EditPrescriptionMutation,
    EditPrescriptionMutationVariables
  >(EDIT_PRESCRIPTION_DOCUMENT);

  const toggleActivation = (id: number, activate: boolean) => {
    const inputActivate = !activate;
    const variables = { input: { id, activate: inputActivate } };
    callMutation({
      variables,
      onCompleted(data, clientOptions) {
        const { error } = data.editPrescription;
        if (error) return toastVar({ messages: [error] });

        const clinicId = ClinicsOfClient.getSelectedClinic().id;
        const variables: FindPrescriptionsQueryVariables = {
          input: { clinicId, onlyLookUpActive: false },
        };

        clientOptions?.client?.cache.updateQuery<FindPrescriptionsQuery>(
          { query: FIND_PRESCRIPTIONS_DOCUMENT, variables },
          (cacheData) => {
            const prescriptions = cacheData?.findPrescriptions.prescriptions;
            if (!prescriptions) return cacheData;

            const index = prescriptions.findIndex(
              (prescription) => prescription.id === id
            );
            if (index === -1) return cacheData;

            const updatedPrescription = {
              ...prescriptions[index],
              activate: inputActivate,
            };

            const newData = structuredClone(cacheData);
            newData.findPrescriptions.prescriptions = changeValueInArray(
              prescriptions,
              updatedPrescription,
              index
            );

            return newData;
          }
        );
        // client.cache.updateQuery<FindPrescriptionsQuery>(
        //   { query: FIND_PRESCRIPTIONS_DOCUMENT, variables },
        //   (cacheData) => {
        //     const prescriptions = cacheData?.findPrescriptions.prescriptions;
        //     if (!prescriptions) return cacheData;

        //     const index = prescriptions.findIndex(
        //       (prescription) => prescription.id === id
        //     );
        //     if (index === -1) return cacheData;

        //     const updatedPrescription = {
        //       ...prescriptions[index],
        //       activate: inputActivate,
        //     };

        //     const newData = structuredClone(cacheData);
        //     newData.findPrescriptions.prescriptions = changeValueInArray(
        //       prescriptions,
        //       updatedPrescription,
        //       index
        //     );

        //     return newData;
        //   }
        // );
      },
    });
  };

  return { toggleActivation };
};
