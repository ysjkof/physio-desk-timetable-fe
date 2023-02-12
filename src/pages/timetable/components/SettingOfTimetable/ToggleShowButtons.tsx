import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCommentSlash } from '@fortawesome/free-solid-svg-icons';
import { MenuButton } from '../../../../components';
import {
  toggleShowCancelOfTimetable,
  toggleShowNoshowOfTimetable,
  useStore,
} from '../../../../store';
import { useMe } from '../../../../hooks';

export const ToggleShowButtons = () => {
  const [, { getIdName }] = useMe();
  const userIdAndName = getIdName();

  const showCancelOfTimetable = useStore(
    (state) => state.showCancelOfTimetable
  );

  const showNoshowOfTimetable = useStore(
    (state) => state.showNoshowOfTimetable
  );

  const toggleCancel = () => {
    toggleShowCancelOfTimetable({
      ...userIdAndName,
      value: !showCancelOfTimetable,
    });
  };

  const toggleNoshow = () => {
    toggleShowNoshowOfTimetable({
      ...userIdAndName,
      value: !showNoshowOfTimetable,
    });
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
