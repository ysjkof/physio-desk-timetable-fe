import { cls } from '../../../utils/utils';

interface IBtnDatecheck {
  text: string;
  day: number;
  selectedMonth: boolean;
  selectedDay?: boolean;
  onClick?: any;
  isSubheader?: boolean;
}

export const BtnDatecheck = ({
  text,
  day,
  selectedMonth,
  selectedDay,
  onClick,
  isSubheader,
}: IBtnDatecheck) => (
  <button
    className={cls(
      'btn-menu relative mx-auto rounded-none px-1 transition-transform',
      selectedDay ? 'border-b-black' : '',
      day === 0 ? 'sunday' : day === 6 ? 'saturday' : '',
      selectedMonth ? '' : 'opacity-50',
      isSubheader
        ? 'pointer-events-none border-0'
        : 'emphasize-border border-b-[3px]'
    )}
    onClick={onClick}
  >
    {text}
  </button>
);
