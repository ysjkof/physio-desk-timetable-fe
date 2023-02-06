import { useMutation } from '@apollo/client';
import { CREATE_CLINIC_DOCUMENT } from '../graphql';
import { toastVar } from '../store';
import {
  cacheAddClinicToMyClinics,
  cacheUpdateMemberOfMe,
} from '../utils/apolloCache.utils';
import type {
  CreateClinicMutation,
  CreateClinicMutationVariables,
} from '../types/generated.types';

export const useCreateClinic = () => {
  return useMutation<CreateClinicMutation, CreateClinicMutationVariables>(
    CREATE_CLINIC_DOCUMENT,
    {
      onCompleted(data) {
        const { error, clinic } = data.createClinic;
        if (error) {
          return toastVar({ messages: [error] });
        }
        if (!clinic) {
          return toastVar({
            messages: ['병원 만들기 후 병원을 반환받지 못했습니다.'],
          });
        }

        toastVar({
          messages: [`병원 "${clinic.name}"을 만들었습니다`],
          fade: true,
        });

        cacheAddClinicToMyClinics(clinic);
        cacheUpdateMemberOfMe(clinic);
      },
    }
  );
};
