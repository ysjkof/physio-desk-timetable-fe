import { VictoryArea, VictoryAxis, VictoryChart } from 'victory';
import type { TotalGraphProps } from '../../../../../types/propsTypes';

export const TotalGraph = ({ data }: TotalGraphProps) => {
  return (
    <div className="graph-chart__total-graph">
      <h2 className="graph-chart__graph-title border-l-[rgba(121,100,200,1)]">
        총방문
      </h2>

      <svg style={{ height: 0, width: 0 }}>
        <defs>
          <linearGradient id="myGradient">
            <stop offset="0%" stopColor=" rgba(119,206,218,1)" />
            <stop offset="100%" stopColor=" rgba(121,100,200,1)" />
          </linearGradient>
        </defs>
      </svg>

      <VictoryChart
        padding={{ top: 50, bottom: 50, left: 36, right: 20 }}
        theme={{
          axis: {
            style: {
              axis: { stroke: '#D9D9D9' },
              grid: { stroke: '#D9D9D9', strokeWidth: 0 },
              tickLabels: { fontSize: 10, padding: 10 },
            },
          },
        }}
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
          y="y.reservationCount"
        />
        <VictoryAxis
          crossAxis
          tickFormat={(tick) => new Date(tick).getDate()}
          style={{ grid: { strokeWidth: 1 } }}
        />
        <VictoryAxis dependentAxis tickFormat={(tick) => `${tick}명`} />
      </VictoryChart>
    </div>
  );
};
