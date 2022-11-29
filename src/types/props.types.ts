import type { ReactNode } from 'react';
import type { DayWithUsers, IUserWithEvent } from './common.types';

// TimeTable
export interface IUserLength {
  userLength: number;
}

interface ILabels {
  labels: string[];
}

interface IDate {
  date: Date;
}

export interface TimetableTemplateProps {
  aside: ReactNode;
  nav: ReactNode;
  labels: ReactNode;
  columns: ReactNode;
}

export interface SchedulesProps extends ILabels {
  weekEvents: DayWithUsers[];
}

export interface DateTitleProps extends IUserLength, IDate {
  isToday: boolean;
  isSelectedMonth: boolean;
}
export interface MemberNameProps extends IUserLength {
  users: IUserWithEvent[];
  viewPeriodStyle: { gridTemplateColumns: string };
}

export interface ScheduleBoxProps extends MemberNameProps, ILabels, IDate {
  labelMaxLength: number;
  enableTimeIndicator: boolean;
}

export interface TimeLabelsProps extends ILabels {}
