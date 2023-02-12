import { useEffect } from 'react';
import DateController from './DateController';
import SwitchWeekViewButton from './SwitchWeekViewButton';
import SeeCalendarButton from './SeeCalendarButton';
import UserSelector from './UserSelector';
import PickedReservation from './ReservationForCopy';
import CreatePatientButton from './CreatePatientButton';
import ToggleSettingOfTimetable from './ToggleSettingOfTimetable';
import { toggleSettingOfTimetable } from '../../../../store';

const TableController = () => {
  useEffect(() => {
    return () => toggleSettingOfTimetable(false);
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
        <PickedReservation />
        <div className="flex items-center justify-end gap-x-2">
          <CreatePatientButton />
          <ToggleSettingOfTimetable />
        </div>
      </div>
    </>
  );
};

export default TableController;
