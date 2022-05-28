import { useReactiveVar } from "@apollo/client";
import {
  compareDateMatch,
  DayWithUsers,
  getTimeLength,
} from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import { viewOptionsVar } from "../../../store";
import { ONE_DAY } from "../../../variables";
import { EventBox } from "./event-box";

interface TableColsProps {
  weekEvents: DayWithUsers[];
  labels: Date[];
}
export function TableCols({ weekEvents, labels }: TableColsProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);

  if (!weekEvents[0]) {
    // console.log("❌ weekEvents[0]가 false입니다 : ", weekEvents);
    return <h2>Loading...</h2>;
  }
  const userLength = weekEvents[0].users.length;
  return (
    <div
      className={cls("col-table absolute grid h-full w-full")}
      style={
        viewOptions.periodToView === ONE_DAY
          ? {
              gridTemplateColumns: `2.5rem repeat(1, minmax(${
                userLength * 6
              }rem,1fr))`,
            }
          : {
              gridTemplateColumns: `2.5rem repeat(7, minmax(${
                userLength * 6
              }rem,1fr)`,
            }
      }
    >
      <div className="title-col" />
      {weekEvents.map((day, i) => (
        <div
          key={i}
          className="day-col relative grid"
          style={{
            gridTemplateColumns: `repeat(${
              day.users.filter((member) => member.activation).length
            }, 1fr)`,
          }}
        >
          {day.users.map(
            (member, userIndex) =>
              member.activation && (
                <div key={member.id} className={cls("user-col relative")}>
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
    </div>
  );
}
