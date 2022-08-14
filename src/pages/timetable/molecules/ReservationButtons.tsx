import { memo } from 'react';
import { checkMatchMinute } from '../../../services/timetableServices';
import ReserveButton from './ReserveButton';

interface ReservationButtonsProps {
  userIndex: number;
  userId: number;
  labels: string[];
  labelMaxLength: number;
}
function ReservationButtons({
  userIndex,
  userId,
  labels,
  labelMaxLength,
}: ReservationButtonsProps) {
  return (
    <>
      {labels.map((label, idx) =>
        idx === labelMaxLength - 1 ? null : (
          <ReserveButton
            key={label}
            label={label}
            userId={userId}
            isActiveBorderTop={checkMatchMinute(label, [0, 30])}
            userIndex={userIndex}
          />
        )
      )}
    </>
  );
}

// export default UserInDay;
export default memo(ReservationButtons, (prevProps, nextProps) => {
  // console.log(
  //   'in memo same?',
  //   prevProps.labelMaxLength === nextProps.labelMaxLength,
  //   prevProps.userId === nextProps.userId,
  //   prevProps.userIndex === nextProps.userIndex
  // );

  return (
    prevProps.labels[0] === nextProps.labels[0] &&
    prevProps.labels[1] === nextProps.labels[1] &&
    prevProps.labels[prevProps.labels.length] ===
      nextProps.labels[nextProps.labels.length]
  );
});
