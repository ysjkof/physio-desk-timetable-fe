interface IScheduleListBox {
  startDate: string;
  endDate: string;
  memo: string | null;
}

export const ScheduleListBox: React.FC<IScheduleListBox> = ({
  children,
  startDate,
  endDate,
  memo,
}) => {
  return (
    <div className="rounded-lg border px-2 mb-2 bg-white shadow-sm pb-1">
      <div className="flex items-baseline mb-1">
        <span className="text-sm text-gray-500">
          {startDate}~{endDate}
        </span>
        {children}
      </div>
      <span className="text-gray-600 text-sm px-2">{memo}</span>
    </div>
  );
};
