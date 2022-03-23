import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string | null;
  name: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  type: string;
  required: boolean;
  kind?: "text" | "search";
  value?: any;
}

export const Input = ({
  label,
  name,
  placeholder,
  register,
  type,
  required,
  kind = "text",
  value,
}: InputProps) => {
  return (
    <>
      {label ? (
        <label
          className="mb-1 block text-sm font-medium text-gray-700"
          htmlFor={name}
        >
          {label}
        </label>
      ) : null}
      {kind === "text" ? (
        <div className="relative flex items-center rounded-md shadow-sm">
          <input
            id={name}
            required={required}
            {...register}
            type={type}
            placeholder={placeholder}
            className="input"
            value={value}
          />
        </div>
      ) : null}
    </>
  );
};
