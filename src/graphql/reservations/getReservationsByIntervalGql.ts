import { gql } from '@apollo/client';
import { ALL_PATIENT_FIELDS } from '../patients/_patientsFragmentsGql';
import { COMMON_PRESCRIPTION_FIELDS } from '../prescriptions/_prescriptionsFragmentsGql';
import { USER_ID_NAME_EMAIL_FIELDS } from '../users/_usersFragmentsGql';
import { COMMON_RESERVATION_FIELDS } from './_reservationsFragmentsGql';

export const GET_RESERVATIONS_BY_INTERVAL_DOCUMENT = gql`
  ${COMMON_RESERVATION_FIELDS}
  ${ALL_PATIENT_FIELDS}
  ${USER_ID_NAME_EMAIL_FIELDS}
  ${COMMON_PRESCRIPTION_FIELDS}
  query getReservationsByInterval($input: GetReservationsByIntervalInput!) {
    getReservationsByInterval(input: $input) {
      ok
      error
      totalCount
      results {
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
  }
`;
