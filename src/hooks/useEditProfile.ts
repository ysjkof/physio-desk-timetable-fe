import { useMutation } from '@apollo/client';
import { EDIT_PROFILE_DOCUMENT } from '../graphql';
import { setToast, useStore } from '../store';
import {
  cacheUpdatePersonalClinicName,
  cacheUpdateUserName,
} from '../utils/apollo.utils';
import {
  ClinicType,
  type EditProfileMutation,
  type EditProfileMutationVariables,
} from '../types/generated.types';
import { useMe } from './useMe';

interface Input {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const useEditProfile = () => {
  const [meData] = useMe();
  const client = useStore((state) => state.client);

  return useMutation<EditProfileMutation, EditProfileMutationVariables>(
    EDIT_PROFILE_DOCUMENT,
    {
      onCompleted(data, clientOptions) {
        const { error } = data.editProfile;
        if (error) {
          return setToast({ messages: [error] });
        }
        if (!meData) throw new Error('meData가 없습니다');

        const profileInput: Input = clientOptions?.variables?.input;
        const newName = profileInput.name;

        setToast({ messages: ['사용자 정보 수정완료'], fade: true });

        const prevName = meData.name;
        if (!newName || prevName === newName) return;

        const personalClinic = meData.members?.find(
          (member) => member.clinic.type === ClinicType.Personal
        )?.clinic;
        if (!personalClinic)
          return setToast({
            messages: ['meData에서 개인용 병원을 찾지 못했습니다'],
          });

        cacheUpdateUserName(client, meData.id, newName);
        cacheUpdatePersonalClinicName({
          client,
          userName: newName,
          clinicId: personalClinic.id,
          clinicName: personalClinic.name,
        });
      },
    }
  );
};
