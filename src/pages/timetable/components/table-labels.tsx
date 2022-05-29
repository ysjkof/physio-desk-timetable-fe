import {
  compareNumAfterGetMinutes,
  getHHMM,
} from "../../../libs/timetable-utils";
import { TableMainComponentLayout } from "./table-main-component-layout";
interface TableLabelsProps {
  labels: Date[];
}

export function TableLabels({ labels }: TableLabelsProps) {
  return (
    <div className="sticky left-0 z-[33]">
      <TableMainComponentLayout componentName="table-labels" isLabel>
        {labels.map((label, i) => (
          <div key={i} className="h-[20px]">
            <div className="relative -top-2.5 h-full bg-white">
              {compareNumAfterGetMinutes(label, [0, 30]) ? getHHMM(label) : ""}
            </div>
          </div>
        ))}
      </TableMainComponentLayout>
    </div>
  );
}
