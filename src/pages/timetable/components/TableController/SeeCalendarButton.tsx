import { useRef } from 'react';
import { Calendar } from '../../../../svgs';
import { Datepicker, MenuButton, Modal } from '../../../../components';
import { useTableDisplay } from '../../hooks';
import { getPositionRef } from '../../../../utils/common.utils';
import { selectedDateVar } from '../../../../store';

const SeeCalendarButton = () => {
  const { tableDisplay, toggleDisplayOption } = useTableDisplay();
  const toggleCalender = () => {
    toggleDisplayOption('seeCalendar');
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const { top } = getPositionRef(buttonRef);

  const setDate = (date: Date) => {
    selectedDateVar(date);
  };

  return (
    <>
      <MenuButton
        onClick={toggleCalender}
        isActivated={tableDisplay.seeCalendar}
        ref={buttonRef}
        hasBorder
      >
        <Calendar />
        달력보기
      </MenuButton>
      {tableDisplay.seeCalendar && (
        <Modal top={top} right={10} closeAction={toggleCalender}>
          <Datepicker closeAction={toggleCalender} setDate={setDate} />
        </Modal>
      )}
    </>
  );
};

export default SeeCalendarButton;
