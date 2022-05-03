import { ModifiedReservation } from "../components/timetable";
import { MeQuery } from "../graphql/generated/graphql";
import { GroupMemberWithOptions, GroupWithOptions } from "../pages/test";

export const spreadGroupMembers = (groups: GroupWithOptions[] | null) => {
  const result: GroupMemberWithOptions[] = [];
  groups?.forEach((group) => {
    if (group.activation) {
      const newMembers = group.members.filter((member) => member.activation);
      result.push(...newMembers);
    }
  });
  return result;
};

export const compareNumAfterGetMinutes = (
  date: Date,
  compareNumbers: number[]
): boolean => {
  const minutes = date.getMinutes();
  return compareNumbers.includes(minutes);
};

export const getSunday = (date: Date) => {
  const $date = new Date(date);
  $date.setDate(date.getDate() - date.getDay());
  return $date;
};

export interface OneDate {
  date: Date;
}
interface UserWithEvents extends GroupMemberWithOptions {
  events: ModifiedReservation[];
}
export interface DayWithUsers {
  date: Date;
  users: UserWithEvents[];
}
export const getWeeks = (dateOfSunday: Date) => {
  let result: OneDate[] = [];
  for (let i = 0; i < 7; i++) {
    const sunday = new Date(dateOfSunday);
    sunday.setDate(sunday.getDate() + i);
    result.push({ date: sunday });
  }
  return result;
};
export const mergeLoggedInUser = (
  loginUser: MeQuery,
  members: GroupMemberWithOptions[]
) => {
  let result: GroupMemberWithOptions[] = [];
  const loggedInUser = {
    id: 0,
    staying: true,
    manager: true,
    accepted: true,
    user: {
      id: loginUser.me.id,
      name: loginUser.me.name,
      email: loginUser.me.email,
    },
    group: {
      id: 0,
      name: "",
    },
    activation: true,
    loginUser: true,
  };
  if (members.length >= 1) {
    const activatedMembers = members.filter((member) => member.activation);
    const removeLoggedInUser = activatedMembers.filter(
      (member) => member.user.id !== loginUser.me.id
    );
    const isThereLoginUser = activatedMembers.find(
      (member) => member.user.id === loginUser.me.id
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
export const injectUsers = (
  weeks: OneDate[],
  loginUser: MeQuery,
  members: GroupMemberWithOptions[]
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
