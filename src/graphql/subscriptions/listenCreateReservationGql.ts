import { gql } from '@apollo/client';
import { ALL_PATIENT_FIELDS } from '../patients';
import { COMMON_PRESCRIPTION_FIELDS } from '../prescriptions';
import { COMMON_RESERVATION_FIELDS } from '../reservations/_reservationsFragmentsGql';
import { USER_ID_NAME_EMAIL_FIELDS } from '../users/_usersFragmentsGql';

export const LISTEN_CREATE_RESERVATION_DOCUMENT = gql`
  ${COMMON_RESERVATION_FIELDS}
  ${ALL_PATIENT_FIELDS}
  ${USER_ID_NAME_EMAIL_FIELDS}
  ${COMMON_PRESCRIPTION_FIELDS}
  subscription listenCreateReservation($input: ListenCreateReservationInput!) {
    listenCreateReservation(input: $input) {
      ...CommonReservationFields
      user {
        id
        name
      }
      patient {
        ...AllPatientFields
      }
      lastModifier {
        ...UserIdNameEmailFields
        updatedAt
      }
      clinic {
        id
        name
      }
      prescriptions {
        ...CommonPrescriptionFields
      }
    }
  }
`;
