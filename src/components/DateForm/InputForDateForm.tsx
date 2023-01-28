import { type InputHTMLAttributes } from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';

interface InputForDateFormProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegisterReturn;
}

export const InputForDateForm = ({
  label,
  register,
  ...args
}: InputForDateFormProps) => {
  return (
    <label
      className="relative flex flex-col"
      htmlFor={`datepicker-input__input${label}`}
    >
      <span className="position-center-y absolute right-2 text-xs text-gray-500">
        {label}
      </span>
      <input {...args} id={`datepicker-input__input${label}`} {...register} />
    </label>
  );
};
