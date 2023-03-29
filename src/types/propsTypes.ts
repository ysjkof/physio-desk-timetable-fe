import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';
import type {
  CountListOfEachUser,
  GraphData,
  ISchedules,
  MemberWithEvent,
} from './commonTypes';
import type { FormForEditPrescriptionFields } from './formTypes';
import type {
  MemberOfGetMyClinic,
  PrescriptionForFind,
} from './processedGeneratedTypes';
import { UseFormRegisterReturn } from 'react-hook-form';
import { GetStatisticsQuery } from './generatedTypes';

// TimeTable
export interface UserLengthProps {
  userLength: number;
}

export interface LabelsProps {
  labels: string[];
}

interface IDate {
  date: Date;
}

export interface TimetableTemplateProps {
  nav: ReactNode;
  columns: ReactNode;
  eventList: ReactNode;
}

export interface SchedulesProps {
  weekEvents: ISchedules[];
}

export interface DateTitleProps extends IDate {
  isToday: boolean;
  isPickedMonth: boolean;
}
export interface MemberNameProps {
  members: MemberWithEvent[];
}

export interface ScheduleBoxProps
  extends MemberNameProps,
    LabelsProps,
    IDate,
    UserLengthProps {
  labelMaxLength: number;
  enableTimeIndicator: boolean;
}

export interface TableControllerProps {
  members: MemberWithEvent[];
}
export interface UserSelectorProps extends TableControllerProps {}

// Dashboard

export interface CardProps {
  clinicId: number;
  prescription: PrescriptionForFind;
  seeInactivation: boolean;
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

export interface UseFormForEditPrescriptionProps {
  defaultValues: FormForEditPrescriptionFields | undefined;
}

export interface ConfirmState {
  messages: string[];
  targetName: string;
  buttonText: string;
  confirmAction: () => void;
  icon?: ReactNode;
  hasCheck?: boolean;
  isPositive?: boolean;
}
export type ConfirmStateType = ConfirmState | undefined;
export interface ConfirmProps extends CloseAction, ConfirmState {}

export interface AlertProps {
  messages: string[];
  isPositive?: boolean;
}

export type AlertType = AlertProps | undefined;

export interface ToastProps {
  messages: string[];
  ms?: number;
}

export type ToastType = ToastProps | undefined;

export interface TogglePrescriptionActivationProps {
  id: number;
  name: string;
  isActive: boolean;
}

export interface ToggleEditMode {
  toggleEditMode: () => void;
}

export interface FormForEditEmailFields {
  email: string;
}

interface InputRegisterProps {
  register?: UseFormRegisterReturn;
}

export interface InputProps
  extends InputRegisterProps,
    InputHTMLAttributes<HTMLInputElement> {}

interface InputCommonPropsWithRegister {
  label: string;
  register: UseFormRegisterReturn;
}

export interface InputPropsWithRegister
  extends InputCommonPropsWithRegister,
    InputHTMLAttributes<HTMLInputElement> {}

export interface TextareaProps
  extends InputRegisterProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {}

interface ToggleUserIdProps {
  toggleUserId: (id: number) => void;
}
interface DisabledIds {
  disabledIds: Set<number>;
}
interface StatisticsUserIdProps extends ToggleUserIdProps, DisabledIds {
  toggleAllUser: () => void;
}

export interface TableChartProps extends StatisticsUserIdProps {
  countList: CountListOfEachUser | undefined;
  members: MemberOfGetMyClinic[];
}

export interface GraphChartProps extends DisabledIds {
  data: GetStatisticsQuery | undefined;
}
export interface DailyGraphDataProps {
  data: GraphData[] | undefined;
}

export interface DailyGraphProps extends DailyGraphDataProps {
  type: 'cancel' | 'newPatient' | 'noshow' | 'reservationCount';
}

export interface SchedulesColumnProps {
  schedules: ISchedules[];
}

export interface SchedulesColumnHeaderProps extends SchedulesColumnProps {
  schedules: ISchedules[];
}

export interface SchedulesColumnBodyProps
  extends SchedulesColumnProps,
    UserLengthProps {
  schedules: ISchedules[];
}
