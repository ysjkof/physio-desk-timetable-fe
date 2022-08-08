import { useReactiveVar } from '@apollo/client';
import { getActiveUserLength } from '..';
import {
  combineYMDHM,
  compareDateMatch,
  getTimeLength,
} from '../../../services/dateServices';
import { cls } from '../../../utils/utils';
import { selectedClinicVar, selectedDateVar } from '../../../store';
import { TABLE_CELL_HEIGHT } from '../../../constants/constants';
import { EventBox } from '../molecules/event-box';
import { ReserveBtn } from '../molecules/reserve-btn';
import { TableLoopLayout } from './templates/table-loop-layout';
import { TimeIndicatorBar } from './TimeIndicatorBar';
import { compareNumAfterGetMinutes } from '../../../services/timetableServices';
import { DayWithUsers } from '../../../types/type';

interface SchedulesProps {
  weekEvents: DayWithUsers[];
  labels: Date[];
}
function Schedules({ weekEvents, labels }: SchedulesProps) {
  const selectedDate = useReactiveVar(selectedDateVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);

  const userLength = getActiveUserLength(selectedClinic?.members);
  const labelMaxLength = labels.length;
  const maxTableHeight = labelMaxLength * TABLE_CELL_HEIGHT - TABLE_CELL_HEIGHT;

  return (
    <TableLoopLayout
      elementName="TABLE_COLS"
      userLength={userLength}
      children={weekEvents.map((day, i) => (
        <div
          key={i}
          className={cls(
            'user-cols-divide relative grid border-b',
            userLength === 1 ? 'border-x-inherit' : ''
          )}
          style={{
            gridTemplateColumns: `repeat(${userLength}, 1fr)`,
          }}
        >
          <TimeIndicatorBar
            isActive={compareDateMatch(day.date, selectedDate, 'ymd')}
            labels={labels}
          />
          {day.users.map((member, userIndex) =>
            member.isActivate ? (
              <div
                key={member.id}
                className="USER_COL relative w-full border-r-[0.5px] last:border-r-0 hover:border-transparent hover:bg-gray-200/50"
              >
                {labels.map((label, idx) =>
                  idx === labelMaxLength - 1 ? null : (
                    <ReserveBtn
                      key={label.getTime()}
                      label={combineYMDHM(day.date, label)}
                      member={{ id: member.user.id, name: member.user.name }}
                      isActiveBorderTop={compareNumAfterGetMinutes(
                        label,
                        [0, 30]
                      )}
                      userIndex={userIndex}
                    />
                  )
                )}
                {member.events?.map((event) => {
                  const idx = labels.findIndex((label) =>
                    compareDateMatch(label, new Date(event.startDate), 'hm')
                  );
                  const numberOfCell = idx === -1 ? 0 : idx;
                  return (
                    <EventBox
                      key={event.id}
                      event={event}
                      userIndex={userIndex}
                      maxTableHeight={maxTableHeight}
                      numberOfCell={getTimeLength(
                        event.startDate,
                        event.endDate,
                        '20minute'
                      )}
                      inset={`${numberOfCell * TABLE_CELL_HEIGHT}px 0%`}
                    />
                  );
                })}
              </div>
            ) : (
              ''
            )
          )}
        </div>
      ))}
    />
  );
}

export default Schedules;
