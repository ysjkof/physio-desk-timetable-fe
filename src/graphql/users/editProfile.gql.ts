import { gql } from '@apollo/client';

export const EDIT_PROFILE_DOCUMENT = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;
