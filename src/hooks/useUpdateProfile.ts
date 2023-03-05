import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE_DOCUMENT } from '../graphql';
import { setToast } from '../store';
import {
  cacheUpdatePersonalClinicName,
  cacheUpdateUserName,
} from '../utils/apolloUtils';
import {
  ClinicType,
  type UpdateProfileMutation,
  type UpdateProfileMutationVariables,
} from '../types/generatedTypes';
import { useMe } from './useMe';

interface Input {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const useUpdateProfile = () => {
  const [meData] = useMe();

  return useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(
    UPDATE_PROFILE_DOCUMENT,
    {
      onCompleted(data, clientOptions) {
        const { error } = data.updateProfile;
        if (error) {
          return setToast({ messages: [error] });
        }
        if (!meData) throw new Error('meData가 없습니다');

        const profileInput: Input = clientOptions?.variables?.input;
        const newName = profileInput.name;

        setToast({ messages: ['사용자 정보 수정완료'] });

        const prevName = meData.name;
        if (!newName || prevName === newName) return;

        const personalClinic = meData.members?.find(
          (member) => member.clinic.type === ClinicType.Personal
        )?.clinic;
        if (!personalClinic)
          return setToast({
            messages: ['meData에서 개인용 병원을 찾지 못했습니다'],
          });

        cacheUpdateUserName(meData.id, newName);
        cacheUpdatePersonalClinicName({
          userName: newName,
          clinicId: personalClinic.id,
          clinicName: personalClinic.name,
        });
      },
    }
  );
};
