import { useMutation } from '@apollo/client';
import { FIND_MY_CLINICS_DOCUMENT, INVITE_USER_DOCUMENT } from '../graphql';
import { toastVar } from '../store';
import { client } from '../apollo';
import type {
  InviteUserMutation,
  InviteUserMutationVariables,
} from '../types/generated.types';

export const useInviteUser = () => {
  return useMutation<InviteUserMutation, InviteUserMutationVariables>(
    INVITE_USER_DOCUMENT,
    {
      onCompleted(data, options) {
        if (data.inviteUser.error)
          return toastVar({
            messages: ['초대를 실패했습니다.', data.inviteUser.error],
          });

        const useName = options?.variables?.input.name;
        toastVar({
          messages: [`${useName}님을 초대했습니다.`],
        });

        // TODO: 캐시업데이트
        client.refetchQueries({ include: [FIND_MY_CLINICS_DOCUMENT] });
      },
    }
  );
};
