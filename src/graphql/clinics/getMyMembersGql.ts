import { gql } from '@apollo/client';

export const GET_MY_MEMBERS_DOCUMENT = gql`
  query getMyMembers {
    getMyMembers {
      ok
      error
      members {
        id
        manager
        accepted
        staying
        createdAt
        clinic {
          id
          name
          isActivated
        }
      }
    }
  }
`;
