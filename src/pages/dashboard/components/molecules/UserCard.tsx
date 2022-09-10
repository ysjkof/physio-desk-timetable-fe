import { ChildrenProps } from '../../../../types/type';
import { cls, getMemberState } from '../../../../utils/utils';

function Container({ children }: ChildrenProps) {
  return <div className="flex flex-wrap gap-y-14">{children}</div>;
}

interface UserCardProps {
  name: string;
  state?: ReturnType<typeof getMemberState>;
  size?: 'lg' | 'base';
  button?: React.ReactNode;
}

function UserCard({ name, state, size = 'base', button }: UserCardProps) {
  return (
    <div
      className={cls(
        'grid h-fit min-w-[340px] grid-cols-[6rem,auto] overflow-hidden py-2',
        state === '관리자' ? '-order-1' : ''
      )}
    >
      <div className="flex items-center justify-center self-center overflow-hidden">
        <div
          className={cls(
            'flex items-center justify-center rounded-full border border-green-500 bg-green-300 bg-person font-bold',
            size === 'lg' ? 'h-20 w-20 text-2xl' : 'h-16 w-16 text-base'
          )}
        />
      </div>
      <div className="relative flex flex-col">
        <p className="text-base font-medium">{name}</p>
        <p>{state}</p>
        {button && <div className="absolute top-0 right-0">{button}</div>}
      </div>
    </div>
  );
}

UserCard.Container = Container;

export default UserCard;
