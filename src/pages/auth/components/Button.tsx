import type { ButtonHTMLAttributes } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cls } from '../../../utils/commonUtils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  canClick: boolean | null | undefined;
  loading: boolean;
  isSmall?: boolean;
  isWidthFull?: boolean;
}

export default function Button({
  canClick,
  loading,
  isSmall,
  isWidthFull,
  ...args
}: ButtonProps) {
  return (
    <button
      type="button"
      {...args}
      className={cls(
        'flex items-center justify-center rounded-md bg-green-600 py-1 px-2 tracking-widest text-white transition-colors focus:outline-none',
        isSmall ? 'text-xs' : 'text-base',
        isWidthFull ? 'w-full' : '',
        canClick ? 'bg-green-600' : 'pointer-events-none opacity-50',
        args.className || ''
      )}
    >
      {loading ? (
        <FontAwesomeIcon
          icon={faSpinner}
          fontSize={16}
          className="absolute mx-auto animate-spin"
        />
      ) : (
        '로그인'
      )}
      <span
        className={cls('whitespace-nowrap', loading ? 'text-transparent' : '')}
      />
    </button>
  );
}
