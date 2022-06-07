import { Clinic, Member, User } from "../graphql/generated/graphql";
import { ModifiedLoggedInUser } from "../hooks/useMe";
import { ModifiedReservation } from "../pages/timetable";

interface ModifiedClinicMemberWithUserAndClinic
  extends Pick<Member, "id" | "staying" | "manager" | "accepted"> {
  user: Pick<User, "id" | "name">;
  clinic: Pick<Clinic, "id" | "name">;
}
export interface ClinicMemberWithOptions
  extends ModifiedClinicMemberWithUserAndClinic {
  activation: boolean;
  loginUser: boolean;
}
interface ModifiedClinic extends Pick<Clinic, "id" | "name"> {
  members: ClinicMemberWithOptions[];
}
export interface ClinicWithOptions extends ModifiedClinic {}

export const getSunday = (date: Date) => {
  const returnDate = new Date(date);
  returnDate.setHours(0, 0, 0, 0);
  returnDate.setDate(date.getDate() - date.getDay());
  return returnDate;
};

export function getAfterDate(startDate: Date, afterDay: number) {
  const returnDate = new Date(startDate);
  returnDate.setHours(0, 0, 0, 0);
  returnDate.setDate(startDate.getDate() + afterDay);
  return returnDate;
}

export const spreadClinicMembers = (
  clinics: ClinicWithOptions[] | null,
  selectedClinicId: number
) => {
  const result: ClinicMemberWithOptions[] = [];
  const selectedClinic = clinics?.find(
    (clinic) => clinic.id === selectedClinicId
  );
  if (selectedClinic) {
    const newMember = selectedClinic.members.map((member) => member);
    result.push(...newMember);
  }
  return result;
};

export const compareNumAfterGetMinutes = (
  date: Date,
  compareNumbers: number[]
): boolean => {
  const minutes = date.getMinutes();
  return compareNumbers.includes(minutes);
};

interface UserWithEvents extends ClinicMemberWithOptions {
  events: ModifiedReservation[];
}
export interface DayWithUsers {
  date: Date;
  users: UserWithEvents[];
}
export const getWeeks = (dateOfSunday: Date) => {
  let result: { date: Date }[] = [];
  for (let i = 0; i < 7; i++) {
    const sunday = new Date(dateOfSunday);
    sunday.setDate(sunday.getDate() + i);
    result.push({ date: sunday });
  }
  return result;
};
export const mergeLoggedInUser = (
  loginUser: ModifiedLoggedInUser,
  members: ClinicMemberWithOptions[]
) => {
  let result: ClinicMemberWithOptions[] = [];
  const loggedInUser = {
    id: 0,
    staying: true,
    manager: true,
    accepted: true,
    user: {
      id: loginUser.id,
      name: loginUser.name,
      email: loginUser.email,
    },
    clinic: {
      id: 0,
      name: "",
    },
    activation: true,
    loginUser: true,
  };
  if (members.length >= 1) {
    const activatedMembers = members.filter((member) => member.activation);
    const removeLoggedInUser = activatedMembers.filter(
      (member) => member.user.id !== loginUser.id
    );
    const isThereLoginUser = activatedMembers.find(
      (member) => member.user.id === loginUser.id
    );
    if (isThereLoginUser) {
      result.push(loggedInUser);
    }
    result.push(...removeLoggedInUser);
  } else {
    result.push(loggedInUser);
  }
  return result;
};
// 겟위크 결과값에 객체 필드 넣는 기능을 따로 빼자.
export const makeDayWithUsers = (
  weeks: { date: Date }[],
  loginUser: ModifiedLoggedInUser,
  members: ClinicMemberWithOptions[]
) => {
  const result: DayWithUsers[] = [];
  function makeNewUsers() {
    return mergeLoggedInUser(loginUser, members).map((user) => ({
      ...user,
      events: [],
    }));
  }
  weeks.forEach((day) => {
    result.push({
      ...day,
      users: makeNewUsers(),
    });
  });
  return result;
};

export const getYMD = (
  inputDate: string | Date,
  option: "yyyymmdd" | "yymmdd",
  separator?: "-"
) => {
  const localDate = new Date(inputDate);
  let year;
  if (option === "yymmdd") year = String(localDate.getFullYear()).substring(2);
  if (option === "yyyymmdd") year = String(localDate.getFullYear());
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const date = String(localDate.getDate()).padStart(2, "0");
  if (separator) return `${year}-${month}-${date}`;
  return `${year}${month}${date}`;
};

export function getHHMM(inputDate: string | Date, seperator?: ":") {
  const date = new Date(inputDate);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  if (seperator === ":") return `${hh}:${mm}`;
  return `${hh}${mm}`;
}

export function combineYMDHM(YMDDate: Date, HMDate: Date) {
  const year = YMDDate.getFullYear();
  const month = YMDDate.getMonth();
  const date = YMDDate.getDate();
  const h = HMDate.getHours();
  const m = HMDate.getMinutes();

  return new Date(year, month, date, h, m);
}

export const getTimeLength = (startDate: Date, endDate: Date) => {
  const sd = new Date(startDate);
  const ed = new Date(endDate);
  return (ed.getTime() - sd.getTime()) / 1000 / 60;
};

export const getWeeksOfMonth = (date: Date) => {
  let result = [];
  const firstDate = new Date(date);
  const lastDate = new Date(firstDate);
  firstDate.setDate(1);
  lastDate.setMonth(lastDate.getMonth() + 1);
  lastDate.setDate(0);
  for (let i = 0; i < 6; i++) {
    const date = new Date(firstDate);
    date.setDate(i * 7 + 1);
    const week = getWeeks(getSunday(date));
    result.push(...week);
    if (
      firstDate.getMonth() !== week[6].date.getMonth() ||
      (i > 0 && firstDate.getMonth() !== week[0].date.getMonth())
    )
      break;
  }
  return result;
};

export const compareDateMatch = (
  inputDate: Date,
  comparisonDate: Date,
  option: "ymd" | "ym" | "d" | "hm"
): boolean => {
  switch (option) {
    case "ymd":
      return (
        inputDate.getFullYear() === comparisonDate.getFullYear() &&
        inputDate.getMonth() === comparisonDate.getMonth() &&
        inputDate.getDate() === comparisonDate.getDate()
      );
    case "ym":
      return (
        inputDate.getFullYear() === comparisonDate.getFullYear() &&
        inputDate.getMonth() === comparisonDate.getMonth()
      );
    case "d":
      return inputDate.getDate() === comparisonDate.getDate();
    case "hm":
      return (
        inputDate.getHours() === comparisonDate.getHours() &&
        inputDate.getMinutes() === comparisonDate.getMinutes()
      );
  }
};

export const compareSameWeek = (date: Date, secondDate: Date): boolean => {
  return compareDateMatch(getSunday(date), getSunday(secondDate), "ymd");
};

// 시작시각부터 끝시각까지 timeGap의 차이가 나는 Date배열을 만든다
export function getTimeGaps(
  startHours: number,
  startMinutes: number,
  endHours: number,
  endMinutes: number,
  timeGap: number
): Date[] {
  const labels = [];
  const start = new Date();
  const end = new Date(start);
  start.setHours(startHours, startMinutes, 0, 0);
  end.setHours(endHours, endMinutes, 0, 0);
  let i = 0;
  while (i < 1500) {
    const date = new Date(start);
    const labelRow = date;
    labels.push(labelRow);
    const getMinutes = start.getMinutes();
    start.setMinutes(getMinutes + timeGap);
    i++;
    if (start.valueOf() > end.valueOf()) i = 1500;
  }
  return labels;
}
