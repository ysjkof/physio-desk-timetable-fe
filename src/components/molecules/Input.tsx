import { InputHTMLAttributes, ReactNode } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  register: UseFormRegisterReturn;
  label?: string | null;
  value?: any;
  children?: ReactNode;
}

export default function Input({
  label,
  id,
  placeholder,
  register,
  value,
  children,
  ...args
}: InputProps) {
  return (
    <label className="relative flex w-full flex-col gap-2" htmlFor={id}>
      {label}
      <input
        id={id}
        value={value}
        autoComplete="off"
        {...args}
        {...register}
        className="input"
      />
      {children}
    </label>
  );
}
