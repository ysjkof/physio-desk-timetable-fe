import { cls } from '../utils/common.utils';

interface ButtonOfPagesProps {
  changePage: (page: number) => void;
  page: number;
  hasBorder?: boolean;
}

export default function ButtonOfPages({
  changePage,
  page,
  hasBorder,
}: ButtonOfPagesProps) {
  return (
    <button
      key={page}
      type="button"
      className={cls(
        'px-2 py-1',
        page === page ? 'font-semibold' : '',
        hasBorder ? 'border' : ''
      )}
      onClick={() => changePage(page)}
    >
      {page}
    </button>
  );
}
