interface IScheduleListBox {
  startDate: string;
  endDate: string;
  memo: string | null | undefined;
}

export const ScheduleListBox: React.FC<IScheduleListBox> = ({
  children,
  startDate,
  endDate,
  memo,
}) => {
  return (
    <div className="mb-2 rounded-lg border bg-white px-2 pb-1 shadow-sm">
      <div className="mb-1 flex items-baseline">
        <span className="text-sm text-gray-500">
          {startDate}~{endDate}
        </span>
        {children}
      </div>
      <span className="px-2 text-sm text-gray-600">{memo}</span>
    </div>
  );
};
