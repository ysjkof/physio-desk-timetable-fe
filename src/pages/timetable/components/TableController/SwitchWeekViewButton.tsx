import { TwoLabelSwitch } from '../../../../components';
import { useTableDisplay } from '../../hooks';

const SwitchWeekViewButton = () => {
  const { tableDisplay, toggleDisplayOption } = useTableDisplay();
  const toggleWeekOrDay = () => {
    toggleDisplayOption('hasWeekView');
  };

  return (
    <TwoLabelSwitch
      labels={['하루', '주단위']}
      onClick={toggleWeekOrDay}
      isActivated={tableDisplay.hasWeekView}
    />
  );
};

export default SwitchWeekViewButton;
