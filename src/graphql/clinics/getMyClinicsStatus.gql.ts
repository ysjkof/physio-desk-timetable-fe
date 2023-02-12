import { gql } from '@apollo/client';

export const GET_MY_CLINICS_STATUS_DOCUMENT = gql`
  query getMyClinicsStatus {
    getMyClinicsStatus {
      ok
      error
      clinics {
        id
        name
        accepted
        staying
        manager
        isPersonal
      }
    }
  }
`;
