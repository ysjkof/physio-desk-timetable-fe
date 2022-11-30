import { ClassNameProps } from '../../types/common.types';
import { cls } from '../../utils/common.utils';

interface FormErrorProps extends ClassNameProps {
  errorMessage: string;
  isHighter?: boolean;
}

export default function FormError({
  errorMessage,
  isHighter,
  className,
}: FormErrorProps) {
  return (
    <span
      className={cls(
        'absolute right-0 whitespace-nowrap rounded-md px-2 py-1 font-semibold text-red-400',
        isHighter ? '-top-7' : '-top-1',
        className || ''
      )}
    >
      {errorMessage}
    </span>
  );
}
