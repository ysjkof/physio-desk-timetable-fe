import { ClassNameProps } from '../../../types/commonTypes';
import { cls } from '../../../utils/commonUtils';

interface FormErrorProps extends ClassNameProps {
  errorMessage: string;
  isHigher?: boolean;
}

export default function FormError({
  errorMessage,
  isHigher,
  className,
}: FormErrorProps) {
  return (
    <span
      className={cls(
        'absolute right-0 whitespace-nowrap rounded-md px-2 py-1 font-semibold text-red-400',
        isHigher ? '-top-7' : '-top-1',
        className || ''
      )}
    >
      {errorMessage}
    </span>
  );
}
