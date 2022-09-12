const timetable = 'tt';
const create_patient = 'create_patient';
const reserve = 'reserve';
const edit_reservation = 'edit_reservation';

// auth
const auth = 'auth';
const login = 'login';
const sign_up = 'sign_up';
const confirm_email = 'confirm_email';
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
const docs = 'docs';
const basic_patient_registration = 'basic_patient_registration';
const basic_prescription_registration = 'basic_prescription_registration';
const basic_reserve = 'basic_reserve';
const screen_timetable = `screen_${timetable}`;
const clinic_registration = 'clinic_registration';
const dashboard_member = `${dashboard}_${member}`;
const dashboard_invite = `${dashboard}_${invite}`;
const dashboard_prescription = `${dashboard}_${prescription}`;
const dashboard_statistics = `${dashboard}_${statistics}`;
const dashboard_create = `${dashboard}_${create}`;
const dashboard_clinics = `${dashboard}_${clinics}`;
const dashboard_edit_profile = `${dashboard}_${edit_profile}`;

export const ROUTES = {
  docs: `/${docs}`,
  search: '/search',
  timetable: `/${timetable}`,
  reserve: `/${timetable}/${reserve}`,
  create_patient: `/${timetable}/${create_patient}`,
  edit_reservation: `/${timetable}/${edit_reservation}`,
  login: `/${auth}/${login}`,
  sign_up: `/${auth}/${sign_up}`,
  confirm_email: `/${auth}/${confirm_email}`,
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
  docs: {
    basisPatientRegistration: basic_patient_registration,
    basicPrescriptionRegistration: basic_prescription_registration,
    basicReserve: basic_reserve,
    screenTimetable: screen_timetable,
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

export const docsMenu = [
  {
    route: `/${docs}/`,
    name: '처음 예약하기',
    children: [
      { route: basic_patient_registration, name: '환자 등록' },
      { route: basic_prescription_registration, name: '처방 등록' },
      { route: basic_reserve, name: '예약하기' },
    ],
  },

  {
    route: `/${docs}/`,
    name: '화면 설명',
    children: [{ route: screen_timetable, name: '시간표' }],
  },

  {
    route: `/${docs}/`,
    name: '병원',
    children: [{ route: clinic_registration, name: '병원 만들기' }],
  },

  {
    route: `/${docs}/`,
    name: '대시보드 메뉴 안내',
    children: [
      ...clinicMenu.map((menu) => ({
        ...menu,
        route: `${dashboard}_menu.route`,
      })),
      ...personalMenu.map((menu) => ({
        ...menu,
        route: `${dashboard}_menu.route`,
      })),
    ],
  },
];
