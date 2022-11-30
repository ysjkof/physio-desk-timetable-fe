import {
  faArrowRotateLeft,
  faBan,
  faCancel,
  faCommentSlash,
  faCopy,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cls } from '../../../../utils/common.utils';
import { USER_COLORS } from '../../../../constants/constants';
import { ReservationState } from '../../../../types/generated.types';

interface EventBoxProps {
  height: number;
  width: number;
  state: ReservationState;
}

export default function DocsEventBox({ height, width, state }: EventBoxProps) {
  const isDayOff = state === ReservationState.DayOff;
  const isReserve = state === ReservationState.Reserved;
  const isCancel = state === ReservationState.Canceled;
  const isNoshow = state === ReservationState.NoShow;

  const prescriptions = [{ name: 'Mt30' }];
  const patient = { name: '브라이언', registrationNumber: 2398 };
  const memo = '';

  return (
    <div
      className={cls('EVENT_BOX group absolute z-30 cursor-pointer')}
      style={{ height, width }}
    >
      {!isDayOff && (
        <div className="flex w-full items-baseline justify-between overflow-hidden bg-gray-100 px-2 pb-[0.2rem] text-gray-800">
          <FontAwesomeIcon
            icon={faCopy}
            fontSize={16}
            className="text-green-500 hover:scale-125"
          />
          <FontAwesomeIcon
            icon={faBan}
            fontSize={14}
            className={cls(
              'hover:cancel cursor-pointer rounded-full hover:scale-125',
              state === ReservationState.Canceled
                ? 'cancel pointer-events-none'
                : 'text-gray-400'
            )}
          />
          <FontAwesomeIcon
            icon={faCommentSlash}
            fontSize={14}
            className={cls(
              'hover:noshow cursor-pointer rounded-full hover:scale-125',
              state === ReservationState.NoShow
                ? 'noshow pointer-events-none'
                : 'text-gray-400'
            )}
          />
          <FontAwesomeIcon
            icon={faArrowRotateLeft}
            fontSize={14}
            className={cls(
              'cursor-pointer rounded-full',
              state === ReservationState.Reserved
                ? 'pointer-events-none text-gray-400'
                : 'text-blue-800 hover:scale-125'
            )}
          />
        </div>
      )}
      <div
        className={cls(
          'relative h-full overflow-hidden border px-1',
          !isReserve ? 'no-reserved' : ''
        )}
        style={{
          ...(isReserve && {
            borderColor: USER_COLORS[1].deep,
            backgroundColor: USER_COLORS[1].light,
          }),
        }}
      >
        <div className="flex h-5 items-center justify-between overflow-hidden whitespace-nowrap text-center">
          {isDayOff && <FontAwesomeIcon icon={faLock} className="cancel" />}
          {isCancel && <FontAwesomeIcon icon={faCancel} className="cancel" />}
          {isNoshow && (
            <FontAwesomeIcon icon={faCommentSlash} className="noshow" />
          )}
          <span className="ml-0.5 w-full font-extralight">
            {isDayOff
              ? '예약잠금'
              : patient?.registrationNumber + ':' + patient?.name}
          </span>
          {memo && (
            <div className="absolute right-0 top-0 border-4 border-t-red-500 border-r-red-500 border-l-transparent border-b-transparent" />
          )}
        </div>
        {!isDayOff && prescriptions && (
          <div className="h-5 overflow-hidden text-ellipsis whitespace-nowrap text-center">
            {prescriptions.map((prescription) => prescription.name + ' ')}
          </div>
        )}

        <div className="overflow-hidden break-all font-extralight leading-5">
          {memo}
        </div>
      </div>
    </div>
  );
}
