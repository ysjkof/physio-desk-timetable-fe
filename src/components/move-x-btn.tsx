interface IMoveXBtn {
  direction: "prev" | "after";
  selectedDate: Date;
  setSelectedDate: any;
  dateNavExpand: boolean;
}
export const MoveXBtn: React.FC<IMoveXBtn> = ({
  direction,
  selectedDate,
  setSelectedDate,
  dateNavExpand,
}) => {
  const handleDateNavMove = () => {
    const date = new Date(selectedDate);
    const value = dateNavExpand ? 1 : 7;
    if (dateNavExpand === false) {
      if (direction === "prev") date.setDate(date.getDate() - value);
      if (direction === "after") date.setDate(date.getDate() + value);
    } else if (dateNavExpand === true) {
      if (direction === "prev") date.setMonth(date.getMonth() - value);
      if (direction === "after") date.setMonth(date.getMonth() + value);
    }
    setSelectedDate(date);
  };
  return (
    <div className="cursor-pointer" onClick={() => handleDateNavMove()}>
      {direction === "prev" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </div>
  );
};
