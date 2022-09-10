import { ChildrenProps } from '../../../../types/type';
import { cls, getMemberState } from '../../../../utils/utils';

function CardContainer({ children }: ChildrenProps) {
  return <div className="flex flex-wrap gap-y-14">{children}</div>;
}

interface CardProps {
  name: string;
  state?: ReturnType<typeof getMemberState>;
  size?: 'lg' | 'base';
  button?: React.ReactNode;
}

function Card({ name, state, size = 'base', button }: CardProps) {
  return (
    <div
      className={cls(
        'grid h-fit min-w-[340px] grid-cols-[6rem,auto] overflow-hidden py-2',
        state === '관리자' ? '-order-1' : ''
      )}
    >
      <div className="flex items-center justify-center self-center overflow-hidden">
        <img
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

Card.Container = CardContainer;

export default Card;
