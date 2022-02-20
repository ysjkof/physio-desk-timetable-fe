import { ONE_DAY, ONE_WEEK } from "../libs/variables";

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
  const handleDateNavMove = (option: "prev" | "after") => {
    const date = new Date(selectedDate);
    if (dateNavExpand === false) {
      if (direction === "prev") date.setDate(date.getDate() - 7);
      if (direction === "after") date.setDate(date.getDate() + 7);
    } else if (dateNavExpand === true) {
      if (direction === "prev") date.setMonth(date.getMonth() - 1);
      if (direction === "after") date.setMonth(date.getMonth() + 1);
    }
    setSelectedDate(date);
  };
  return (
    <div
      className="cursor-pointer"
      onClick={() => handleDateNavMove(direction)}
    >
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
