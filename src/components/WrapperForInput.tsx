import { PropsWithChildren } from 'react';
import FormError from './FormError';
import { cls } from '../utils/common.utils';

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
      <span
        className={cls(
          'ml-5 w-40 font-bold text-form-label',
          required
            ? 'before:absolute before:-left-2 before:ml-4 before:text-red-700 before:content-["*"]'
            : ''
        )}
      >
        {label}
      </span>
      <div className="relative w-full">{children}</div>
      {error && <FormError error={error} />}
    </label>
  );
};

export default InputWrapper;
