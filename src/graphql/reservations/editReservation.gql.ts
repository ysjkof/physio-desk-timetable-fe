import { gql } from '@apollo/client';

export const EDIT_RESERVATION_DOCUMENT = gql`
  mutation editReservation($input: EditReservationInput!) {
    editReservation(input: $input) {
      ok
      error
    }
  }
`;
