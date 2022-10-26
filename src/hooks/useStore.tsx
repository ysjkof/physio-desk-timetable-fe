import { useReactiveVar } from '@apollo/client';
import {
  clinicListsVar,
  selectedDateVar,
  selectedInfoVar,
  viewOptionsVar,
} from '../store';
import {
  IClinicList,
  IViewOption,
  SelectedClinic,
  SetSelectedInfoKey,
  SetSelectedInfoValue,
} from '../types/common.types';

export function makeSelectedClinic(
  clinic: IClinicList,
  userId: number
): SelectedClinic {
  return {
    id: clinic.id,
    name: clinic.name,
    type: clinic.type,
    isManager: !!clinic.members.find((member) => member.user.id === userId)
      ?.manager,
    isStayed: !!clinic.members.find((member) => member.user.id === userId)
      ?.staying,
    members: clinic.members,
  };
}

export default function useStore() {
  const clinicLists = useReactiveVar(clinicListsVar);
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

  const setViewOption = (value: IViewOption, callback?: () => void) => {
    viewOptionsVar(value);

    if (callback) callback();
  };

  const viewOptions = {
    get: useReactiveVar(viewOptionsVar),
    set: setViewOption,
  };

  return {
    setSelectedInfo,
    viewOptions,
    clinicLists,
    clinicListsVar,
    selectedInfo,
    selectedDate,
  };
}
