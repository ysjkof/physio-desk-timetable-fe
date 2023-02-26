import { VictoryArea, VictoryAxis, VictoryChart } from 'victory';
import type { TotalGraphProps } from '../../../../../types/propsTypes';

export const DailyCancelationGraph = ({ data }: TotalGraphProps) => {
  const total = data?.reduce((acc, cur) => acc + cur.y.cancel, 0);
  return (
    <div className="graph-chart__total-graph">
      <div className="graph-chart__graph-title border-l-[#FF567F]">
        <h2 className="">일별취소</h2>
        <span className="text-base text-[#A0A0C2]">총합: {total}</span>
      </div>

      <svg style={{ height: 0, width: 0 }}>
        <defs>
          <linearGradient id="myGradient">
            <stop offset="0%" stopColor=" rgba(119,206,218,1)" />
            <stop offset="100%" stopColor=" rgba(121,100,200,1)" />
          </linearGradient>
        </defs>
      </svg>

      <VictoryChart
        padding={{ top: 25, bottom: 18, left: 25, right: 15 }}
        theme={{
          axis: {
            style: {
              axis: { stroke: '#D9D9D9' },
              grid: { stroke: '#D9D9D9', strokeWidth: 0 },
              tickLabels: { fontSize: 8, padding: 5 },
            },
          },
        }}
        height={100}
      >
        <VictoryArea
          style={{
            data: {
              stroke: 'url(#myGradient)',
              strokeWidth: 1,
              fill: '#E4EBF8',
            },
          }}
          data={data}
          y="y.cancel"
        />
        <VictoryAxis
          crossAxis
          tickFormat={(tick) => new Date(tick).getDate()}
          style={{ grid: { strokeWidth: 1 } }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(tick) => {
            const value = Number.isInteger(tick) ? tick : 0;
            return `${value}명`;
          }}
        />
      </VictoryChart>
    </div>
  );
};
