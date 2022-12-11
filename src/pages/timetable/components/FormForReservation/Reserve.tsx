import { type PropsWithChildren } from 'react';
import FormForReservation from './FormForReservation';

const Reserve = () => {
  return (
    <div className="w-96 border px-4">
      <Navigation>
        <Tab>환자예약</Tab>
        <Tab>예약잠금</Tab>
      </Navigation>
      <FormForReservation />
    </div>
  );
};

export default Reserve;

const Navigation = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
};

const Tab = ({ children }: PropsWithChildren) => {
  return <button type="button">{children}</button>;
};
