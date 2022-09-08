export function cls(...classnames: string[]) {
  return classnames.join(' ');
}

export function getPositionRef(
  ref: React.RefObject<HTMLDivElement>,
  modalGap: number
) {
  const height = ref.current?.getBoundingClientRect().height ?? 0;
  const top =
    ref.current?.getBoundingClientRect().top! + height + modalGap ?? 0;
  const left = ref.current?.getBoundingClientRect().left ?? 0;
  return { top, left };
}

export function checkMember(staying: boolean, accepted: boolean) {
  if (!staying) {
    return accepted ? '탈퇴' : '수락대기';
  } else {
    return accepted ? '직원' : null;
  }
  // if (staying && accepted) return "직원";
  // if (!staying && !accepted) return "수락대기";
  // if (!staying && accepted) return "탈퇴";
}
interface CheckManager {
  id: number;
  manager: boolean;
  user: { id: number };
}
export function checkManager(members: CheckManager[], userId: number) {
  const managerId = members.find((member) => member.manager)?.user.id;
  return managerId && managerId === userId;
}

export function makeArrFromLength(length: number) {
  const arr: number[] = [];
  arr.length = length;
  arr.fill(0);
  return arr;
}

export function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

export const removeItemInArrayByIndex = (index: number, array: any[]) => [
  ...array.slice(0, index),
  ...array.slice(index + 1),
];

export function changeValueInArray<T>(array: T[], value: T, index: number) {
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}

//

const removePersonalClinicNumber = (name: string) => {
  const splitted = name.split(':');
  return splitted.length < 2 ? null : splitted[0];
};
export const renameUseSplit = (name: string) => {
  const isSplit = removePersonalClinicNumber(name);
  return isSplit ? '개인 : ' + isSplit : name;
};
