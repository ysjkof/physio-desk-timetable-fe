import {
  forwardRef,
  type MutableRefObject,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { cls } from '../../../../utils/commonUtils';

interface InputCommonProps {
  label: string;
  register: UseFormRegisterReturn;
}

interface InputProps
  extends InputCommonProps,
    InputHTMLAttributes<HTMLInputElement> {}

interface TextareaProps
  extends InputCommonProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Input = ({ label, register, ...args }: InputProps) => {
  return (
    <input
      {...args}
      {...register}
      id={`form-of-reserve__input-${label}`}
      className={cls(
        'w-full rounded-md border py-2 px-3 placeholder:text-sm',
        args.className || ''
      )}
    />
  );
};

const InputWithRef = forwardRef<HTMLInputElement, InputProps>(
  ({ label, register, ...args }, ref) => {
    const { ref: refOfRegister, ...rest } = register;
    return (
      <input
        {...args}
        id={`form-of-reserve__input-${label}`}
        className={cls(
          'w-full rounded-md border py-2 px-3 placeholder:text-sm',
          args.className || ''
        )}
        {...rest}
        ref={(element) => {
          // share ref
          // register가 ref를 사용하기 때문에 share ref해야 forwardRef의 ref에 접근할 수 있다.
          if (!element) {
            return element;
          }
          refOfRegister(element);
          // eslint-disable-next-line no-param-reassign
          (ref as MutableRefObject<HTMLInputElement>).current = element;
        }}
      />
    );
  }
);

InputWithRef.displayName = 'InputRefWrapper';

const Textarea = ({ label, register, ...args }: TextareaProps) => {
  return (
    <textarea
      {...args}
      {...register}
      id={`form-of-reserve__input-${label}`}
      className="w-full rounded-md border py-2 px-3 placeholder:text-sm"
    />
  );
};

export { Input, InputWithRef, Textarea };
