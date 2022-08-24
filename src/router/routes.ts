const timetable = '/tt';
const reserve = 'reserve';
const edit = 'edit';
const create_patient = 'create-patient';
const login = 'login';
const signUp = 'sign-up';

export const ROUTES = {
  confirmEmail: 'confirm',
  editProfile: 'edit-profile',
  search: 'search',
  dashboard: 'dashboard',
  timetable,
  reserve: `${timetable}/${reserve}`,
  createPatient: `${timetable}/${create_patient}`,
  editReservation: `${timetable}/${edit}`,
  login: `/${login}`,
  signUp: `/${signUp}`,
};
export const ENDPOINT = {
  reserve,
  edit,
  create_patient,
  login,
  signUp,
  DASHBOARD: {
    member: 'member',
    invite: 'invite',
    prescription: 'prescription',
    statistics: 'statistics',
    create: 'create',
    clinics: 'clinics',
  },
};
