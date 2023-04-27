import { gql } from '@apollo/client';
import { COMMON_RESERVATION_FIELDS } from '../reservations/_reservationsFragmentsGql';
import { USER_ID_NAME_NICKNAME_EMAIL_FIELDS } from '../users/_usersFragmentsGql';

export const LISTEN_UPDATE_RESERVATION_DOCUMENT = gql`
  ${COMMON_RESERVATION_FIELDS}
  ${USER_ID_NAME_NICKNAME_EMAIL_FIELDS}
  subscription listenUpdateReservation($input: ListenUpdateReservationInput!) {
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
        ...UserIdNameNicknameEmailFields
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
