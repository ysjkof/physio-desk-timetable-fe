import { setPickedDate } from '../../../../store';
import { cls } from '../../../../utils/commonUtils';

interface DateBtnProps {
  date: Date;
  isSunday: boolean;
  isSaturday: boolean;
  enabled: boolean;
}

const DateBtn = ({ date, isSunday, isSaturday, enabled }: DateBtnProps) => {
  return (
    <button
      type="button"
      onClick={() => setPickedDate(date)}
      className={cls(
        'event-list__date-btn',
        isSunday ? 'sunday' : '',
        isSaturday ? 'saturday' : '',
        enabled ? 'border-table-day-strong font-bold' : 'border-transparent'
      )}
    >
      {date.getDate()}
    </button>
  );
};

export default DateBtn;
