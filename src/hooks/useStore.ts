import { useReactiveVar } from '@apollo/client';
import { clinicListsVar, selectedDateVar, selectedInfoVar } from '../store';
import type {
  SetSelectedInfoKey,
  SetSelectedInfoValue,
} from '../types/common.types';

export function useStore() {
  const selectedInfo = useReactiveVar(selectedInfoVar);
  const selectedDate = useReactiveVar(selectedDateVar);

  /**
   * @param callback 필요시 localStorage에 저장하는 함수를 전달합니다
   */
  const setSelectedInfo = (
    key: SetSelectedInfoKey,
    value: SetSelectedInfoValue,
    callback?: () => void
  ) => {
    if (selectedInfo[key] && selectedInfo[key] === value) return;

    selectedInfoVar({ ...selectedInfo, [key]: value });
    if (callback) callback();
  };

  return {
    setSelectedInfo,
    clinicListsVar,
    selectedInfo,
    selectedDate,
  };
}
