import { memo } from 'react';
import {
  createDate,
  get4DigitHour,
  getTimeLength,
} from '../../../../services/dateServices';
import EventBox from './EventBox';
import { TABLE_CELL_HEIGHT } from '../../../../constants/constants';
import { ReservationState } from '../../../../types/generated.types';
import type { IListReservation } from '../../../../types/common.types';

interface EventBoxContainerProps {
  userIndex: number;
  events: IListReservation[];
  labels: string[];
  labelMaxLength: number;
  isSingleUser: boolean;
}
function EventBoxContainer({
  userIndex,
  events,
  labels,
  labelMaxLength,
  isSingleUser,
}: EventBoxContainerProps) {
  const maxTableHeight = labelMaxLength * TABLE_CELL_HEIGHT - TABLE_CELL_HEIGHT;

  const [hour, minute] = labels[0].split(':');
  const endLabelIdx = labels.length - 1;

  const firstLabelDate = createDate(events[0]?.startDate, {
    hour: +hour,
    minute: +minute,
  });

  return (
    <>
      {events.map((event) => {
        let inset = '0';
        let numberOfCell = getTimeLength(
          event.startDate,
          event.endDate,
          '20minute'
        );

        if (event.state === ReservationState.DayOff) {
          numberOfCell =
            numberOfCell +
            getTimeLength(
              firstLabelDate,
              new Date(event.startDate),
              '20minute'
            );
        } else {
          const labelIdx = labels.findIndex((label) => {
            return label === get4DigitHour(event.startDate);
          });
          /**
           * 시작시간이 마지막 시작 시간과 같으면 화면을 벗어나기 때문에 리턴
           * labelIdx가 없으면 화면을 벗어나기 때문에 한 번 더 확인하고 리턴
           */
          if (labelIdx === endLabelIdx || labelIdx === -1) return;

          inset = `${labelIdx * TABLE_CELL_HEIGHT}px 0`;
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

export default memo(EventBoxContainer, (prevProps, nextProps) => {
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
