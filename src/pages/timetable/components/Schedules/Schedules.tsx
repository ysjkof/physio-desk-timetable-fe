import { compareDateMatch } from '../../../../services/dateServices';
import useStore from '../../../../hooks/useStore';
import { VIEW_PERIOD } from '../../../../constants/constants';
import { getGridTemplateColumns } from '../../../timetableServices';
import DateTitle from './DateTitle';
import ScheduleBox from './ScheduleBox';
import ReservationButtons from './ReserveButtons';
import ScheduleInUserInDay from '../../_legacy_components/molecules/ScheduleInUserInDay';
import type { DayWithUsers } from '../../../../types/common.types';

interface SchedulesProps {
  weekEvents: DayWithUsers[];
  labels: string[];
  userLength: number;
}
function Schedules({ weekEvents, labels, userLength }: SchedulesProps) {
  const today = new Date();
  const { viewOptions, selectedDate } = useStore();

  const labelMaxLength = labels.length;

  const schedules =
    viewOptions.get.viewPeriod === VIEW_PERIOD.ONE_DAY
      ? weekEvents && [weekEvents[selectedDate.getDay()]]
      : weekEvents;

  const userGridCol = getGridTemplateColumns(userLength);
  const viewPeriodStyle = {
    [VIEW_PERIOD.ONE_DAY]: {
      template: {},
      userColumn: {
        gridTemplateColumns: userGridCol,
      },
    },
    [VIEW_PERIOD.ONE_WEEK]: {
      template: {
        gridTemplateColumns: getGridTemplateColumns(7, userLength * 6),
      },
      userColumn: {
        gridTemplateColumns: userGridCol,
      },
    },
  };

  return (
    <div
      className="SCHEDULES grid w-full gap-4 overflow-hidden"
      style={viewPeriodStyle[viewOptions.get.viewPeriod].template}
    >
      {schedules.map((day, i) => (
        <div key={i} className="flex flex-col">
          <DateTitle
            userLength={userLength}
            date={day.date}
            isToday={compareDateMatch(today, day.date, 'ymd')}
            isSelectedMonth={compareDateMatch(selectedDate, day.date, 'ym')}
          />
          <ScheduleBox
            userLength={userLength}
            viewPeriodStyle={
              viewPeriodStyle[viewOptions.get.viewPeriod].userColumn
            }
            enableTimeIndicator={compareDateMatch(
              day.date,
              selectedDate,
              'ymd'
            )}
          >
            {day.users.map((member, userIndex) => {
              return (
                member.isActivate && (
                  <div
                    key={member.id}
                    className="USER_COL relative w-full divide-y divide-table-line bg-table-bg hover:bg-gray-200/50"
                  >
                    <ReservationButtons
                      labelMaxLength={labelMaxLength}
                      date={day.date}
                      labels={labels}
                      userId={member.user.id}
                      userIndex={userIndex}
                    />
                    <ScheduleInUserInDay
                      labelMaxLength={labelMaxLength}
                      labels={labels}
                      events={member.events}
                      userIndex={userIndex}
                      isSingleUser={userLength === 1}
                    />
                  </div>
                )
              );
            })}
          </ScheduleBox>
        </div>
      ))}
    </div>
  );
}

export default Schedules;
