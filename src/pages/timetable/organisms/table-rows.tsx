import { useReactiveVar } from "@apollo/client";
import { getActiveUserLength } from "..";
import {
  combineYMDHM,
  compareNumAfterGetMinutes,
  DayWithUsers,
} from "../../../libs/timetable-utils";
import { selectedClinicVar } from "../../../store";
import { ReserveBtn } from "../molecules/reserve-btn";
import { TableLoopLayout } from "./templates/table-loop-layout";
import { TableMainComponentLayout } from "./templates/table-main-component-layout";

interface TableRowProps {
  weekEvents: DayWithUsers[];
  labels: Date[];
}

export function TableRows({ weekEvents, labels }: TableRowProps) {
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const userLength = getActiveUserLength(selectedClinic?.members);

  return (
    <TableMainComponentLayout componentName="TABLE_ROWS">
      {labels.map((label, i) => (
        <TableLoopLayout
          key={i}
          direction="row"
          userLength={userLength}
          children={weekEvents.map((day, ii) => (
            <div key={ii} className="relative flex">
              {day?.users.map((member, userIndex) =>
                member.isActivate ? (
                  <ReserveBtn
                    key={userIndex}
                    userIndex={userIndex}
                    label={combineYMDHM(day.date, label)}
                    member={{ id: member.user.id, name: member.user.name }}
                    isActiveBorderTop={compareNumAfterGetMinutes(
                      label,
                      [0, 30]
                    )}
                  />
                ) : (
                  ""
                )
              )}
            </div>
          ))}
        />
      ))}
    </TableMainComponentLayout>
  );
}
