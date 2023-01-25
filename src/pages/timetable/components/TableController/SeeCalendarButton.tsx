import { Calendar } from '../../../../svgs';
import { MenuButton } from '../../../../components';
import { useTableDisplay } from '../../hooks';

const SeeCalendarButton = () => {
  const { tableDisplay, toggleDisplayOption } = useTableDisplay();
  const toggleCalender = () => {
    toggleDisplayOption('seeCalendar');
  };

  return (
    <MenuButton onClick={toggleCalender} isActivated={tableDisplay.seeCalendar}>
      <Calendar />
      달력보기
    </MenuButton>
  );
};

export default SeeCalendarButton;
