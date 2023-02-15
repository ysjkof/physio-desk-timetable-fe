import { gql } from '@apollo/client';

export const FIND_MY_MEMBERS_DOCUMENT = gql`
  query findMyMembers {
    findMyMembers {
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
