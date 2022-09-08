import { useReactiveVar } from '@apollo/client';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useCreateDayOffMutation } from '../../../../graphql/generated/graphql';
import { cls } from '../../../../utils/utils';
import { viewOptionsVar } from '../../../../store';
import { USER_COLORS, UTC_OPTION_KST } from '../../../../constants/constants';
import { ROUTES } from '../../../../router/routes';

interface UserNameTitleProps {
  isMe: boolean;
  name: string;
  userIndex: number;
  clinicId: number;
  userId: number;
  date: Date;
}

export const UserNameTitle = ({
  isMe,
  name,
  userIndex,
  clinicId,
  userId,
  date,
}: UserNameTitleProps) => {
  const [createDayOff, { loading }] = useCreateDayOffMutation();
  const viewOptions = useReactiveVar(viewOptionsVar);
  const navigate = useNavigate();

  function onClickBox() {
    navigate(ROUTES.reserve, {
      state: {
        isDayOff: true,
        startDate: {
          hour: date.getHours() + UTC_OPTION_KST.hour,
          minute: date.getMinutes() + UTC_OPTION_KST.minute,
          dayIndex: date.getDay(),
        },
      },
    });
  }

  function lockTable() {
    if (loading) return;

    const { startHour, startMinute, endHour, endMinute } =
      viewOptions.tableDuration;
    const startDate = new Date(date);
    const endDate = new Date(date);
    startDate.setHours(startHour, startMinute);
    endDate.setHours(endHour, endMinute);

    createDayOff({
      variables: {
        input: {
          startDate,
          endDate,
          clinicId,
          userId,
        },
      },
    });
  }
  return (
    <div
      className={cls(
        'UserNameTitle border-r-[0.5] group flex w-full items-center justify-center py-0.5 last:border-r-0 ',
        isMe ? ' font-semibold' : ''
      )}
    >
      <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">
        <span
          className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: USER_COLORS[userIndex]?.deep }}
        />
        {name}
      </span>
      <div className="POPOVER absolute top-4 flex flex-col border bg-white">
        <div className="hidden  whitespace-nowrap  group-hover:block">
          <div
            className="flex cursor-pointer items-center gap-1 py-1 px-2 hover:bg-gray-200"
            onClick={lockTable}
          >
            <FontAwesomeIcon icon={faLock} />
            <span>예약잠금(종일)</span>
          </div>
          <div
            className="flex cursor-pointer items-center gap-1 py-1 px-2 hover:bg-gray-200"
            onClick={onClickBox}
          >
            <FontAwesomeIcon icon={faLock} />
            <span>예약잠금</span>
          </div>
        </div>
      </div>
    </div>
  );
};
