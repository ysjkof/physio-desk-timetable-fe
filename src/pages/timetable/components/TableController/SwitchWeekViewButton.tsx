import { TwoLabelSwitch } from '../../../../components';
import { toggleIsWeekCalendar, useStore } from '../../../../store';

const SwitchWeekViewButton = () => {
  const isWeekCalendar = useStore((state) => state.isWeekCalendar);

  const toggleWeekOrDay = () => {
    toggleIsWeekCalendar(!isWeekCalendar);
  };

  return (
    <TwoLabelSwitch
      labels={['하루', '주단위']}
      onClick={toggleWeekOrDay}
      isActive={isWeekCalendar}
    />
  );
};

export default SwitchWeekViewButton;
