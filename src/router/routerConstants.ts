const timetable = '/tt';
const auth = 'auth';
const reserve = 'reserve';
const edit = 'edit';
const create_patient = 'create-patient';
const signIn = 'sing-in';
const signUp = 'sign-up';

export const ROUTER = {
  confirmEmail: 'confirm',
  editProfile: 'edit-profile',
  search: 'search',
  dashboard: 'dashboard',
  auth,
  timetable,
  reserve: `${timetable}/${reserve}`,
  createPatient: `${timetable}/${create_patient}`,
  editReservation: `${timetable}/${edit}`,
  signIn: `${auth}/${signIn}`,
  signUp: `${auth}/${signUp}`,
};
export const ENDPOINT = {
  reserve,
  edit,
  create_patient,
  signIn,
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
