import { TableTime } from '../../../models/TableTime';
import { tableTimeVar } from '../../../store';
import type { FirstAndLastTime } from '../../../types/common.types';

export const useTableTime = () => {
  const changeTableTIme = (key: keyof FirstAndLastTime, value: number) => {
    const options = TableTime.createTimeOptions(key, value);
    TableTime.setValue(options);
    TableTime.saveToLocalStorage(options);
    tableTimeVar(options);
  };

  return { changeTableTIme };
};
