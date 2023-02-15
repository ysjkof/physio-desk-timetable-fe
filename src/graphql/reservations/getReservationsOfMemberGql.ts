import { gql } from '@apollo/client';
import { COMMON_RESERVATION_FIELDS } from './_reservationsFragmentsGql';
import { COMMON_PATIENT_FIELDS } from '../patients';

export const GET_RESERVATIONS_OF_MEMBER_DOCUMENT = gql`
  ${COMMON_RESERVATION_FIELDS}
  ${COMMON_PATIENT_FIELDS}
  query getReservationsOfMember($input: GetReservationsOfMemberInput!) {
    getReservationsOfMember(input: $input) {
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
        patient {
          ...CommonPatientFields
        }
        lastModifier {
          id
          name
        }
      }
    }
  }
`;
