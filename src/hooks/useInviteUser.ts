import { useMutation } from '@apollo/client';
import { GET_CLINIC_DOCUMENT, INVITE_USER_DOCUMENT } from '../graphql';
import { client } from '../apollo';
import { setAlert } from '../store';
import type {
  InviteUserMutation,
  InviteUserMutationVariables,
} from '../types/generatedTypes';

export const useInviteUser = () => {
  return useMutation<InviteUserMutation, InviteUserMutationVariables>(
    INVITE_USER_DOCUMENT,
    {
      onCompleted(data, clientOptions) {
        if (data.inviteUser.error)
          return setAlert({
            messages: ['초대를 실패했습니다.', data.inviteUser.error],
          });

        const useName = clientOptions?.variables?.input.name;
        setAlert({
          messages: [`${useName}님을 초대했습니다.`],
          isPositive: true,
        });

        // TODO: 캐시업데이트
        client?.refetchQueries({ include: [GET_CLINIC_DOCUMENT] });
      },
    }
  );
};
