import { gql } from '@apollo/client';

export const LISTEN_DELETE_RESERVATION_DOCUMENT = gql`
  subscription listenDeleteReservation {
    listenDeleteReservation {
      id
      clinicId
    }
  }
`;
