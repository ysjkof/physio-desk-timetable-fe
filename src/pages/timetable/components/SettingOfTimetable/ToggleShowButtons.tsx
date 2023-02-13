import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCommentSlash } from '@fortawesome/free-solid-svg-icons';
import { MenuButton } from '../../../../components';
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
    <div
      id="table-option-selector__toggle-visible-state"
      className="flex items-center gap-2 border-b py-1 px-3"
    >
      {/* TODO: isActivated 색상 개선 */}
      <MenuButton isActivated={showCancelOfTimetable} onClick={toggleCancel}>
        <FontAwesomeIcon icon={faBan} fontSize={14} />
        취소
      </MenuButton>
      <MenuButton isActivated={showNoshowOfTimetable} onClick={toggleNoshow}>
        <FontAwesomeIcon icon={faCommentSlash} fontSize={14} />
        부도
      </MenuButton>
    </div>
  );
};
