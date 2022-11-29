import {
  eachDayOfInterval,
  isSameDay,
  nextSaturday,
  parseISO,
  setDay,
} from 'date-fns';
import { ClinicsOfClient } from './ClinicsOfClient';
import type {
  ISchedules,
  Reservation,
  MemberOfClient,
} from '../types/common.types';

export class Schedules {
  #value: ISchedules[];
  #clinic = ClinicsOfClient.selectedClinic;

  constructor(data: Reservation[], date: Date) {
    if (!this.#clinic)
      throw new Error('selectedClinic이 없습니다.', {
        cause: ' 초기화가 되지 않았습니다.',
      });

    const form = this.#createForm(date);
    this.#value = this.#addEventToForm(form, data);
  }

  get value() {
    return this.#value;
  }

  #createForm(date: Date) {
    const week = this.#createWeek(date);
    return week.map((date) => ({
      date,
      users: this.#createMembersForTable(),
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

  #createMembersForTable() {
    const membersForTable = this.#clinic.members.map(this.#addKeyToMember);
    return membersForTable.sort((a, b) => {
      if (a.user.name > b.user.name) return 1;
      if (a.user.name < b.user.name) return -1;
      return 0;
    });
  }

  #addKeyToMember(member: MemberOfClient) {
    return { ...member, events: [] };
  }

  #addEventToForm(form: ISchedules[], events: Reservation[]) {
    const result = form;
    events.forEach((event) => {
      const dateIndex = result.findIndex((day) =>
        isSameDay(day.date, parseISO(event.startDate))
      );
      if (dateIndex === -1) return;

      const userIndex = result[dateIndex].users.findIndex(
        (member) => member.user.id === event.user.id
      );
      if (userIndex === -1) return;

      result[dateIndex].users[userIndex].events.push(event);
    });
    return result;
  }
}
