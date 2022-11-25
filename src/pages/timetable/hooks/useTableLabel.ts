import { useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { TableTime } from '../../../models/TableTime';
import { tableTimeVar } from '../../../store';
import type { TableTimeOptions } from '../../../types/common.types';

export function useTableLabel() {
  const tableTimeOptions = useReactiveVar(tableTimeVar);

  // get4DigitHour가 ISO Date String을 반환해서 로컬시각으로 표현되지 않는다
  // 그러니 화면 출력할 때 local time으로 변환해야한다
  const [labels, setLabels] = useState(TableTime.labels);

  const changeTableTimeOptions = (options: TableTimeOptions) => {
    TableTime.setValue(options);
  };

  const changeLabels = () => {
    setLabels(TableTime.labels);
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
    if (isChanged(tableTimeOptions, TableTime.value)) {
      changeTableTimeOptions(tableTimeOptions);
      changeLabels();
    }
  }, [tableTimeOptions]);

  return { labels };
}
