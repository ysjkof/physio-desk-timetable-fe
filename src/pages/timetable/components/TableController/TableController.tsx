import { useEffect } from 'react';
import { useTableDisplay } from '../../hooks';
import DateController from './DateController';
import SwitchWeekViewButton from './SwitchWeekViewButton';
import SeeCalendarButton from './SeeCalendarButton';
import UserSelector from './UserSelector';
import ReservationForCopy from './ReservationForCopy';
import CreatePatientButton from './CreatePatientButton';
import DisplayControlButton from './DisplayControlButton';

const TableController = () => {
  const { toggleDisplayController } = useTableDisplay();

  useEffect(() => {
    return () => toggleDisplayController(false);
  }, []);

  return (
    <>
      <div className="mb-1.5 flex w-full items-center justify-between border-b py-1">
        <DateController />
        <div className="flex gap-2">
          <SwitchWeekViewButton />
          <SeeCalendarButton />
        </div>
      </div>
      <div className="flex w-full items-center gap-x-6 pb-3">
        <UserSelector />
        <ReservationForCopy />
        <div className="flex items-center justify-end gap-x-2">
          <CreatePatientButton />
          <DisplayControlButton />
        </div>
      </div>
    </>
  );
};

export default TableController;
