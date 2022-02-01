import React from "react";
import { useNavigate } from "react-router-dom";
interface IEmptyCellProps {
  date: Date;
  label: string;
  labelIndex: number;
  dayIndex: number;
}

export const EmptyCell: React.FC<IEmptyCellProps> = ({
  date,
  label,
  labelIndex,
  dayIndex,
}) => {
  const startDate = new Date(date);
  startDate.setHours(parseInt(label.substring(0, 2)));
  startDate.setMinutes(parseInt(label.substring(2, 4)));
  const navigate = useNavigate();
  const reserve = () => {
    navigate("reserve", { state: { todo: "reserve", startDate } });
  };

  return (
    <div
      onClick={reserve}
      key={labelIndex}
      className={`c-col-start-${
        dayIndex + 2
      } min-h-[1rem] cursor-pointer border-t hover:bg-slate-100`}
      style={{
        gridRowStart: `${labelIndex}`,
      }}
    />
  );
};
