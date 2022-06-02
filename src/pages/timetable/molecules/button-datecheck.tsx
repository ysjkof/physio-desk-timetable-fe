interface IBtnDatecheck {
  text: string;
  day: number;
  selectedMonth: boolean;
  isToday?: boolean;
  onClick?: any;
  isSubheader?: boolean;
}

export const BtnDatecheck = ({
  text,
  day,
  selectedMonth,
  isToday,
  onClick,
  isSubheader,
}: IBtnDatecheck) => (
  <button
    className={`btn-menu mx-auto px-1 transition-transform ${
      isToday ? "emphasize-ring font-semibold" : ""
    } ${day === 0 ? "sunday" : day === 6 ? "saturday" : ""} ${
      selectedMonth ? "" : "opacity-70"
    } ${isSubheader ? "ring-0" : "emphasize-hover"}
    `}
    onClick={onClick}
  >
    {text}
  </button>
);
