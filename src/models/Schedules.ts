import {
  eachDayOfInterval,
  isSameDay,
  nextSaturday,
  parseISO,
  setDay,
} from 'date-fns';
import type {
  ISchedules,
  MemberOfClient,
  MemberWithEvent,
} from '../types/commonTypes';
import type {
  ClinicOfGetMyClinicTruth,
  ReservationInList,
} from '../types/processedGeneratedTypes';
import { getMemberState } from '../utils/commonUtils';

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

  #createForm(date: Date, clinic: ClinicOfGetMyClinicTruth): ISchedules[] {
    const week = this.#createWeek(date);
    return week.map((dateInWeek) => ({
      date: dateInWeek,
      members: this.#createMembersForTable(clinic),
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

  #createMembersForTable(clinic: ClinicOfGetMyClinicTruth): MemberWithEvent[] {
    const membersForTable = this.#removeWaitMember(clinic.members).map(
      this.#addKeyToMember
    );
    return membersForTable.sort((a, b) => {
      if (a.user.name > b.user.name) return 1;
      if (a.user.name < b.user.name) return -1;
      return 0;
    });
  }

  #removeWaitMember(members: MemberOfClient[]) {
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
