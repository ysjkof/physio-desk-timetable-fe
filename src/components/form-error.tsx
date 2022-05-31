interface FormErrorProps {
  errorMessage: string;
  isHighter?: boolean;
}

export const FormError = ({ errorMessage, isHighter }: FormErrorProps) => (
  <span className={`form-error ${isHighter ? "-top-7" : "-top-1"}`}>
    {errorMessage}
  </span>
);
