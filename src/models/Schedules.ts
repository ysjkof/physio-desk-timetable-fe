import {
  eachDayOfInterval,
  isSameDay,
  nextSaturday,
  parseISO,
  setDay,
  startOfDay,
} from 'date-fns';
import { getMemberState } from '../utils/commonUtils';
import { isPastDay } from '../utils/dateUtils';
import type {
  ISchedules,
  MemberOfClient,
  MemberWithEvent,
} from '../types/commonTypes';
import type {
  ClinicOfGetMyClinicTruth,
  ReservationInList,
} from '../types/processedGeneratedTypes';

interface SchedulesProps {
  data: ReservationInList[];
  date: Date;
  clinic: ClinicOfGetMyClinicTruth;
}
export class Schedules {
  #value: ISchedules[];

  constructor({ data, date, clinic }: SchedulesProps) {
    const form = this.#createForm(date, clinic);
    this.#value = this.#addEventToForm(form, data);
  }

  get() {
    return this.#value;
  }

  getMembers(): MemberWithEvent[] {
    const initValue: MemberWithEvent[] = [];
    return this.#value.reduce((cur, acc) => {
      if (cur.length >= acc.members.length) return cur;
      return acc.members;
    }, initValue);
  }

  #createForm(date: Date, clinic: ClinicOfGetMyClinicTruth): ISchedules[] {
    const week = this.#createWeek(date);
    return week.map((date) => ({
      date,
      members: this.#createMembersForTable(clinic, date),
    }));
  }

  #createWeek(date: Date) {
    return eachDayOfInterval(this.#getIntervalOfDate(date));
  }

  #getIntervalOfDate(date: Date) {
    const start = setDay(date, 0);
    const end = nextSaturday(start);
    return { start, end };
  }

  #createMembersForTable(
    clinic: ClinicOfGetMyClinicTruth,
    date: Date
  ): MemberWithEvent[] {
    const membersInRange = this.filterOutOfCreatedAt(clinic.members, date);
    const withoutLeftMember = this.filterLeftMember(membersInRange, date);
    const membersForTable = this.#filterWithoutWait(withoutLeftMember);

    return membersForTable.map(this.#addKeyToMember).sort((a, b) => {
      if (a.user.name > b.user.name) return 1;
      if (a.user.name < b.user.name) return -1;
      return 0;
    });
  }

  filterOutOfCreatedAt(members: MemberOfClient[], date: Date) {
    return members.filter(
      ({ createdAt }) => startOfDay(new Date(createdAt)) <= date
    );
  }

  filterLeftMember(members: MemberOfClient[], date: Date) {
    return members.filter(
      ({ accepted, staying, manager, updatedAt }) =>
        !(
          getMemberState({ accepted, staying, manager }) === '탈퇴' &&
          isPastDay(date, new Date(updatedAt))
        )
    );
  }

  #filterWithoutWait(members: MemberOfClient[]) {
    return members.filter(
      ({ accepted, staying, manager }) =>
        getMemberState({ accepted, staying, manager }) !== '수락대기'
    );
  }

  #addKeyToMember(member: MemberOfClient) {
    return { ...member, events: [] };
  }

  #addEventToForm(form: ISchedules[], events: ReservationInList[]) {
    const result = form;
    events.forEach((event) => {
      const dateIndex = result.findIndex((day) =>
        isSameDay(day.date, parseISO(event.startDate))
      );
      if (dateIndex === -1) return;

      const userIndex = result[dateIndex].members.findIndex(
        (member) => member.user.id === event.user.id
      );
      if (userIndex === -1) return;

      result[dateIndex].members[userIndex].events.push(event);
    });
    return result;
  }
}
