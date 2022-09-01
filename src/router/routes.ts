const timetable = '/tt';
const create_patient = 'create_patient';
const reserve = 'reserve';
const edit_reservation = 'edit_reservation';

// auth
const auth = 'auth';
const login = 'login';
const sign_up = 'sign_up';
const confirm_email = 'confirm_email';
const edit_profile = 'edit_profile';

//dashboard
const dashboard = 'dashboard';
const member = 'member';
const invite = 'invite';
const prescription = 'prescription';
const statistics = 'statistics';
const create = 'create';
const clinics = 'clinics';

export const ROUTES = {
  search: 'search',
  timetable,
  reserve: `${timetable}/${reserve}`,
  create_patient: `${timetable}/${create_patient}`,
  edit_reservation: `${timetable}/${edit_reservation}`,
  login: `/${auth}/${login}`,
  sign_up: `/${auth}/${sign_up}`,
  confirm_email: `/${auth}/${confirm_email}`,
  dashboard,
  member: `/${dashboard}/${member}`,
  invite: `/${dashboard}/${invite}`,
  prescription: `/${dashboard}/${prescription}`,
  statistics: `/${dashboard}/${statistics}`,
  create: `/${dashboard}/${create}`,
  clinics: `/${dashboard}/${clinics}`,
  edit_profile: `/${dashboard}/${edit_profile}`,
} as const;
export const ENDPOINT = {
  reserve,
  create_patient,
  edit_reservation,
  login,
  sign_up,
  confirm_email,
  DASHBOARD: {
    dashboard,
    member,
    invite,
    prescription,
    statistics,
    create,
    clinics,
    edit_profile,
  },
} as const;

export type DashboardEndpoint = keyof typeof ENDPOINT.DASHBOARD;

export const clinicMenu = [
  { route: ENDPOINT.DASHBOARD.member, name: '구성원' },
  { route: ENDPOINT.DASHBOARD.invite, name: '초대' },
  { route: ENDPOINT.DASHBOARD.prescription, name: '처방' },
  { route: ENDPOINT.DASHBOARD.statistics, name: '통계' },
];

export const personalMenu = [
  { route: ENDPOINT.DASHBOARD.edit_profile, name: '나의 정보' },
  { route: ENDPOINT.DASHBOARD.clinics, name: '나의 병원' },
  { route: ENDPOINT.DASHBOARD.create, name: '병원 만들기' },
];
