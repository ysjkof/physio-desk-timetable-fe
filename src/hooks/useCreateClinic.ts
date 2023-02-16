import { useMutation } from '@apollo/client';
import { CREATE_CLINIC_DOCUMENT } from '../graphql';
import { setAlert } from '../store';
import {
  cacheAddClinicToMyClinics,
  cacheUpdateMemberOfMe,
} from '../utils/apolloUtils';
import type {
  CreateClinicMutation,
  CreateClinicMutationVariables,
} from '../types/generatedTypes';

export const useCreateClinic = () => {
  return useMutation<CreateClinicMutation, CreateClinicMutationVariables>(
    CREATE_CLINIC_DOCUMENT,
    {
      onCompleted(data) {
        const { error, clinic } = data.createClinic;
        if (error) {
          return setAlert({ messages: [error] });
        }
        if (!clinic) {
          return setAlert({
            messages: ['병원 만들기 후 병원을 반환받지 못했습니다.'],
          });
        }

        setAlert({
          messages: [`병원 "${clinic.name}"을 만들었습니다`],
          isPositive: true,
        });

        cacheAddClinicToMyClinics(clinic);
        cacheUpdateMemberOfMe(clinic);
      },
    }
  );
};
