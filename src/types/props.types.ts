import type { ReactNode } from 'react';
import { PrescriptionListProps } from '../pages/legacy_dashboard/components/organisms/PrescriptionPage';
import type { ISchedules, UserWithEvent } from './common.types';
import { FindPrescriptionsQuery } from './generated.types';

// TimeTable
export interface IUserLength {
  userLength: number;
}

export interface ILabels {
  labels: string[];
}

interface IDate {
  date: Date;
}

export interface TimetableTemplateProps {
  nav: ReactNode;
  labels: ReactNode;
  columns: ReactNode;
}

export interface SchedulesProps extends ILabels {
  weekEvents: ISchedules[];
}

export interface DateTitleProps extends IUserLength, IDate {
  isToday: boolean;
  isSelectedMonth: boolean;
}
export interface MemberNameProps extends IUserLength {
  users: UserWithEvent[];
  viewPeriodStyle: { gridTemplateColumns: string };
}

export interface ScheduleBoxProps extends MemberNameProps, ILabels, IDate {
  labelMaxLength: number;
  enableTimeIndicator: boolean;
}

// Dashboard

export type PrescriptionForFind = NonNullable<
  FlatArray<FindPrescriptionsQuery['findPrescriptions']['prescriptions'], 1>
>;

export interface CardProps extends Pick<PrescriptionListProps, 'clinicId'> {
  prescription: PrescriptionForFind;
}

// Common

export interface CloseAction {
  closeAction: () => void;
}

export interface UseAutoCompleteProps<T> {
  firstButtonId: string;
  setInput: (value: T | null) => void;
  clearList?: () => void;
  query?: (query: string) => void;
  initialValue?: T | null;
}

export interface DatepickerProps extends Partial<CloseAction> {
  selectedDate: Date;
  selectDate: (date: Date) => void;
  disablePreviousDay?: boolean;
}

export interface FormForReservationProps extends CloseAction {
  date: Date;
  userId: number;
}

export interface FormForDayoffProps extends FormForReservationProps {}
