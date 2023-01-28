import { cls } from '../utils/common.utils';

interface ButtonOfPagesProps {
  changePage: (page: number) => void;
  page: number;
  isActive: boolean;
  hasBorder?: boolean;
}

const ButtonOfPages = ({
  changePage,
  page,
  isActive,
  hasBorder,
}: ButtonOfPagesProps) => {
  return (
    <button
      key={page}
      type="button"
      className={cls(
        'px-2 py-1',
        isActive ? 'font-semibold' : '',
        hasBorder ? 'border' : ''
      )}
      onClick={() => changePage(page)}
    >
      {page}
    </button>
  );
};

export default ButtonOfPages;
