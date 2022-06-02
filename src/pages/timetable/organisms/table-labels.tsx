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
    <div className="table-labels sticky left-0 z-[33]">
      <TableMainComponentLayout componentName="table-labels" isLabel>
        {labels.map((label, i) => (
          <div
            key={i}
            className={`h-[20px] w-full border-r border-black bg-white pr-2`}
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
