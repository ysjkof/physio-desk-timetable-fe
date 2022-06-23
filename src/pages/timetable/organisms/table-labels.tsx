import {
  compareNumAfterGetMinutes,
  getHHMM,
} from "../../../libs/timetable-utils";
import { TableMainComponentLayout } from "./templates/table-main-component-layout";
interface TableLabelsProps {
  labels: Date[];
}

export function TableLabels({ labels }: TableLabelsProps) {
  return (
    <div className="TABLE-LABELS sticky left-0 z-[33]">
      <TableMainComponentLayout isLabel>
        <div className="absolute top-0 h-[50px] w-full border-r-2 border-black" />
        {labels.map((label, i) => (
          <div
            key={i}
            className={`h-[20px] w-full border-r-2 border-black bg-white pr-2`}
          >
            <div className="relative -top-2.5 h-full">
              {compareNumAfterGetMinutes(label, [0, 30]) ? getHHMM(label) : ""}
            </div>
          </div>
        ))}
      </TableMainComponentLayout>
    </div>
  );
}
