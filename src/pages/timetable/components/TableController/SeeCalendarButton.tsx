import { useRef } from 'react';
import { Calendar } from '../../../../svgs';
import { Datepicker, MenuButton, Modal } from '../../../../components';
import { getPositionRef } from '../../../../utils/commonUtils';
import {
  setPickedDate,
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

  const pickedDate = useStore((state) => state.pickedDate);
  const setDate = (date: Date) => {
    setPickedDate(date);
  };

  return (
    <>
      <MenuButton
        onClick={toggleCalender}
        isActive={showCalendarOfTimetable}
        ref={buttonRef}
        hasBorder
      >
        <Calendar />
        달력보기
      </MenuButton>
      {showCalendarOfTimetable && (
        <Modal top={top} right={10} closeAction={toggleCalender}>
          <Datepicker
            selectedDate={pickedDate}
            selectDate={setDate}
            closeAction={toggleCalender}
          />
        </Modal>
      )}
    </>
  );
};

export default SeeCalendarButton;
