import { useMutation, useReactiveVar } from '@apollo/client';
import { EDIT_PROFILE_DOCUMENT } from '../graphql';
import { loggedInUserVar, toastVar, useStore } from '../store';
import {
  cacheUpdatePersonalClinicName,
  cacheUpdateUserName,
} from '../utils/apolloCache.utils';
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from '../types/generated.types';

interface Input {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const useEditProfile = () => {
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const client = useStore((state) => state.client);

  return useMutation<EditProfileMutation, EditProfileMutationVariables>(
    EDIT_PROFILE_DOCUMENT,
    {
      onCompleted(data, clientOptions) {
        const { error } = data.editProfile;
        if (error) {
          return toastVar({ messages: [error] });
        }

        const profileInput: Input = clientOptions?.variables?.input;
        const newName = profileInput.name;

        toastVar({ messages: ['사용자 정보 수정완료'], fade: true });

        const prevName = loggedInUser?.name;
        if (!loggedInUser || !newName || prevName === newName) return;
        cacheUpdateUserName(client, loggedInUser.id, newName);
        cacheUpdatePersonalClinicName(client, newName);
      },
    }
  );
};
