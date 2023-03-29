import { ChangeEvent, useState } from 'react';
import TableChartCard from './TableChartCard';
import { useDebouncedCallback } from '../../../../../hooks';
import { CheckableButton, SearchInput } from '../../../../../components';
import type { TableChartProps } from '../../../../../types/propsTypes';

const TableChart = (props: TableChartProps) => {
  const { countList, disabledIds, toggleUserId, toggleAllUser, members } =
    props;

  const [query, setQuery] = useState('');

  let pickedCount =
    members.reduce((acc, member) => {
      return acc + (disabledIds.has(member.user.id) ? 0 : 1);
    }, 0) || 0;

  const checked = Boolean(members.length !== disabledIds.size);

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
          {pickedCount} / {members.length}명
        </div>
        {countList &&
          members.map((member) => {
            const {
              user: { id: userId },
            } = member;

            const countListItem = countList[userId];

            return (
              <TableChartCard
                key={userId}
                member={member}
                {...countListItem}
                query={query}
                isActive={!disabledIds.has(userId)}
                onClick={() => toggleUserId(userId)}
              />
            );
          })}
      </div>
    </div>
  );
};

export default TableChart;
