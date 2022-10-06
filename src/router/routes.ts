const timetable = 'tt';
const create_patient = 'create_patient';
const reserve = 'reserve';
const edit_reservation = 'edit_reservation';

// auth
const auth = 'auth';
const login = 'login';
const sign_up = 'sign_up';
const confirm_email = 'confirm_email';
const change_email = 'change_email';
const edit_profile = 'edit_profile';

// dashboard
const dashboard = 'dashboard';
const member = 'member';
const invite = 'invite';
const prescription = 'prescription';
const statistics = 'statistics';
const create = 'create';
const clinics = 'clinics';

// docs
export const DOCS = 'docs';
const overview = 'overview';
export const basic_patient_registration = 'basic_patient_registration';
export const basic_prescription_registration =
  'basic_prescription_registration';
export const basic_reserve = 'basic_reserve';
const roadmap = 'roadmap';
const contacts = 'contacts';
const screen_timetable = `screen_${timetable}`;
const clinic_registration = 'clinic_registration';
const view_duration = 'view_duration';
const view_state = 'view_state';
const view_clinic = 'view_clinic';
const dashboard_member = `${dashboard}_${member}`;
const dashboard_invite = `${dashboard}_${invite}`;
const dashboard_prescription = `${dashboard}_${prescription}`;
const dashboard_statistics = `${dashboard}_${statistics}`;
const dashboard_create = `${dashboard}_${create}`;
const dashboard_clinics = `${dashboard}_${clinics}`;
const dashboard_edit_profile = `${dashboard}_${edit_profile}`;

export const ROUTES = {
  docs: `/${DOCS}`,
  overview: `/${DOCS}/${overview}`,
  basic_patient_registration: `/${DOCS}/${basic_patient_registration}`,
  basic_prescription_registration: `/${DOCS}/${basic_prescription_registration}`,
  basic_reserve: `/${DOCS}/${basic_reserve}`,
  view_duration: `/${DOCS}/${view_duration}`,
  view_state: `/${DOCS}/${view_state}`,
  view_clinic: `/${DOCS}/${view_clinic}`,
  roadmap: `/${DOCS}/${roadmap}`,
  contacts: `/${DOCS}/${contacts}`,
  search: '/search',
  timetable: `/${timetable}`,
  reserve: `/${timetable}/${reserve}`,
  create_patient: `/${timetable}/${create_patient}`,
  edit_reservation: `/${timetable}/${edit_reservation}`,
  login: `/${auth}/${login}`,
  sign_up: `/${auth}/${sign_up}`,
  confirm_email: `/${auth}/${confirm_email}`,
  change_email: `/${auth}/${change_email}`,
  dashboard: `/${dashboard}`,
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
  dashboard: {
    dashboard,
    member,
    invite,
    prescription,
    statistics,
    create,
    clinics,
    edit_profile,
  },
  docs: {
    overview,
    basic_patient_registration,
    basic_prescription_registration,
    basic_reserve,
    view_duration,
    view_state,
    view_clinic,
    roadmap,
    contacts,
    screen_timetable,
    clinic_registration,
    dashboard_member,
    dashboard_invite,
    dashboard_prescription,
    dashboard_statistics,
    dashboard_create,
    dashboard_clinics,
    dashboard_edit_profile,
  },
} as const;

export type DashboardEndpoint = keyof typeof ENDPOINT.dashboard;

export const clinicMenu = [
  { route: ENDPOINT.dashboard.member, name: '구성원' },
  { route: ENDPOINT.dashboard.invite, name: '초대' },
  { route: ENDPOINT.dashboard.prescription, name: '처방' },
  { route: ENDPOINT.dashboard.statistics, name: '통계' },
];

export const personalMenu = [
  { route: ENDPOINT.dashboard.edit_profile, name: '나의 정보' },
  { route: ENDPOINT.dashboard.clinics, name: '나의 병원' },
  { route: ENDPOINT.dashboard.create, name: '병원 만들기' },
];
