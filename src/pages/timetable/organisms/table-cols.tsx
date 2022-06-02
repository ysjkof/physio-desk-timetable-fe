import { useReactiveVar } from "@apollo/client";
import {
  compareDateMatch,
  DayWithUsers,
  getTimeLength,
} from "../../../libs/timetable-utils";
import { selectedDateVar } from "../../../store";
import { TABLE_CELL_HEIGHT } from "../../../variables";
import { EventBox } from "../molecules/event-box";
import { TableLoopLayout } from "./templates/table-loop-layout";
import { TableMainComponentLayout } from "./templates/table-main-component-layout";
import { TimeIndicatorBar } from "./time-indicator-bar";

interface TableColsProps {
  weekEvents: DayWithUsers[];
  labels: Date[];
}
export function TableCols({ weekEvents, labels }: TableColsProps) {
  const selectedDate = useReactiveVar(selectedDateVar);
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
            <TimeIndicatorBar
              isActive={compareDateMatch(day.date, selectedDate, "ymd")}
              labels={labels}
            />
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
                          ) * TABLE_CELL_HEIGHT
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
