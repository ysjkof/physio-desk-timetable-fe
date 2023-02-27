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
import type { PrescriptionForFind } from './processedGeneratedTypes';
import { UseFormRegisterReturn } from 'react-hook-form';
import { GetStatisticsQuery } from './generatedTypes';

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
  isPickedMonth: boolean;
}
export interface MemberNameProps extends IUserLength {
  members: MemberWithEvent[];
}

export interface ScheduleBoxProps extends MemberNameProps, ILabels, IDate {
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
  showInactivate: boolean;
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

export interface TogglePrescriptionActivateProps {
  id: number;
  name: string;
  activate: boolean;
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
interface StatisticsUserIdProps extends ToggleUserIdProps, DisabledIds {}

export interface TableChartProps extends StatisticsUserIdProps {
  countList: CountListOfEachUser | undefined;
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
