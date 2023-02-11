import { useMutation } from '@apollo/client';
import { FIND_MY_CLINICS_DOCUMENT, INVITE_USER_DOCUMENT } from '../graphql';
import { setToast } from '../store';
import type {
  InviteUserMutation,
  InviteUserMutationVariables,
} from '../types/generated.types';

export const useInviteUser = () => {
  return useMutation<InviteUserMutation, InviteUserMutationVariables>(
    INVITE_USER_DOCUMENT,
    {
      onCompleted(data, clientOptions) {
        if (data.inviteUser.error)
          return setToast({
            messages: ['초대를 실패했습니다.', data.inviteUser.error],
          });

        const useName = clientOptions?.variables?.input.name;
        setToast({
          messages: [`${useName}님을 초대했습니다.`],
        });

        // TODO: 캐시업데이트
        clientOptions?.client?.refetchQueries({
          include: [FIND_MY_CLINICS_DOCUMENT],
        });
        // client.refetchQueries({ include: [FIND_MY_CLINICS_DOCUMENT] });
      },
    }
  );
};
