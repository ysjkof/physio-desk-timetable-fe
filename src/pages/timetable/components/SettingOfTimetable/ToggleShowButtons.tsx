import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCommentSlash } from '@fortawesome/free-solid-svg-icons';
import { CheckableButton } from '../../../../components';
import {
  toggleShowCancelOfTimetable,
  toggleShowNoshowOfTimetable,
  useStore,
} from '../../../../store';

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
        canSee={showCancelOfTimetable}
        personalColor="black"
        onClick={toggleCancel}
        icon={<FontAwesomeIcon icon={faBan} fontSize={14} />}
      />
      <CheckableButton
        label="부도"
        canSee={showNoshowOfTimetable}
        personalColor="black"
        onClick={toggleNoshow}
        icon={<FontAwesomeIcon icon={faCommentSlash} fontSize={14} />}
      />
    </div>
  );
};
