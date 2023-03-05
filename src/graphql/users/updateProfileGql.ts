import { gql } from '@apollo/client';

export const UPDATE_PROFILE_DOCUMENT = gql`
  mutation updateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ok
      error
    }
  }
`;
