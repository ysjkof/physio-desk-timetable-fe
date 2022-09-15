import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { cls } from '../../utils/utils';

interface ButtonProps {
  canClick: boolean | null;
  loading: boolean;
  children: ReactNode;
  isSmall?: boolean;
  isWidthFull?: boolean;
  type?: 'button' | 'reset' | 'submit';
  onClick?: () => void;
}

export default function Button({
  canClick,
  loading,
  children,
  isSmall,
  isWidthFull,
  type = 'button',
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cls(
        'flex items-center justify-center rounded-md bg-green-600 py-1 px-2 tracking-widest text-white transition-colors focus:outline-none',
        isSmall ? 'text-xs' : 'text-base',
        isWidthFull ? 'w-full' : '',
        canClick ? 'bg-green-600' : 'pointer-events-none opacity-50'
      )}
      onClick={onClick}
    >
      {loading ? (
        <FontAwesomeIcon
          icon={faSpinner}
          fontSize={16}
          className="absolute mx-auto animate-spin"
        />
      ) : (
        ''
      )}
      <span
        className={cls('whitespace-nowrap', loading ? 'text-transparent' : '')}
      >
        {children}
      </span>
    </button>
  );
}
