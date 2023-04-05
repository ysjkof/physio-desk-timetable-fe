import { cls } from '../utils/commonUtils';

interface FormErrorProps {
  error: string;
  top?: string;
  textAlign?: 'left' | 'right' | 'center';
}

export default function FormError(props: FormErrorProps) {
  const { error, top, textAlign = 'right' } = props;
  return (
    <span
      className={cls(
        'absolute left-0 top-10 w-full whitespace-nowrap rounded-md px-2 py-1 text-xs text-red-400'
      )}
      style={{ top, textAlign }}
    >
      {error}
    </span>
  );
}
