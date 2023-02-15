import { useMutation } from '@apollo/client';
import { CREATE_CLINIC_DOCUMENT } from '../graphql';
import { setAlert, setToast, useStore } from '../store';
import {
  cacheAddClinicToMyClinics,
  cacheUpdateMemberOfMe,
} from '../utils/apolloUtils';
import type {
  CreateClinicMutation,
  CreateClinicMutationVariables,
} from '../types/generatedTypes';

export const useCreateClinic = () => {
  const client = useStore((state) => state.client);
  return useMutation<CreateClinicMutation, CreateClinicMutationVariables>(
    CREATE_CLINIC_DOCUMENT,
    {
      onCompleted(data) {
        const { error, clinic } = data.createClinic;
        if (error) {
          return setAlert({ messages: [error] });
        }
        if (!clinic) {
          return setToast({
            messages: ['병원 만들기 후 병원을 반환받지 못했습니다.'],
          });
        }

        setToast({
          messages: [`병원 "${clinic.name}"을 만들었습니다`],
        });

        cacheAddClinicToMyClinics(client, clinic);
        cacheUpdateMemberOfMe(client, clinic);
      },
    }
  );
};
