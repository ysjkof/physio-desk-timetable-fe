import type { FieldError, UseFormRegister } from "react-hook-form";
import { DatepickerForm } from "./datepicker";
import { BirthdayInput } from "../organisms/create-patient";

interface IForm extends DatepickerForm, BirthdayInput {}
type AddFieldError<T> = {
  [P in keyof T]?: T[P] | FieldError;
};

export interface IFormErrors extends AddFieldError<IForm> {}

interface InputInDatepickerProps {
  register: UseFormRegister<IForm>;
  see: "ymd-hm" | "ymd";
  prefix: "startDate" | "endDate" | "birthday";
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  formError?: IFormErrors;
}

export const InputOfDatepicker = ({
  register,
  see,
  prefix,
  setOpen,
  formError,
}: InputInDatepickerProps) => {
  return (
    <div
      className={`relative grid w-full gap-1 ${
        see === "ymd-hm" ? "grid-cols-[1fr_repeat(4,_0.7fr)]" : ""
      } ${see === "ymd" ? "grid-cols-[1fr_repeat(2,_0.7fr)]" : ""}`}
      onFocus={() => (setOpen ? setOpen(true) : undefined)}
    >
      {prefix === "birthday" && formError?.birthdayYear?.message ? (
        <FormError errorMessage={formError.birthdayYear.message} isHighter />
      ) : formError?.birthdayMonth?.message ? (
        <FormError errorMessage={formError.birthdayMonth.message} isHighter />
      ) : formError?.birthdayDate?.message ? (
        <FormError errorMessage={formError.birthdayDate.message} isHighter />
      ) : null}
      {prefix === "startDate" && formError?.startDateYear?.message ? (
        <FormError errorMessage={formError.startDateYear.message} isHighter />
      ) : formError?.startDateMonth?.message ? (
        <FormError errorMessage={formError.startDateMonth.message} isHighter />
      ) : formError?.startDateDate?.message ? (
        <FormError errorMessage={formError.startDateDate.message} isHighter />
      ) : formError?.startDateHours?.message ? (
        <FormError errorMessage={formError.startDateHours.message} isHighter />
      ) : formError?.startDateMinutes?.message ? (
        <FormError
          errorMessage={formError.startDateMinutes.message}
          isHighter
        />
      ) : null}
      {prefix === "endDate" && formError?.endDateYear?.message ? (
        <FormError errorMessage={formError.endDateYear.message} isHighter />
      ) : formError?.endDateMonth?.message ? (
        <FormError errorMessage={formError.endDateMonth.message} isHighter />
      ) : formError?.endDateDate?.message ? (
        <FormError errorMessage={formError.endDateDate.message} isHighter />
      ) : formError?.endDateHours?.message ? (
        <FormError errorMessage={formError.endDateHours.message} isHighter />
      ) : formError?.endDateMinutes?.message ? (
        <FormError errorMessage={formError.endDateMinutes.message} isHighter />
      ) : null}
      <label className="relative flex flex-col">
        <span className="position-center-y absolute right-2">년</span>
        <input
          {...register(`${prefix}Year`, {
            required: "연도를 입력해주세요",
            minLength: { value: 4, message: "연도는 네 자릿수입니다" },
            maxLength: { value: 4, message: "연도는 네 자릿수입니다" },
            min: { value: 1920, message: "연도는 최소 1920년입니다" },
            max: {
              value: 2100,
              message: "연도는 최대 2100년입니다",
            },
          })}
          type="number"
          className="remove-number-arrow input-datepicker"
          placeholder="YYYY"
        />
      </label>
      <label className="relative flex flex-col">
        <span className="position-center-y absolute right-2">월</span>
        <input
          {...register(`${prefix}Month`, {
            required: "월을 입력해주세요",
            minLength: {
              value: 1,
              message: "월은 한 자리수에서 두 자리수입니다",
            },
            maxLength: {
              value: 2,
              message: "월은 한 자리수에서 두 자리수입니다",
            },
            min: { value: 1, message: "월의 최소값은 1입니다" },
            max: { value: 12, message: "월의 최대값은 12입니다" },
          })}
          type="number"
          className="remove-number-arrow input-datepicker"
          placeholder="MM"
        />
      </label>
      <label className="relative flex flex-col">
        <span className="position-center-y absolute right-2">일</span>
        <input
          {...register(`${prefix}Date`, {
            required: "날짜를 입력해주세요",
            minLength: {
              value: 1,
              message: "날짜는 한 자리수나 두 자리수입니다",
            },
            maxLength: {
              value: 2,
              message: "날짜는 한 자리수나 두 자리수입니다",
            },
            min: { value: 1, message: "날짜는 1부터 31입니다" },
            max: { value: 31, message: "날짜는 1부터 31입니다" },
          })}
          type="number"
          className="remove-number-arrow input-datepicker"
          placeholder="DD"
        />
      </label>
      {see === "ymd-hm" && prefix !== "birthday" && (
        <>
          <label className="relative flex flex-col">
            <span className="position-center-y absolute right-2">시</span>
            <input
              {...register(`${prefix}Hours`, {
                required: "시간을 입력해주세요",
                minLength: {
                  value: 1,
                  message: "시간은 한 자리수나 두 자리수입니다",
                },
                maxLength: {
                  value: 2,
                  message: "시간은 한 자리수나 두 자리수입니다",
                },
                min: { value: 1, message: "시간은 1부터 23입니다" },
                max: { value: 23, message: "시간은 1부터 23입니다" },
              })}
              type="number"
              className="remove-number-arrow input-datepicker"
              placeholder="HH"
            />
          </label>
          <label className="relative flex flex-col">
            <span className="position-center-y absolute right-2">분</span>
            <input
              {...register(`${prefix}Minutes`, {
                required: "분을 입력해주세요",
                minLength: {
                  value: 1,
                  message: "분은 한 자리수나 두 자리수입니다",
                },
                maxLength: {
                  value: 2,
                  message: "분은 한 자리수나 두 자리수입니다",
                },
                min: { value: 0, message: "분은 0부터 59입니다" },
                max: { value: 59, message: "분은 0부터 59입니다" },
              })}
              type="number"
              className="remove-number-arrow input-datepicker"
              placeholder="mm"
              minLength={1}
              maxLength={2}
              step={10}
            />
          </label>
        </>
      )}
    </div>
  );
};
