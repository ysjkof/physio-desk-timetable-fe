import { useReactiveVar } from '@apollo/client';
import {
  clinicListsVar,
  selectedDateVar,
  selectedInfoVar,
  viewOptionsVar,
} from '../store';
import {
  IClinicList,
  SetSelectedInfoKey,
  SetSelectedInfoValue,
} from '../types/type';

export function makeSelectedClinic(clinic: IClinicList, userId: number) {
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
  // console.log('store');

  const viewOptions = useReactiveVar(viewOptionsVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const selectedInfo = useReactiveVar(selectedInfoVar);
  const selectedDate = useReactiveVar(selectedDateVar);

  const setSelectedInfo = (
    key: SetSelectedInfoKey,
    value: SetSelectedInfoValue,
    callback?: () => void
  ) => {
    if (selectedInfo[key] === value) return;
    selectedInfoVar({ ...selectedInfo, [key]: value });
    if (callback) callback();
  };

  return {
    setSelectedInfo,
    viewOptions,
    clinicLists,
    selectedInfo,
    selectedDate,
  };
}
