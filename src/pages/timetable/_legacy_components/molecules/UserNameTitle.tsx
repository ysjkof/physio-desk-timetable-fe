import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { cls, simpleCheckGQLError } from '../../../../utils/utils';
import { USER_COLORS, UTC_OPTION_KST } from '../../../../constants/constants';
import { ROUTES } from '../../../../router/routes';
import { createDate } from '../../../../utils/date.utils';
import { useMutation } from '@apollo/client';
import { CREATE_DAY_OFF_DOCUMENT } from '../../../../graphql';
import type { CreateDayOffMutation } from '../../../../types/generated.types';

interface UserNameTitleProps {
  isMe: boolean;
  name: string;
  userIndex: number;
  clinicId: number;
  userId: number;
  date: Date;
}

export default function UserNameTitle({
  isMe,
  name,
  userIndex,
  clinicId,
  userId,
  date,
}: UserNameTitleProps) {
  const [createDayOff, { loading }] = useMutation<CreateDayOffMutation>(
    CREATE_DAY_OFF_DOCUMENT
  );
  const navigate = useNavigate();

  function closePartTime() {
    navigate(ROUTES.reserve, {
      state: {
        isDayOff: true,
        startDate: {
          hour: date.getHours() + UTC_OPTION_KST.hour,
          minute: date.getMinutes() + UTC_OPTION_KST.minute,
          dayIndex: date.getDay(),
        },
        userId,
      },
    });
  }

  function closeDay() {
    if (loading) return;

    const startDate = createDate(date);
    const endDate = createDate(startDate, { hour: 23, minute: 59 });

    createDayOff({
      variables: {
        input: {
          startDate,
          endDate,
          clinicId,
          userId,
        },
      },
      onCompleted(data) {
        const { ok, error } = data.createDayOff;
        simpleCheckGQLError(ok, error);
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
            onClick={closeDay}
          >
            <FontAwesomeIcon icon={faLock} />
            <span>예약잠금(종일)</span>
          </div>
          <div
            className="flex cursor-pointer items-center gap-1 py-1 px-2 hover:bg-gray-200"
            onClick={closePartTime}
          >
            <FontAwesomeIcon icon={faLock} />
            <span>예약잠금</span>
          </div>
        </div>
      </div>
    </div>
  );
}
