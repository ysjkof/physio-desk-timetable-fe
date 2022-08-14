import { memo } from 'react';
import { TABLE_CELL_HEIGHT } from '../../../constants/constants';
import { getTimeLength } from '../../../services/dateServices';
import { IListReservation } from '../../../types/type';
import { EventBox } from './EventBox';

interface ScheduleInUserInDayProps {
  userIndex: number;
  events: IListReservation[];
  labels: string[];
  labelMaxLength: number;
}
function ScheduleInUserInDay({
  userIndex,
  events,
  labels,
  labelMaxLength,
}: ScheduleInUserInDayProps) {
  const maxTableHeight = labelMaxLength * TABLE_CELL_HEIGHT - TABLE_CELL_HEIGHT;

  return (
    <>
      {events.map((event) => {
        const idx = labels.findIndex((label) => label === event.startDate);
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
    </>
  );
}

// export default UserInDay;
export default memo(ScheduleInUserInDay, (prevProps, nextProps) => {
  // console.log(
  //   'in ScheduleInUserInDay memo same?',
  //   prevProps.labels[0] === nextProps.labels[0] &&
  //     prevProps.labels[1] === nextProps.labels[1] &&
  //     prevProps.labels[prevProps.labels.length] ===
  //       nextProps.labels[nextProps.labels.length],
  //   prevProps.labelMaxLength === nextProps.labelMaxLength,
  //   prevProps.events === nextProps.events,
  //   prevProps.userIndex === nextProps.userIndex
  // );

  return (
    prevProps.labels[0] === nextProps.labels[0] &&
    prevProps.labels[1] === nextProps.labels[1] &&
    prevProps.labels[prevProps.labels.length] ===
      nextProps.labels[nextProps.labels.length] &&
    prevProps.labelMaxLength === nextProps.labelMaxLength &&
    prevProps.events === nextProps.events &&
    prevProps.userIndex === nextProps.userIndex
  );
});
