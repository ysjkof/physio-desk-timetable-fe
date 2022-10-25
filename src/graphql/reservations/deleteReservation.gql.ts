import { gql } from '@apollo/client';

export const DELETE_RESERVATION_DOCUMENT = gql`
  mutation deleteReservation($input: DeleteReservationInput!) {
    deleteReservation(input: $input) {
      error
      ok
    }
  }
`;
