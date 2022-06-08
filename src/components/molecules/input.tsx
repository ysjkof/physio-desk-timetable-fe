import { HTMLInputTypeAttribute, ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string | null;
  name: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  type: HTMLInputTypeAttribute;
  required?: boolean;
  value?: any;
  autoFocus?: boolean;
  children?: ReactNode;
  step?: number;
  rows?: number;
}

export const Input = ({
  label,
  name,
  placeholder,
  register,
  type,
  required,
  value,
  autoFocus = false,
  children,
  step,
  rows,
}: InputProps) => {
  return (
    <label className="relative flex w-full flex-col gap-2" htmlFor={name}>
      {label}
      {type !== "textarea" ? (
        <input
          id={name}
          required={required}
          {...register}
          type={type}
          placeholder={placeholder}
          className="input"
          value={value}
          autoFocus={autoFocus}
          autoComplete="off"
          step={step}
        />
      ) : (
        <textarea
          id={name}
          required={required}
          {...register}
          placeholder={placeholder}
          className="input"
          value={value}
          autoFocus={autoFocus}
          rows={rows}
        />
      )}
      {children}
    </label>
  );
};
