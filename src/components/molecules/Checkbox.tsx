import { InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  register: UseFormRegisterReturn;
  type: 'checkbox' | 'radio';
  label?: string | null;
}

/**Input type "checkbox"나 "radio" 전용 컴포넌트 */
export const Checkbox = ({
  id,
  register,
  type,
  label,
  ...args
}: CheckboxProps) => {
  return (
    <label
      className="flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap"
      htmlFor={id}
    >
      <input
        id={id}
        {...args}
        {...register}
        type={type}
        className="check h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat py-1 transition duration-200 checked:border-green-600 checked:bg-green-600 checked:bg-check-white"
      />
      {label}
    </label>
  );
};
