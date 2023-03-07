import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { CheckableButton } from '../../../../components';
import {
  toggleShowCancelOfTimetable,
  toggleShowNoshowOfTimetable,
  useStore,
} from '../../../../store';
import { XMark } from '../../../../svgs';

export const ToggleShowButtons = () => {
  const user = useStore((state) => state.user);

  const showCancelOfTimetable = useStore(
    (state) => state.showCancelOfTimetable
  );

  const showNoshowOfTimetable = useStore(
    (state) => state.showNoshowOfTimetable
  );

  const toggleCancel = () => {
    toggleShowCancelOfTimetable(user, !showCancelOfTimetable);
  };

  const toggleNoshow = () => {
    toggleShowNoshowOfTimetable(user, !showNoshowOfTimetable);
  };

  return (
    <div className="flex flex-col items-center gap-4 border-b py-4">
      <CheckableButton
        label="취소"
        checked={showCancelOfTimetable}
        color="black"
        onClick={toggleCancel}
        icon={<XMark className="h-5 w-5" />}
        hasBorder
      />
      <CheckableButton
        label="부도"
        checked={showNoshowOfTimetable}
        color="black"
        onClick={toggleNoshow}
        icon={<FontAwesomeIcon icon={faExclamation} className="h-5 w-5" />}
        hasBorder
      />
    </div>
  );
};
