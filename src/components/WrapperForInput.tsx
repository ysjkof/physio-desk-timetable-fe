import { PropsWithChildren } from 'react';
import FormError from './FormError';
import { cls } from '../utils/common.utils';

interface InputWrapperProps extends PropsWithChildren {
  label: string;
  required?: boolean;
  error?: string | false;
  align?: 'row' | 'col';
}
const InputWrapper = ({
  children,
  label,
  required = false,
  error,
  align = 'row',
}: InputWrapperProps) => {
  const top = align === 'col' ? '0px' : undefined;

  return (
    <label
      htmlFor={`form-of-reserve__input-${label}`}
      className={cls(
        'input-wrapper relative flex min-h-[2.7rem] w-full justify-between text-base',
        align === 'row' ? 'items-center' : 'flex-col gap-1'
      )}
    >
      <span
        className={cls(
          'w-40 text-form-label',
          align === 'row' ? 'ml-5' : '',
          required
            ? 'before:absolute before:-left-2 before:ml-4 before:text-red-700 before:content-["*"]'
            : ''
        )}
      >
        {label}
      </span>
      <div className="relative w-full">{children}</div>
      {error && <FormError error={error} top={top} />}
    </label>
  );
};

export default InputWrapper;
