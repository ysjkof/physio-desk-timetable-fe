import { useState } from "react";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Datepicker, IForm, IFormErrors } from "./datepicker";
import { InputOfDatepicker } from "./input-of-datepicker";

interface IDatepickerWithInputProps {
  setValue: UseFormSetValue<IForm>;
  register: UseFormRegister<IForm>;
  defaultDate: Date;
  see: "ymd-hm" | "ymd";
  dateType: "startDate" | "endDate" | "birthday";
  formError?: IFormErrors;
  textColor?: string;
}

export const DatepickerWithInput = ({
  setValue,
  register,
  defaultDate,
  see,
  dateType,
  formError,
  textColor,
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
        textColor={textColor}
      />
    </div>
  );
};
