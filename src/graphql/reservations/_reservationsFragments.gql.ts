import { gql } from '@apollo/client';

export const COMMON_RESERVATION_FIELDS = gql`
  fragment CommonReservationFields on Reservation {
    id
    startDate
    endDate
    state
    memo
    isFirst
  }
`;
