const timetable = '/tt';
const auth = 'auth';
const reserve = 'reserve';
const edit = 'edit';
const create_patient = 'create-patient';
const login = 'login';
const sign_up = 'sign-up';

export const ROUTER = {
  confirm_email: 'confirm',
  edit_profile: 'edit-profile',
  search: 'search',
  dashboard: 'dashboard',
  auth,
  timetable,
  reserve: `${timetable}/${reserve}`,
  create_patient: `${timetable}/${create_patient}`,
  edit_reservation: `${timetable}/${edit}`,
  login: `${auth}/${login}`,
  sign_up: `${auth}/${sign_up}`,
};
export const ENDPOINT = {
  reserve,
  edit,
  create_patient,
  login,
  sign_up,
  DASHBOARD: {
    member: 'member',
    invite: 'invite',
    prescription: 'prescription',
    statistics: 'statistics',
    create: 'create',
    clinics: 'clinics',
  },
};
