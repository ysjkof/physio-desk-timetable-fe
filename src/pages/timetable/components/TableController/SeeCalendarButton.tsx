import { useRef } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Calendar } from '../../../../svgs';
import { Datepicker, MenuButton, Modal } from '../../../../components';
import { getPositionRef } from '../../../../utils/common.utils';
import {
  selectedDateVar,
  toggleShowCalendarOfTimetable,
  useStore,
} from '../../../../store';

const SeeCalendarButton = () => {
  const showCalendarOfTimetable = useStore(
    (state) => state.showCalendarOfTimetable
  );

  const toggleCalender = () => {
    toggleShowCalendarOfTimetable();
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const { top } = getPositionRef(buttonRef);

  const selectedDate = useReactiveVar(selectedDateVar);
  const setDate = (date: Date) => {
    selectedDateVar(date);
  };

  return (
    <>
      <MenuButton
        onClick={toggleCalender}
        isActivated={showCalendarOfTimetable}
        ref={buttonRef}
        hasBorder
      >
        <Calendar />
        달력보기
      </MenuButton>
      {showCalendarOfTimetable && (
        <Modal top={top} right={10} closeAction={toggleCalender}>
          <Datepicker
            selectedDate={selectedDate}
            selectDate={setDate}
            closeAction={toggleCalender}
          />
        </Modal>
      )}
    </>
  );
};

export default SeeCalendarButton;
