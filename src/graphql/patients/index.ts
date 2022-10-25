import { CREATE_PATIENT_DOCUMENT } from './createPatient.gql';
import { EDIT_PATIENT_DOCUMENT } from './editPatient';
import { FIND_ALL_PATIENTS_DOCUMENT } from './findAllPatients.gql';
import { GET_PATIENTS_DOCUMENT } from './getPatients.gql';
import { SEARCH_PATIENT_DOCUMENT } from './searchPatient.gql';
import {
  ALL_PATIENT_FIELDS,
  COMMON_PATIENT_FIELDS,
} from './_patientsFragments.gql';

export {
  CREATE_PATIENT_DOCUMENT,
  EDIT_PATIENT_DOCUMENT,
  FIND_ALL_PATIENTS_DOCUMENT,
  GET_PATIENTS_DOCUMENT,
  SEARCH_PATIENT_DOCUMENT,
  ALL_PATIENT_FIELDS,
  COMMON_PATIENT_FIELDS,
};
