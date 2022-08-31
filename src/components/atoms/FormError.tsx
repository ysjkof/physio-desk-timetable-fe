import { cls } from '../../utils/utils';

interface FormErrorProps {
  errorMessage: string;
  isHighter?: boolean;
}

export const FormError = ({ errorMessage, isHighter }: FormErrorProps) => (
  <span className={cls('form-error', isHighter ? '-top-7' : '-top-1')}>
    {errorMessage}
  </span>
);
