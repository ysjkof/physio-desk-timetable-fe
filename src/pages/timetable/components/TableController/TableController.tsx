import { useEffect } from 'react';
import DateController from './DateController';
import SwitchWeekViewButton from './SwitchWeekViewButton';
import SeeCalendarButton from './SeeCalendarButton';
import UserSelector from './UserSelector';
import PickedReservation from './ReservationForCopy';
import CreatePatientButton from './CreatePatientButton';
import ToggleSettingOfTimetable from './ToggleSettingOfTimetable';
import { toggleSettingOfTimetable } from '../../../../store';
import { ClinicSelector } from '../../../../components';
import { SearchPatientForm } from '../../../search/components';
import type { TableControllerProps } from '../../../../types/propsTypes';

const TableController = ({ members }: TableControllerProps) => {
  useEffect(() => {
    return () => toggleSettingOfTimetable(false);
  }, []);

  return (
    <div className="flex w-full flex-col justify-between bg-white">
      <div className="mb-1.5 flex w-full items-center justify-between border-b py-1">
        <DateController />
        <ClinicSelector />
        <div className="flex gap-2">
          <SwitchWeekViewButton />
          <SeeCalendarButton />
        </div>
      </div>
      <div className="flex w-full items-center gap-x-6 pb-3">
        <UserSelector members={members} />
        <PickedReservation />
        <div className="flex items-center justify-end gap-x-2">
          <SearchPatientForm />
          <CreatePatientButton />
          <ToggleSettingOfTimetable />
        </div>
      </div>
    </div>
  );
};

export default TableController;
