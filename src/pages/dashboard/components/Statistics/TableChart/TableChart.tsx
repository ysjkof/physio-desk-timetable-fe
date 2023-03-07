import { ChangeEvent, useState } from 'react';
import TableChartCard from './TableChartCard';
import { useDebouncedCallback, useGetClinic } from '../../../../../hooks';
import { CheckableButton, SearchInput } from '../../../../../components';
import type { TableChartProps } from '../../../../../types/propsTypes';

const TableChart = ({
  countList,
  disabledIds,
  toggleUserId,
  toggleAllUser,
}: TableChartProps) => {
  const [clinic] = useGetClinic();
  const [query, setQuery] = useState('');

  const arrayedCountList = Object.entries(countList || {});

  let pickedCount = arrayedCountList.reduce((acc, [key]) => {
    const numKey = Number.parseInt(key, 10);
    return acc + (disabledIds.has(numKey) ? 0 : 1);
  }, 0);

  const checked = arrayedCountList.length !== disabledIds.size;

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQuery(value);
  };
  const debounceQuery = useDebouncedCallback(handleInput);

  return (
    <div className="table-chart h-[88%] w-[270px] gap-3">
      <SearchInput
        id="table-chart__search-patient"
        name="table-chart__search-patient"
        placeholder="치료사 검색"
        onChange={debounceQuery}
      />
      <div className="flex w-full flex-col gap-2 overflow-y-scroll p-1">
        <div className="flex items-center justify-between text-right text-sm leading-3">
          <CheckableButton
            checked={checked}
            color="black"
            label="전체"
            onClick={toggleAllUser}
          />
          {pickedCount} / {arrayedCountList.length}명
        </div>
        {countList &&
          arrayedCountList.map(([key, value]) => {
            const numKey = Number.parseInt(key, 10);
            pickedCount += !disabledIds.has(numKey) ? 1 : 0;
            const color = clinic?.members.find(
              (member) => member.user.id === +key
            )?.color?.value;

            return (
              <TableChartCard
                key={key}
                userId={key}
                {...value}
                query={query}
                isActive={!disabledIds.has(numKey)}
                onClick={() => toggleUserId(numKey)}
                color={color}
              />
            );
          })}
      </div>
    </div>
  );
};

export default TableChart;
