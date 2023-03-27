import { useMutation } from '@apollo/client';
import { CREATE_NEW_VERIFICATION_DOCUMENT } from '../graphql';
import {
  CreateNewVerificationMutation,
  CreateNewVerificationMutationVariables,
} from '../types/generatedTypes';

export const useCreateNewVerification = () => {
  const [callMutation] = useMutation<
    CreateNewVerificationMutation,
    CreateNewVerificationMutationVariables
  >(CREATE_NEW_VERIFICATION_DOCUMENT);

  const createNewVerification = (email: string) => {
    callMutation({
      variables: { input: { email } },
      onCompleted(data) {
        const { ok, error } = data.createNewVerification;
        console.log('createNewVerification', ok, error);
      },
    });
  };

  return createNewVerification;
};
