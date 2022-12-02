import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StateBadge from '../../../../_legacy_components/atoms/StateBadge';
import CardContainer from '../../../../_legacy_components/templates/CardContainer';
import { cls, StayingState } from '../../../../utils/common.utils';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    PropsWithChildren {
  loading?: boolean;
}

export function Button({ loading, children, ...args }: ButtonProps) {
  return (
    <div className="flex h-full w-full items-center border-t">
      <button
        {...args}
        className={cls(
          'flex w-full items-center justify-center hover:cursor-pointer hover:font-semibold',
          loading ? 'pointer-events-none' : ''
        )}
        type="button"
      >
        {loading ? (
          <FontAwesomeIcon
            icon={faSpinner}
            fontSize={16}
            className="absolute mx-auto animate-spin"
          />
        ) : (
          children
        )}
      </button>
    </div>
  );
}

interface UserCardProps {
  name: string;
  state: StayingState;
  size?: 'lg' | 'base';
  button?: React.ReactNode;
}

function UserCard({ name, state, size = 'base', button }: UserCardProps) {
  return (
    <div
      className={cls(
        'grid h-fit w-80 grid-cols-[5rem,auto] overflow-hidden rounded-md border',
        state === '관리자' ? '-order-1' : ''
      )}
    >
      <div className="flex items-center justify-center self-center overflow-hidden border-r py-2">
        <div
          className={cls(
            'flex items-center justify-center rounded-full border border-green-500 bg-green-300 bg-person font-bold',
            size === 'lg' ? 'h-20 w-20 text-2xl' : 'h-16 w-16 text-base'
          )}
        />
      </div>
      <div className="relative flex flex-col justify-end overflow-hidden">
        <p className="ml-2 basis-6 overflow-hidden text-ellipsis whitespace-nowrap text-base font-medium">
          {name}
        </p>
        <StateBadge state={state} className="mb-1.5" />
        <div className="basis-6">{button}</div>
      </div>
    </div>
  );
}

UserCard.Button = Button;
UserCard.Container = CardContainer;

export default UserCard;
