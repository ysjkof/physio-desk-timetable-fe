import type { UseFormRegisterReturn } from "react-hook-form";

interface InputPriscriptionProps {
  label: string;
  placeholder: string;
  type: string;
  register: UseFormRegisterReturn;
  children?: React.ReactNode;
  step?: number;
}

export const InputPriscription = ({
  label,
  placeholder,
  register,
  type,
  children,
  step,
}: InputPriscriptionProps) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex">
        <label className="whitespace-nowrap py-0.5 text-sm">{label}</label>
        <div className="flex w-full">{children}</div>
      </div>
      <input
        className="input placeholder:text-sm"
        {...register}
        placeholder={placeholder}
        type={type}
        step={step}
        min={0}
        autoComplete="off"
      />
    </div>
  );
};
