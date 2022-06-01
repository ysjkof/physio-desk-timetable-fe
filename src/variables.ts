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

export const TABLE_MAIN_COMPONENT_LAYOUT_PADDING_TOP = 50; // px
export const TABLE_CELL_HEIGHT = 20; // px
export const TABLE_TIME_GAP = 10; // 분 단위, 나중에 전역변수로 조절할 수 있게 고려

export const NEXT = "next";
export const PREV = "prev";
export const SCROLL_ADRESS = "scroll-adress-";
export const LOCALSTORAGE_VIEW_OPTION_CLINICS = "muool-view-option-clinics-";
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
