import { useMutation } from '@apollo/client';
import { GET_CLINIC_DOCUMENT, INVITE_USER_DOCUMENT } from '../graphql';
import { client } from '../apollo';
import { setAlert } from '../store';
import type {
  InviteUserMutation,
  InviteUserMutationVariables,
} from '../types/generatedTypes';

export const useInviteUser = () => {
  const [inviteMutation, result] = useMutation<
    InviteUserMutation,
    InviteUserMutationVariables
  >(INVITE_USER_DOCUMENT, {});

  const inviteUser = (clinicId: number, name: string) => {
    inviteMutation({
      variables: { input: { clinicId, name } },
      onCompleted(data) {
        const { error } = data.inviteUser;
        if (error) {
          return setAlert({
            messages: ['초대를 실패했습니다.', error],
          });
        }

        setAlert({
          messages: [`${name}님을 초대했습니다.`],
          isPositive: true,
        });

        // TODO: 리페치를 웹소켓으로 전환
        client?.refetchQueries({ include: [GET_CLINIC_DOCUMENT] });
      },
    });
  };

  return { inviteUser, result };
};
