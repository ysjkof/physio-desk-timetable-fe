import { useMutation } from '@apollo/client';
import {
  UpdateMemberColorMutation,
  UpdateMemberColorMutationVariables,
} from '../types/generatedTypes';
import { UPDATE_MEMBER_COLOR } from '../graphql/clinics';
import { cacheUpdateMemberColor } from '../utils/apolloUtils';
import { setToast } from '../store';

export const useUpdateMemberColor = () => {
  const [updateColor] = useMutation<
    UpdateMemberColorMutation,
    UpdateMemberColorMutationVariables
  >(UPDATE_MEMBER_COLOR);

  const updateMemberColor = (id: number, color: string) => {
    updateColor({
      variables: { input: { id, value: color } },
      onCompleted(data) {
        const { error } = data.updateMemberColor;
        if (error) {
          return setToast({ messages: [error] });
        }

        cacheUpdateMemberColor(id, color);
      },
    });
  };

  return { updateMemberColor };
};
