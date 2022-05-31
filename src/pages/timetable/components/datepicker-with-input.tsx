import { useState } from "react";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FormError } from "../../../components/form-error";
import { Datepicker, DatepickerForm } from "./datepicker";
import { IFormErrors, InputOfDatepicker } from "./input-of-datepicker";

interface IDatepickerWithInputProps {
  setValue: UseFormSetValue<DatepickerForm>;
  register: UseFormRegister<DatepickerForm>;
  defaultDate: Date;
  see: "ymd-hm" | "ymd";
  dateType: "startDate" | "endDate";
  formError: IFormErrors;
}

export const DatepickerWithInput = ({
  setValue,
  register,
  defaultDate,
  see,
  dateType,
  formError,
}: IDatepickerWithInputProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="datepicker-with-input flex w-full items-center gap-1">
      <Datepicker
        setValue={setValue}
        defaultDate={defaultDate}
        see={see}
        prefix={dateType}
        openState={{ open, setOpen }}
      />
      <InputOfDatepicker
        register={register}
        see={see}
        prefix={dateType}
        setOpen={setOpen}
        formError={formError}
      />
    </div>
  );
};
