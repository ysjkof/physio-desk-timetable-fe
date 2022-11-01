import { ReactNode, TextareaHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string | null;
  id: string;
  register: UseFormRegisterReturn;
  value?: any;
  children?: ReactNode;
  rows?: number;
}

export default function Textarea({
  label,
  id,
  placeholder,
  register,
  value,
  children,
  rows,
  ...args
}: TextareaProps) {
  return (
    <label className="relative flex w-full flex-col gap-2" htmlFor={id}>
      {label}
      <textarea
        id={id}
        className="input"
        value={value}
        {...args}
        {...register}
      />
      {children}
    </label>
  );
}
