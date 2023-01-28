import { PropsWithChildren } from 'react';
import FormError from './FormError';

interface InputWrapperProps extends PropsWithChildren {
  label: string;
  required?: boolean;
  error?: string | false;
}
const InputWrapper = ({
  label,
  required = false,
  children,
  error,
}: InputWrapperProps) => {
  return (
    <label
      htmlFor={`form-of-reserve__input-${label}`}
      className="input-wrapper relative flex min-h-[2.7rem] w-full items-center justify-between text-base"
    >
      <span className="w-40 text-center font-bold text-form-label">
        {required && <span className="mr-0.5 text-red-700">*</span>}
        {label}
      </span>
      <div className="relative w-full">{children}</div>
      {error && <FormError error={error} />}
    </label>
  );
};

export default InputWrapper;
