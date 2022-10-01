import { memo } from 'react';
import { TABLE_CELL_HEIGHT } from '../../../../constants/constants';
import {
  createDate,
  get4DigitHour,
  getTimeLength,
} from '../../../../services/dateServices';
import { IListReservation } from '../../../../types/type';
import EventBox from './EventBox';

interface ScheduleInUserInDayProps {
  userIndex: number;
  events: IListReservation[];
  labels: string[];
  labelMaxLength: number;
  isSingleUser: boolean;
}
function ScheduleInUserInDay({
  userIndex,
  events,
  labels,
  labelMaxLength,
  isSingleUser,
}: ScheduleInUserInDayProps) {
  const maxTableHeight = labelMaxLength * TABLE_CELL_HEIGHT - TABLE_CELL_HEIGHT;

  const [hour, minute] = labels[0].split(':');
  const [lastHour, lastMinute] = labels[labels.length - 1].split(':');
  const firstLabelDate = createDate(events[0]?.startDate, {
    hour: +hour,
    minute: +minute,
  });
  const lastLabelDate = createDate(events[0]?.startDate, {
    hour: +lastHour,
    minute: +lastMinute,
  });

  const isOverEndDuration = (tableEndDate: Date, eventStartDate: Date) =>
    tableEndDate.getTime() < eventStartDate.getTime();

  return (
    <>
      {events.map((event) => {
        const labelIdx = labels.findIndex((label) => {
          return label === get4DigitHour(event.startDate);
        });

        let inset = `${labelIdx * TABLE_CELL_HEIGHT}px 0`;
        let numberOfCell = getTimeLength(
          event.startDate,
          event.endDate,
          '20minute'
        );

        if (labelIdx === -1) {
          if (isOverEndDuration(lastLabelDate, new Date(event.startDate)))
            return;

          inset = '0';
          numberOfCell =
            numberOfCell +
            getTimeLength(
              firstLabelDate,
              new Date(event.startDate),
              '20minute'
            );
        }

        return (
          <EventBox
            key={event.id}
            event={event}
            userIndex={userIndex}
            maxTableHeight={maxTableHeight}
            numberOfCell={numberOfCell}
            inset={inset}
            isSingleUser={isSingleUser}
          />
        );
      })}
    </>
  );
}

export default memo(ScheduleInUserInDay, (prevProps, nextProps) => {
  return (
    prevProps.labels[0] === nextProps.labels[0] &&
    prevProps.labels[1] === nextProps.labels[1] &&
    prevProps.labels[prevProps.labels.length] ===
      nextProps.labels[nextProps.labels.length] &&
    prevProps.labelMaxLength === nextProps.labelMaxLength &&
    prevProps.events === nextProps.events &&
    prevProps.userIndex === nextProps.userIndex &&
    prevProps.isSingleUser === nextProps.isSingleUser
  );
});
