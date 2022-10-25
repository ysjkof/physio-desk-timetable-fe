import { gql } from '@apollo/client';
import { COMMON_RESERVATION_FIELDS } from '../reservations/_reservationsFragments.gql';
import { USER_ID_NAME_EMAIL_FIELDS } from '../users/_usersFragments.gql';

export const LISTEN_UPDATE_RESERVATION_DOCUMENT = gql`
  ${COMMON_RESERVATION_FIELDS}
  ${USER_ID_NAME_EMAIL_FIELDS}
  subscription listenUpdateReservation($input: UpdateReservationInput!) {
    listenUpdateReservation(input: $input) {
      ...CommonReservationFields
      user {
        id
      }
      patient {
        id
        name
      }
      lastModifier {
        ...UserIdNameEmailFields
        updatedAt
      }
      clinic {
        id
      }
      prescriptions {
        id
      }
    }
  }
`;
