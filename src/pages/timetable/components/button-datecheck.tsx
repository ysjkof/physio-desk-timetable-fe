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
    className={`btn-menu mx-auto px-1 transition-transform
    ${isToday ? "font-semibold-ring" : ""} 
    ${day === 0 ? "sunday" : day === 6 ? "saturday" : ""} 
    ${selectedMonth ? "" : "opacity-40"} 
    ${isSubheader ? "ring-0" : ""}
    `}
    onClick={onClick}
  >
    {text}
  </button>
);
