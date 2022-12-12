import { ButtonHTMLAttributes, useState, type PropsWithChildren } from 'react';
import { IsActive } from '../../../../types/common.types';
import { cls } from '../../../../utils/common.utils';
import { FormForReservation } from '../FormForReservation';

const ReserveOrDayoff = () => {
  const [isReserve, setIsReserve] = useState(true);

  const seeReserve = () => setIsReserve(true);
  const seeDayoff = () => setIsReserve(false);

  return (
    <div className="w-96 border">
      <Navigation>
        <Tab isActive={isReserve} onClick={seeReserve}>
          환자예약
        </Tab>
        <Tab isActive={!isReserve} onClick={seeDayoff}>
          예약잠금
        </Tab>
      </Navigation>
      <FormForReservation />
    </div>
  );
};

export default ReserveOrDayoff;

const Navigation = ({ children }: PropsWithChildren) => {
  return <div className="flex">{children}</div>;
};

interface TapProps
  extends PropsWithChildren,
    IsActive,
    ButtonHTMLAttributes<HTMLButtonElement> {}

const Tab = ({ isActive, children, ...args }: TapProps) => {
  return (
    <button
      className={cls(
        'h-14 w-full text-xl font-medium ',

        isActive ? 'text-cst-blue' : 'bg-table-bg text-font-gray'
      )}
      type="button"
      {...args}
    >
      {children}
    </button>
  );
};
