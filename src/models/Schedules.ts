import {
  eachDayOfInterval,
  isSameDay,
  nextSaturday,
  parseISO,
  setDay,
  startOfDay,
} from 'date-fns';
import { getMemberState } from '../utils/commonUtils';
import { isBeforeDateB } from '../utils/dateUtils';
import type {
  ISchedules,
  MemberOfClient,
  MemberWithEvent,
} from '../types/commonTypes';
import type {
  MemberOfGetReservationsByInterval,
  ReservationOfGetReservationsByInterval,
} from '../types/processedGeneratedTypes';

interface SchedulesProps {
  data: ReservationOfGetReservationsByInterval[];
  date: Date;
  members: MemberOfGetReservationsByInterval[];
}
export class Schedules {
  #value: ISchedules[];

  constructor({ data, date, members }: SchedulesProps) {
    const form = this.#createForm(date, members);
    this.#value = this.#addEventToForm(form, data);
  }

  get() {
    return this.#value;
  }

  getMembers(): MemberWithEvent[] {
    // console.log(
    //   'this.#value >>>',
    //   this.#value.find((v) => v.members.find((m) => m.user.name === '양석진'))
    // );
    // TODO: 멤버 고치기
    const initValue: MemberWithEvent[] = [];
    return this.#value.reduce((cur, acc) => {
      if (cur.length >= acc.members.length) return cur;
      return acc.members;
    }, initValue);
  }

  #createForm(
    date: Date,
    members: MemberOfGetReservationsByInterval[]
  ): ISchedules[] {
    const week = this.#createWeek(date);
    return week.map((date) => ({
      date,
      members: this.#createMembersForTable(members, date),
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
    members: MemberOfGetReservationsByInterval[],
    date: Date
  ): MemberWithEvent[] {
    const membersInRange = this.filterOutOfCreatedAt(members, date);
    const withoutLeftMember = this.filterLeftMember(membersInRange, date);
    const membersForTable = this.#filterWithoutWait(withoutLeftMember);

    return membersForTable.map(this.#addKeyToMember).sort((a, b) => {
      if (a.user.name > b.user.name) return 1;
      if (a.user.name < b.user.name) return -1;
      return 0;
    });
  }

  filterOutOfCreatedAt(
    members: MemberOfGetReservationsByInterval[],
    date: Date
  ) {
    return members.filter(
      ({ createdAt }) => startOfDay(new Date(createdAt)) <= date
    );
  }

  filterLeftMember(members: MemberOfGetReservationsByInterval[], date: Date) {
    return members.filter(
      ({ accepted, staying, manager, updatedAt }) =>
        !(
          getMemberState({ accepted, staying, manager }) === '탈퇴' &&
          isBeforeDateB(date, new Date(updatedAt))
        )
    );
  }

  #filterWithoutWait(members: MemberOfGetReservationsByInterval[]) {
    return members.filter(
      ({ accepted, staying, manager }) =>
        getMemberState({ accepted, staying, manager }) !== '수락대기'
    );
  }

  #addKeyToMember(member: MemberOfGetReservationsByInterval) {
    return { ...member, events: [] };
  }

  #addEventToForm(
    form: ISchedules[],
    events: ReservationOfGetReservationsByInterval[]
  ) {
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
