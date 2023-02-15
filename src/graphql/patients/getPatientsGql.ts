import { gql } from '@apollo/client';
import { ALL_PATIENT_FIELDS } from './_patientsFragmentsGql';

export const GET_PATIENTS_DOCUMENT = gql`
  ${ALL_PATIENT_FIELDS}
  query getPatients($input: GetPatientsInput!) {
    getPatients(input: $input) {
      ok
      error
      patients {
        ...AllPatientFields
      }
    }
  }
`;
