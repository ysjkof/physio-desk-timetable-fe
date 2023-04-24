import DateSelector from './DateSelector';
import { GraphChart } from './GraphChart';
import { TableChart } from './TableChart';
import { useStatistics } from '../../hooks/useStatistics';
import { useWindowSize } from '../../../../hooks';
import { Helmet } from 'react-helmet-async';
import { SERVICE_NAME } from '../../../../constants/constants';

const Statistics = () => {
  const { height } = useWindowSize(true);
  const {
    countList,
    data,
    disabledUserIds,
    toggleUserId,
    toggleAllUser,
    date,
    setDate,
    members,
  } = useStatistics();

  return (
    <>
      <Helmet title={`통계 | ${SERVICE_NAME.ko}`} />
      <div
        className="flex overflow-hidden whitespace-nowrap bg-[#F9F9FF] px-10 pt-6"
        style={{ height }}
      >
        <div className="flex grow flex-col justify-between gap-6 overflow-scroll pb-10 pr-4">
          <h1 className="dashboard-menu-title">예약통계</h1>
          <GraphChart data={data} disabledIds={disabledUserIds} />
        </div>
        <div className="flex flex-col gap-6">
          <DateSelector date={date} setDate={setDate} />
          <TableChart
            countList={countList}
            disabledIds={disabledUserIds}
            toggleUserId={toggleUserId}
            toggleAllUser={toggleAllUser}
            members={members}
          />
        </div>
      </div>
    </>
  );
};

export default Statistics;
