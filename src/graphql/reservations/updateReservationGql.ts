import { gql } from '@apollo/client';

export const UPDATE_RESERVATION_DOCUMENT = gql`
  mutation updateReservation($input: UpdateReservationInput!) {
    updateReservation(input: $input) {
      ok
      error
    }
  }
`;
