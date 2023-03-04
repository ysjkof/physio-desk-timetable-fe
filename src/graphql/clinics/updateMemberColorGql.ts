import { gql } from '@apollo/client';

export const UPDATE_MEMBER_COLOR = gql`
  mutation updateMemberColor($input: UpdateMemberColorInput!) {
    updateMemberColor(input: $input) {
      ok
      error
    }
  }
`;
