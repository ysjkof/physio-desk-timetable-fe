import { type KeyboardEvent, useState, Dispatch } from 'react';
import { VictoryArea, VictoryAxis, VictoryChart } from 'victory';
import { Loading } from '../../../../../components';
import type { DailyGraphProps } from '../../../../../types/propsTypes';
import { LOCALE } from '../../../../../constants/constants';

export const DailyGraph = ({ data, type }: DailyGraphProps) => {
  const total = data?.reduce((acc, cur) => acc + cur.y[type], 0) || 0;
  const [yDomainMax, setYDomainMax] = useState(0);

  const TITLE = {
    cancel: '일별취소',
    newPatient: '일별신환',
    noshow: '일별부도',
    reservationCount: '총방문',
  };
  const COLOR = {
    cancel: ['#FFC2F2', '#FF567F'],
    newPatient: ['#ffedb5', '#ffd556'],
    noshow: ['#C2F0F0', '#3BC2C2'],
    reservationCount: ['#77CEDA', '#7964C8'],
  };
  const gradientId = `dailyGraphGradient-${type}`;

  if (!data) return <Loading />;

  return (
    <div className="graph-chart__total-graph">
      <div
        className="graph-chart__graph-header"
        style={{ borderColor: COLOR[type][1] }}
      >
        <h2>{TITLE[type]}</h2>
        <div className="flex items-center gap-8">
          <span className="text-base">
            전체 {new Intl.NumberFormat(LOCALE).format(total)}명
          </span>
          <FormOfYDomainMax setYDomainMax={setYDomainMax} />
        </div>
      </div>
      <div>
        <svg style={{ height: 0, width: 0 }}>
          <defs>
            <linearGradient id={gradientId}>
              <stop offset="0%" stopColor={COLOR[type][0]} />
              <stop offset="100%" stopColor={COLOR[type][1]} />
            </linearGradient>
          </defs>
        </svg>

        <VictoryChart
          padding={{ top: 10, bottom: 24, left: 24, right: 12 }}
          theme={{
            axis: {
              style: {
                axis: { stroke: '#D9D9D9' },
                grid: { stroke: '#D9D9D9', strokeWidth: 0 },
                tickLabels: { fontSize: 7, padding: 3, fontWeight: 300 },
                axisLabel: { fontSize: 8, fontWeight: 400 },
              },
            },
          }}
          height={80}
        >
          <VictoryArea
            style={{
              data: {
                stroke: `url(#${gradientId})`,
                strokeWidth: 1,
                fill: '#E4EBF8',
              },
            }}
            data={data}
            y={`y.${type}`}
          />
          <VictoryAxis
            crossAxis
            tickFormat={(tick) => {
              if (typeof tick !== 'string') return null;
              return new Date(tick).getDate();
            }}
            style={{ axisLabel: { padding: 13 }, grid: { strokeWidth: 1 } }}
            label="일"
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(tick) => {
              if (!Number.isInteger(tick)) return null;
              return tick;
            }}
            style={{ axisLabel: { padding: 16, angle: 0 } }}
            label="명"
            domain={yDomainMax ? { y: [0, yDomainMax] } : undefined}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

const FormOfYDomainMax = ({
  setYDomainMax,
}: {
  setYDomainMax: Dispatch<React.SetStateAction<number>>;
}) => {
  const handleSubmit = (data: KeyboardEvent<HTMLInputElement>) => {
    if (data.key !== 'Enter') return;
    setYDomainMax(Number.parseInt(data.currentTarget.value, 10));
  };

  return (
    <label className="flex-end relative z-10 text-xs">
      <span className="mr-1">최대 명수</span>
      <input
        type="number"
        className="w-11 border pr-4 pl-1"
        placeholder="숫자"
        onKeyDown={handleSubmit}
      />
      <span className="position-center-y absolute right-1">명</span>
    </label>
  );
};
