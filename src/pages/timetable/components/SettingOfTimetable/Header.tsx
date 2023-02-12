import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { NEXT, PREV } from '../../../../constants/constants';
import { toggleSettingOfTimetable } from '../../../../store';
import { cls } from '../../../../utils/common.utils';

export const Header = () => {
  const closeOptionSelector = () => {
    toggleSettingOfTimetable(false);
  };

  return (
    <div
      id="table-option-selector__header"
      className="flex items-center justify-between border-b px-3 pb-1"
    >
      <span className="group relative z-40 px-1 after:ml-1 after:rounded-full after:border after:px-1 after:content-['?']">
        보기설정
        <p className="bubble-arrow-t-right absolute top-7 -right-4 hidden w-48 rounded-md bg-black p-4 text-white group-hover:block">
          시간표에 표시할 병원이나 사용자를 선택합니다.
        </p>
      </span>
      <BtnArrow direction={NEXT} onClick={closeOptionSelector} />
    </div>
  );
};

interface BtnArrowProps {
  direction: typeof PREV | typeof NEXT;
  onClick: () => void;
  className?: string;
}
// TODO: 디자인 개선 후 삭제될 수 있어 임시로 사용
const BtnArrow = ({ direction, onClick, className }: BtnArrowProps) => {
  return (
    <button
      className={cls(
        'btn-menu rounded-md border bg-white p-1',
        className ?? ''
      )}
      onClick={onClick}
      type="button"
    >
      {direction === PREV ? (
        <FontAwesomeIcon icon={faArrowLeft} fontSize={14} />
      ) : (
        <FontAwesomeIcon icon={faArrowRight} fontSize={14} />
      )}
    </button>
  );
};
