import { TwoLabelSwitch } from '../../../../components';
import { toggleIsWeekCalendar, useStore } from '../../../../store';

const SwitchWeekViewButton = () => {
  const isWeekCalendar = useStore((state) => state.isWeekCalendar);

  const toggleWeekOrDay = () => {
    toggleIsWeekCalendar();
  };

  return (
    <TwoLabelSwitch
      labels={['하루', '주단위']}
      onClick={toggleWeekOrDay}
      isActivated={isWeekCalendar}
    />
  );
};

export default SwitchWeekViewButton;
