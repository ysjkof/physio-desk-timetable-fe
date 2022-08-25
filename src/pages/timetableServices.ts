import {
  DayWithUsers,
  IClinicList,
  IListReservation,
  IMember,
  IMemberWithActivate,
  IUserWithEvent,
} from '../types/type';
import { compareDateMatch } from '../services/dateServices';

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

export const checkMatchMinute = (
  date: Date | string,
  minutes: number[]
): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const targetMinute = targetDate.getMinutes();
  return minutes.includes(targetMinute);
};

export const makeUsersInDay = (members: IMember[], weeks: { date: Date }[]) => {
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

type UsersInDay = ReturnType<typeof makeUsersInDay>;
interface DistributeReservationInput {
  events: IListReservation[];
  dataForm: UsersInDay;
}

export const distributeReservation = ({
  events,
  dataForm,
}: DistributeReservationInput) => {
  events.forEach((event) => {
    const dateIndex = dataForm.findIndex((day) =>
      compareDateMatch(day.date, new Date(event.startDate), 'ymd')
    );
    if (dateIndex !== -1) {
      const userIndex = dataForm[dateIndex].users.findIndex(
        (member) => member.user.id === event.user.id
      );
      if (userIndex !== -1) {
        dataForm[dateIndex].users[userIndex].events.push(event);
      }
    }
  });
  return dataForm;
};

export const getActiveUserLength = (members?: IMemberWithActivate[]) =>
  members?.filter((user) => user.isActivate).length || 0;

export const getTableCellWidth = (userLength: number) => {
  const widthValue = 6;
  return userLength * widthValue;
};
export const getGridTemplateColumns = (repeat: number, minWidth?: number) => {
  return minWidth
    ? `repeat(${repeat}, minmax(${minWidth}rem, 1fr))`
    : `repeat(${repeat}, 1fr)`;
};
