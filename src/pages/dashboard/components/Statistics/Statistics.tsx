import DateSelector from './DateSelector';
import { TableChart } from './TableChart';

const Statistics = () => {
  return (
    <div className="flex grow flex-col whitespace-nowrap bg-[#F9F9FF] p-10">
      <StatisticsHeader />
      <DateSelector />
      <div className="flex justify-between gap-8">
        <div className="">그래픽차트</div>
        {/* <Chart /> */}
        <TableChart />
      </div>
    </div>
  );
};

const StatisticsHeader = () => {
  return (
    <div className="mb-8 flex items-center justify-between gap-6">
      <h1 className="text-2xl font-semibold text-[#262850]">예약통계</h1>
      <div />
    </div>
  );
};

export default Statistics;
