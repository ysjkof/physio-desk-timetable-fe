import { gql } from '@apollo/client';

export const CREATE_RESERVATION_DOCUMENT = gql`
  mutation createReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      ok
      error
    }
  }
`;
