import { HTMLInputTypeAttribute, ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string | null;
  name: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  type: HTMLInputTypeAttribute;
  required: boolean;
  value?: any;
  autoFocus?: boolean;
  children?: ReactNode;
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
}: InputProps) => {
  return (
    <label className="relative flex flex-col gap-2" htmlFor={name}>
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
          rows={8}
        />
      )}
      {children}
    </label>
  );
};
