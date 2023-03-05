import { memo } from 'react';
import { get4DigitHour, getTimeLength } from '../../../../utils/dateUtils';
import EventBox from './EventBox';
import { TABLE_CELL_HEIGHT } from '../../../../constants/constants';
import type { ReservationOfGetReservationsByInterval } from '../../../../types/processedGeneratedTypes';

interface EventBoxContainerProps {
  events: ReservationOfGetReservationsByInterval[];
  labels: string[];
  labelMaxLength: number;
  isSingleUser: boolean;
  color: string | undefined;
}

const EventBoxContainer = ({
  events,
  labels,
  labelMaxLength,
  isSingleUser,
  color,
}: EventBoxContainerProps) => {
  const maxTableHeight = labelMaxLength * TABLE_CELL_HEIGHT - TABLE_CELL_HEIGHT;

  const endLabelIdx = labels.length - 1;

  return (
    <>
      {events.map((event) => {
        let inset = '0';
        const numberOfCell = getTimeLength(
          event.startDate,
          event.endDate,
          '20minute'
        );
        const labelIdx = labels.findIndex((label) => {
          return label === get4DigitHour(event.startDate);
        });
        /**
         * 시작시간이 마지막 시작 시간과 같으면 화면을 벗어나기 때문에 리턴
         * labelIdx가 없으면 화면을 벗어나기 때문에 한 번 더 확인하고 리턴
         */
        if (labelIdx === endLabelIdx || labelIdx === -1) return false;

        inset = `${labelIdx * TABLE_CELL_HEIGHT}px 0`;

        return (
          <EventBox
            key={event.id}
            event={event}
            maxTableHeight={maxTableHeight}
            numberOfCell={numberOfCell}
            inset={inset}
            isSingleUser={isSingleUser}
            color={color}
          />
        );
      })}
    </>
  );
};

export default memo(EventBoxContainer, (prevProps, nextProps) => {
  return (
    prevProps.labels[0] === nextProps.labels[0] &&
    prevProps.labels[1] === nextProps.labels[1] &&
    prevProps.labels[prevProps.labels.length] ===
      nextProps.labels[nextProps.labels.length] &&
    prevProps.labelMaxLength === nextProps.labelMaxLength &&
    prevProps.events === nextProps.events &&
    prevProps.isSingleUser === nextProps.isSingleUser
  );
});
