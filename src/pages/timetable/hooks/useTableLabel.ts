import { useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { TableTime } from '../../../models/TableTime';
import { tableTimeVar } from '../../../store';
import type { TableTimeOptions } from '../../../types/common.types';

export const useTableLabel = () => {
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

  useEffect(() => {
    changeTableTimeOptions(tableTimeOptions);
    changeLabels();
  }, [tableTimeOptions]);

  return { labels };
};
