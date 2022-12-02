import type { ReactNode } from 'react';
import { PrescriptionListProps } from '../pages/dashboard/components/organisms/PrescriptionPage';
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
  aside: ReactNode;
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

export interface CardProps extends Pick<PrescriptionListProps, 'clinicId'> {
  prescription: NonNullable<
    FlatArray<FindPrescriptionsQuery['findPrescriptions']['prescriptions'], 1>
  >;
}

// Common

export interface CloseAction {
  closeAction: () => void;
}
