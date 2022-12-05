import { PropsWithChildren } from 'react';

interface InputWrapperProps extends PropsWithChildren {
  label: string;
  required?: boolean;
}
const InputWrapper = ({
  label,
  required = false,
  children,
}: InputWrapperProps) => {
  return (
    <label
      htmlFor={`form-of-reserve__input-${label}`}
      className="input-wrapper flex w-full items-center justify-between text-base"
    >
      <span className="w-40 text-center font-bold text-form-label">
        {required && <span className="mr-0.5 text-red-700">*</span>}
        {label}
      </span>
      <div className="relative w-full">{children}</div>
    </label>
  );
};

export default InputWrapper;
