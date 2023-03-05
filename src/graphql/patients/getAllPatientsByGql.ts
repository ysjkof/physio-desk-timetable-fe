import { gql } from '@apollo/client';
import { COMMON_PATIENT_FIELDS } from './_patientsFragmentsGql';

export const GET_ALL_PATIENTS_BY_CLINIC_DOCUMENT = gql`
  ${COMMON_PATIENT_FIELDS}
  query getAllPatientsByClinic($input: GetAllPatientsByClinicInput!) {
    getAllPatientsByClinic(input: $input) {
      ok
      error
      totalPages
      totalCount
      results {
        ...CommonPatientFields
        clinic {
          name
        }
      }
    }
  }
`;
