import { gql } from '@apollo/client';

export const LISTEN_DELETE_RESERVATION_DOCUMENT = gql`
  subscription listenDeleteReservation($input: ListenDeleteReservationInput!) {
    listenDeleteReservation(input: $input) {
      id
      clinicId
    }
  }
`;
