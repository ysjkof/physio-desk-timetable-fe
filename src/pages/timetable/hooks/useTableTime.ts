import { useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { TableTime, TableTimeOptions } from '../../../models/TableTime';
import { tableTimeVar } from '../../../store';

export function useTableTime() {
  const tableTimeOptions = useReactiveVar(tableTimeVar);
  const tableTimeService = TableTime;

  // get4DigitHour가 ISO Date String을 반환해서 로컬시각으로 표현되지 않는다
  // 그러니 화면 출력할 때 local time으로 변환해야한다
  const [labels, setLabels] = useState(tableTimeService.labels);

  const changeTableTimeOptions = (options: TableTimeOptions) => {
    tableTimeService.setTime(options);
  };

  const changeLabels = () => {
    setLabels(tableTimeService.labels);
  };

  const isChanged = (
    options1: typeof tableTimeOptions,
    options2: typeof tableTimeOptions
  ) => {
    let result = false;
    for (const _key in options1) {
      const key = _key as keyof typeof tableTimeOptions;
      if (options1[key] !== options2[key]) {
        result = true;
        break;
      }
    }
    return result;
  };

  useEffect(() => {
    if (isChanged(tableTimeOptions, tableTimeService.time)) {
      changeTableTimeOptions(tableTimeOptions);
      changeLabels();
    }
  }, [tableTimeOptions]);

  return { labels };
}
