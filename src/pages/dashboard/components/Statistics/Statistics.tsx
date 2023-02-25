import DateSelector from './DateSelector';

const Statistics = () => {
  return (
    <div className="grow whitespace-nowrap bg-[#F9F9FF] p-10">
      <StatisticsHeader />
      <DateSelector />
      {/* <Chart /> */}
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
