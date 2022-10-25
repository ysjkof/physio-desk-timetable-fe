import { gql } from '@apollo/client';
import { COMMON_RESERVATION_FIELDS } from './_reservationsFragments.gql';

export const GET_RESERVATIONS_BY_PATIENT_DOCUMENT = gql`
  ${COMMON_RESERVATION_FIELDS}
  query getReservationsByPatient($input: GetReservationsByPatientInput!) {
    getReservationsByPatient(input: $input) {
      ok
      error
      totalPages
      totalCount
      results {
        ...CommonReservationFields
        prescriptions {
          name
          requiredTime
        }
        user {
          id
          name
        }
        lastModifier {
          id
          name
        }
      }
    }
  }
`;
