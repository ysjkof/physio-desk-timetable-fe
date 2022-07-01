import {
  compareNumAfterGetMinutes,
  getHHMM,
} from "../../../libs/timetable-utils";

interface TableLabelsProps {
  labels: Date[];
}

export function TableLabels({ labels }: TableLabelsProps) {
  return (
    <>
      {labels.map((label, i) => (
        <div key={i} className={`h-[20px] w-full bg-white`}>
          {compareNumAfterGetMinutes(label, [0, 30]) && (
            <div className="relative -top-2 h-full">{getHHMM(label)}</div>
          )}
        </div>
      ))}
    </>
  );
}
