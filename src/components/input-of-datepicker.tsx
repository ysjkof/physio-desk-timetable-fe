import type { UseFormRegister } from "react-hook-form";
import { cls } from "../libs/utils";
import { DatepickerForm } from "./datepicker";

interface InputInDatepickerProps {
  register: UseFormRegister<DatepickerForm>;
  see: "ymd-hm" | "ymd";
  prefix: "startDate" | "endDate";
  openState: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export const InputOfDatepicker = ({
  register,
  see,
  prefix,
  openState: { open, setOpen },
}: InputInDatepickerProps) => {
  return (
    <div
      className={cls(
        "grid w-full gap-1",
        see === "ymd-hm" ? "grid-cols-[1fr_repeat(4,_0.7fr)]" : "",
        see === "ymd" ? "grid-cols-[1fr_repeat(2,_0.7fr)]" : ""
      )}
      onFocus={() => setOpen(true)}
    >
      <label className="relative flex flex-col">
        <span className="absolute right-2 bottom-1 text-xs text-gray-500">
          년
        </span>
        <input
          {...register(`${prefix}Year`, {
            required: "연도를 입력해주세요.",
            minLength: 4,
            maxLength: 4,
            min: 2000,
            max: 2100,
          })}
          type="number"
          className="remove-number-arrow input-number"
          placeholder="YYYY"
        />
      </label>
      <label className="relative flex flex-col">
        <span className="absolute right-2 bottom-1 text-xs text-gray-500">
          월
        </span>
        <input
          {...register(`${prefix}Month`, {
            required: "월을 입력해주세요.",
            minLength: 1,
            maxLength: 2,
            min: 1,
            max: 12,
          })}
          type="number"
          className="remove-number-arrow input-number"
          placeholder="MM"
        />
      </label>
      <label className="relative flex flex-col">
        <span className="absolute right-2 bottom-1 text-xs text-gray-500">
          일
        </span>
        <input
          {...register(`${prefix}Date`, {
            required: "날짜를 입력해주세요.",
            minLength: 1,
            maxLength: 2,
            min: 1,
            max: 31,
          })}
          type="number"
          className="remove-number-arrow input-number"
          placeholder="DD"
        />
      </label>
      {see === "ymd-hm" && (
        <label className="relative flex flex-col">
          <span className="absolute right-2 bottom-1 text-xs text-gray-500">
            시
          </span>
          <input
            {...register(`${prefix}Hours`, {
              required: "시간을 입력해주세요.",
              minLength: 1,
              maxLength: 2,
              min: 1,
              max: 23,
            })}
            type="number"
            className="remove-number-arrow input-number"
            placeholder="HH"
          />
        </label>
      )}
      {see === "ymd-hm" && (
        <label className="relative flex flex-col">
          <span className="absolute right-2 bottom-1 text-xs text-gray-500">
            분
          </span>
          <input
            {...register(`${prefix}Minutes`, {
              required: "분을 입력해주세요.",
              minLength: 1,
              maxLength: 2,
              max: 59,
              min: 0,
            })}
            type="number"
            className="remove-number-arrow input-number"
            placeholder="mm"
            minLength={1}
            maxLength={2}
            step={10}
          />
        </label>
      )}
    </div>
  );
};
