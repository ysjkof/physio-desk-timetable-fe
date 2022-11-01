import useStore from '../../../../hooks/useStore';
import { compareDateMatch } from '../../../../services/dateServices';
import {
  getGridTemplateColumns,
  getTableCellWidth,
} from '../../../timetableServices';
import DateTitle from './DateTitle';
import { VIEW_PERIOD } from '../../../../constants/constants';
import type { DayWithUsers } from '../../../../types/common.types';

interface TitlesProps {
  userFrameForWeek: DayWithUsers[];
  userLength: number;
}

export default function Titles({ userFrameForWeek, userLength }: TitlesProps) {
  const today = new Date();
  const { viewOptions, selectedDate } = useStore();

  const weekGridCol = getGridTemplateColumns(7, getTableCellWidth(userLength));
  const viewPeriodStyle = {
    [VIEW_PERIOD.ONE_DAY]: {
      dateTitle: { gridTemplateColumns: getGridTemplateColumns(7) },
      userNameTitle: {},
    },
    [VIEW_PERIOD.ONE_WEEK]: {
      dateTitle: {
        gridTemplateColumns: weekGridCol,
      },
      userNameTitle: {
        gridTemplateColumns: weekGridCol,
      },
    },
  };

  return (
    <div className="TITLES sticky top-0 z-[32] shadow-b">
      <div
        className="DATE_TITLE grid w-full"
        style={viewPeriodStyle[viewOptions.get.viewPeriod].dateTitle}
      >
        {userFrameForWeek?.map((day, i) => (
          <DateTitle
            key={i}
            userLength={userLength}
            date={day.date}
            isToday={compareDateMatch(today, day.date, 'ymd')}
            isSelectedMonth={compareDateMatch(selectedDate, day.date, 'ym')}
          />
        ))}
      </div>
    </div>
  );
}
