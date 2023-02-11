import { useMutation } from '@apollo/client';
import { EDIT_PROFILE_DOCUMENT } from '../graphql';
import { toastVar, useStore } from '../store';
import {
  cacheUpdatePersonalClinicName,
  cacheUpdateUserName,
} from '../utils/apolloCache.utils';
import {
  EditProfileMutation,
  EditProfileMutationVariables,
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
          return toastVar({ messages: [error] });
        }
        if (!meData) throw new Error('meData가 없습니다');

        const profileInput: Input = clientOptions?.variables?.input;
        const newName = profileInput.name;

        toastVar({ messages: ['사용자 정보 수정완료'], fade: true });

        const prevName = meData.name;
        if (!newName || prevName === newName) return;
        cacheUpdateUserName(client, meData.id, newName);
        cacheUpdatePersonalClinicName(client, newName);
      },
    }
  );
};
