import type { UseFormRegisterReturn } from "react-hook-form";

interface InputPriscriptionProps {
  label: string;
  placeholder: string;
  type: string;
  register: UseFormRegisterReturn;
  required: boolean;
  children?: React.ReactNode;
  step?: number;
}

export const InputPriscription = ({
  label,
  placeholder,
  register,
  type,
  required,
  children,
  step,
}: InputPriscriptionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex">
        <label className="text-sm">{label}</label>
        {children}
      </div>
      <input
        className="input placeholder:text-sm"
        {...register}
        placeholder={placeholder}
        type={type}
        step={step}
        min={0}
        required={required}
        autoComplete="off"
      />
    </div>
  );
};
