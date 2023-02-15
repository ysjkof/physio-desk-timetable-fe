import { gql } from '@apollo/client';
import { ALL_PATIENT_FIELDS } from '../patients/_patientsFragmentsGql';
import { COMMON_PRESCRIPTION_FIELDS } from '../prescriptions/_prescriptionsFragmentsGql';
import { USER_ID_NAME_EMAIL_FIELDS } from '../users/_usersFragmentsGql';
import { COMMON_RESERVATION_FIELDS } from './_reservationsFragmentsGql';

export const LIST_RESERVATIONS_DOCUMENT = gql`
  ${COMMON_RESERVATION_FIELDS}
  ${ALL_PATIENT_FIELDS}
  ${USER_ID_NAME_EMAIL_FIELDS}
  ${COMMON_PRESCRIPTION_FIELDS}
  query listReservations($input: ListReservationsInput!) {
    listReservations(input: $input) {
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
