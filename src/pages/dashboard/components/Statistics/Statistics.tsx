import DateSelector from './DateSelector';
import { GraphChart } from './GraphChart';
import { TableChart } from './TableChart';
import { useStatistics } from '../../hooks/useStatistics';
import { useWindowSize } from '../../../../hooks';

const Statistics = () => {
  const { height } = useWindowSize(true);
  const { countList, data } = useStatistics();

  return (
    <div
      className="flex gap-4 overflow-hidden whitespace-nowrap bg-[#F9F9FF] px-10 pt-6"
      style={{ height }}
    >
      <div className="flex grow flex-col justify-between gap-6 overflow-scroll pb-10">
        <h1 className="text-2xl font-semibold text-[#262850]">예약통계</h1>
        <GraphChart data={data} />
      </div>
      <div className="flex flex-col gap-6">
        <DateSelector />
        <TableChart countList={countList} />
      </div>
    </div>
  );
};

export default Statistics;
