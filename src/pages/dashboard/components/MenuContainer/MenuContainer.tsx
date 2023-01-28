import { BrokenLine, Heart, Medicine } from '../../../../svgs';

const MenuContainer = () => {
  return (
    <div className="flex flex-col text-sm">
      <button
        className="flex items-center gap-2 py-2 text-table-day-strong"
        onClick={() => {}}
        type="button"
      >
        <Heart />
        직원열람 및 관리
      </button>
      <button
        className="flex items-center gap-2 py-2 text-table-day-strong"
        onClick={() => {}}
        type="button"
      >
        <Medicine />
        처방등록 및 관리
      </button>
      <button
        className="flex items-center gap-2 py-2 text-table-day-strong"
        onClick={() => {}}
        type="button"
      >
        <BrokenLine />
        통계
      </button>
    </div>
  );
};

export default MenuContainer;
