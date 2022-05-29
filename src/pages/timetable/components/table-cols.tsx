import {
  compareDateMatch,
  DayWithUsers,
  getTimeLength,
} from "../../../libs/timetable-utils";
import { EventBox } from "./event-box";
import { TableLoopLayout } from "./table-loop-layout";
import { TableMainComponentLayout } from "./table-main-component-layout";

interface TableColsProps {
  weekEvents: DayWithUsers[];
  labels: Date[];
}
export function TableCols({ weekEvents, labels }: TableColsProps) {
  const userLength = weekEvents[0].users.length;

  return (
    <TableMainComponentLayout componentName="table-cols">
      <TableLoopLayout
        userLength={userLength}
        children={weekEvents.map((day, i) => (
          <div
            key={i}
            className="relative grid"
            style={{
              gridTemplateColumns: `repeat(${
                day.users.filter((member) => member.activation).length
              }, 1fr)`,
            }}
          >
            {day.users.map(
              (member, userIndex) =>
                member.activation && (
                  <div key={member.id} className="user-col relative">
                    {member.events?.map((event) => (
                      <EventBox
                        key={event.id}
                        reservationId={event.id}
                        userIndex={userIndex}
                        reservationState={event.state}
                        memo={event.memo}
                        registrationNumber={event.patient.registrationNumber}
                        patientName={event.patient.name}
                        prescriptions={event.prescriptions ?? []}
                        startDate={event.startDate}
                        endDate={event.endDate}
                        inset={`${
                          labels.findIndex((label) =>
                            compareDateMatch(
                              label,
                              new Date(event.startDate),
                              "hm"
                            )
                          ) * 20
                        }px 0%`}
                        height={`${
                          getTimeLength(event.startDate, event.endDate) * 2
                        }px`}
                      />
                    ))}
                  </div>
                )
            )}
          </div>
        ))}
      />
    </TableMainComponentLayout>
  );
}
