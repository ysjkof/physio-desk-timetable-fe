import {
  DayWithUsers,
  IClinicList,
  IMember,
  IUserWithEvent,
} from '../types/type';

export const spreadClinicMembers = (
  clinics: IClinicList[] | null,
  clinicId: number
) => {
  const result: IMember[] = [];
  const clinic = clinics?.find((clinic) => clinic.id === clinicId);
  if (clinic) {
    const newMember = clinic.members.map((member) => member);
    result.push(...newMember);
  }
  return result.sort((a, b) => {
    if (a.user.name > b.user.name) return 1;
    if (a.user.name < b.user.name) return -1;
    return 0;
  });
};

export const compareNumAfterGetMinutes = (
  date: Date,
  compareNumbers: number[]
): boolean => {
  const minutes = date.getMinutes();
  return compareNumbers.includes(minutes);
};

export const makeDayWithUsers = (
  members: IMember[],
  weeks: { date: Date }[]
) => {
  const result: DayWithUsers[] = [];
  function makeNewUsers(): IUserWithEvent[] {
    return members.map((user) => ({ ...user, events: [] }));
  }
  weeks.forEach((day) => {
    result.push({
      ...day,
      users: makeNewUsers(),
    });
  });
  return result;
};
