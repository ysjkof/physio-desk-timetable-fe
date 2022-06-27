import { ReservationState } from "./graphql/generated/graphql";

export const LOCALSTORAGE_TOKEN = "muool-token";
// 한국 표준시(韓國標準時, KST, Korea Standard Time) = UTC+09:00
export const UTC_OPTION_KST = "+0900";

export const ONE_DAY = 1;
export const ONE_WEEK = 7;
export const TWO_WEEKS = 14;
export const THREE_WEEKS = 21;
// 할 일; 4주는 이번 달 보기로 수정예정.
export const FOUR_WEEKS = 28;

// console.log(pattern.test("2020-10-31")); 결과 : true
// console.log(pattern.test("20201030")); 결과 : false
// console.log(pattern.test("2020-10-32"));결과 : false
export const REGEX_YYYYMMDD =
  /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;

// console.log(pattern.test("01:21")); 결과 : true
// console.log(pattern.test("01:61")); 결과 : false
// console.log(pattern.test("1:21")); 결과 : true
// console.log(pattern.test("1:61")); 결과 : false
// console.log(pattern.test("24:21")); 결과 : false
// export const REGEX_HHMM = /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/;
// 이하는 1분 단위는 0만 가능
export const REGEX_HHMM = /^([1-9]|[01][0-9]|2[0-3]):([0-5][0])$/;
export const REGEX_NUMBER_END_DIGIT_OF_ZERO = /^[0-9]*0$/;
export const REGEX_EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const TABLE_MAIN_COMPONENT_LAYOUT_PADDING_TOP = 50; // px
export const TABLE_CELL_HEIGHT = 20; // px
export const TABLE_CELL_HEIGHT_IN_ONE_MINUTE = 2; // px
export const TABLE_TIME_GAP = 10; // 분 단위, 나중에 전역변수로 조절할 수 있게 고려

export const NEXT = "next";
export const PREV = "prev";
export const SCROLL_ADRESS = "scroll-adress-";
export const LOCALSTORAGE_CLINIC_LISTS = "muool-clinic-lists-";
export const LOCALSTORAGE_VIEW_OPTION = "muool-view-option-";
export const LOCALSTORAGE_SELECTED_CLINIC = "muool-selected-clinic-";

// routes
export const TIMETABLE = "/tt";
export const RESERVE_DETAIL = `${TIMETABLE}/reserve`;
export const RESERVE_EDIT = `${TIMETABLE}/edit`;

// Reservation State 한글
export const RESERVATION_STATE_KOR = {
  [ReservationState.Canceled]: "취소",
  [ReservationState.NoShow]: "부도",
  [ReservationState.Reserved]: "예약",
};

// 통계
export const STATISTICS_LABEL_KOR = [
  "예약",
  "신규",
  "부도",
  "취소",
  "방문한지 30일 경과",
];
export const STATISTICS_LABEL_ENG: STATISTICS_LABEL[] = [
  "reservationCount",
  "newPatient",
  "noshow",
  "cancel",
  "visitMoreThanThirty",
];
export type STATISTICS_LABEL =
  | "reservationCount"
  | "newPatient"
  | "noshow"
  | "cancel"
  | "visitMoreThanThirty";

export const STATISTICS_LABEL_COLORS = [
  ["#233d4d", "#fcca46", "#a1c181", "#fe7f2d", "#619b8a"],
  ["#0d3b66", "#f4d35e", "#faf0ca", "#f95738", "#ee964b"],
];

export const USER_COLORS = [
  // light : bg-color-100
  { deep: "#FCA5A5", light: "#FEE2E2" },
  { deep: "#FDBA74", light: "#FFEDD5" },
  { deep: "#FDE047", light: "#FEF9C3" },
  { deep: "#86EFAC", light: "#DCFCE7" },
  { deep: "#93C5FD", light: "#DBEAFE" },
  { deep: "#A5B4FC", light: "#E0E7FF" },
  { deep: "#C4B5FD", light: "#EDE9FE" },
];
// export const USER_COLORS = [
//   // light : bg-color-50
//   { deep: "#FCA5A5", light: "#FEF2F2" },
//   { deep: "#FDBA74", light: "#FFF7ED" },
//   { deep: "#FDE047", light: "#FEFCE8" },
//   { deep: "#86EFAC", light: "#F0FDF4" },
//   { deep: "#93C5FD", light: "#EFF6FF" },
//   { deep: "#A5B4FC", light: "#EEF2FF" },
//   { deep: "#C4B5FD", light: "#F5F3FF" },
// ];
