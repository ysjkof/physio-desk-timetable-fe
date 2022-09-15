import { cls } from '../../utils/utils';

interface FormErrorProps {
  errorMessage: string;
  isHighter?: boolean;
}

export default function FormError({ errorMessage, isHighter }: FormErrorProps) {
  return (
    <span className={cls('form-error', isHighter ? '-top-7' : '-top-1')}>
      {errorMessage}
    </span>
  );
}
