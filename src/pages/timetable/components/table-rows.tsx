import {
  combineYMDHM,
  compareNumAfterGetMinutes,
  DayWithUsers,
} from "../../../libs/timetable-utils";
import { ReserveBtn } from "./reserve-btn";
import { TableLoopLayout } from "./table-loop-layout";
import { TableMainComponentLayout } from "./table-main-component-layout";

interface TableRowProps {
  weekEvents: DayWithUsers[];
  labels: Date[];
}

export function TableRows({ weekEvents, labels }: TableRowProps) {
  const userLength = weekEvents[0].users.length;

  return (
    <TableMainComponentLayout componentName="table-rows">
      {labels.map((label, i) => (
        <TableLoopLayout
          key={i}
          userLength={userLength}
          isActiveBorderTop={compareNumAfterGetMinutes(label, [0, 30])}
          children={weekEvents.map((day, ii) => (
            // id={day.date + ""}로 table-nav에서 스크롤 조정함
            <div key={ii} className="relative flex" id={day.date + ""}>
              {day?.users.map(
                (member, userIndex) =>
                  member.activation && (
                    <ReserveBtn
                      key={userIndex}
                      label={combineYMDHM(day.date, label)}
                      userIndex={userIndex}
                      member={{ id: member.user.id, name: member.user.name }}
                    />
                  )
              )}
            </div>
          ))}
        />
      ))}
    </TableMainComponentLayout>
  );
}
