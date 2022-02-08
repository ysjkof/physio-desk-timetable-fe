interface IScheduleBox {
  gridRowStart: number;
  gridRowEnd: number;
  hhmm: string;
}

export const ScheduleBox: React.FC<IScheduleBox> = ({
  gridRowStart,
  gridRowEnd,
  hhmm,
  children,
}) => {
  return (
    <div
      className="col-start-2 rounded-lg border px-2 mb-1 bg-white"
      style={{
        gridRowStart,
        gridRowEnd,
      }}
      id={hhmm}
    >
      {children}
    </div>
  );
};
