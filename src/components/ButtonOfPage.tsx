import { cls } from '../utils/utils';

export const ButtonOfPages = ({
  changePage,
  page,
  hasBorder,
}: {
  changePage: (page: number) => void;
  page: number;
  hasBorder?: boolean;
}) => {
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
};
