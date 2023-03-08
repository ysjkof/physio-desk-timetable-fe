import { type PropsWithChildren } from 'react';

interface CalcDayBtnProps extends PropsWithChildren {
  onClick: () => void;
}

const ChangeDayBtn = ({ onClick, children }: CalcDayBtnProps) => {
  return (
    <button
      className="event-list__change-day-btn"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ChangeDayBtn;
