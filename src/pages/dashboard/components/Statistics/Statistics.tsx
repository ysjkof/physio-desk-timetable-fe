import DateSelector from './DateSelector';
import { GraphChart } from './GraphChart';
import { TableChart } from './TableChart';
import { useStatistics } from '../../hooks/useStatistics';

const Statistics = () => {
  const { countList, data } = useStatistics();

  return (
    <div className="flex grow flex-col whitespace-nowrap bg-[#F9F9FF] p-10">
      <StatisticsHeader />
      <DateSelector />
      <div className="mt-6 flex h-[630px] justify-between gap-8 overflow-hidden">
        <GraphChart data={data} />
        <TableChart countList={countList} />
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
