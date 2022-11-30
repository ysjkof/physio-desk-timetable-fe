import { toastVar } from '../store';

export function cls(...classnames: string[]) {
  return classnames.join(' ');
}

export function getPositionRef(
  ref: React.RefObject<HTMLDivElement | HTMLButtonElement>,
  modalGap?: number
) {
  if (!ref.current) return { top: 0, left: 0 };
  const {
    height,
    left,
    right,
    width,
    top: refTop,
  } = ref.current.getBoundingClientRect();

  const top = refTop + height + (modalGap || 0);
  return { top, width, left, right };
}

export function getMemberState(
  staying: boolean,
  accepted: boolean,
  manager?: boolean
) {
  if (!staying) {
    return accepted ? '탈퇴' : '승인대기';
  }

  return manager ? '관리자' : '직원';
  // if (staying && accepted) return "직원";
  // if (!staying && !accepted) return "수락대기";
  // if (!staying && accepted) return "탈퇴";
}

export type StayingState = ReturnType<typeof getMemberState>;

export function isStayMember(state: StayingState) {
  let result = false;
  switch (state) {
    case '승인대기':
      break;
    case '관리자':
      result = true;
      break;
    case '직원':
      result = true;
      break;
    case '탈퇴':
      break;
  }
  return result;
}

interface CheckManager {
  id: number;
  manager: boolean;
  user: { id: number };
}

export function checkManager(members: CheckManager[], userId: number) {
  const managerId = members.find((member) => member.manager)?.user.id;
  return !!(managerId && managerId === userId);
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

export function removeItemInArrayByIndex(index: number, array: any[]) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function changeValueInArray<T>(array: T[], value: T, index: number) {
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}

export function renameUseSplit(name: string) {
  const isSplit = removePersonalClinicNumber(name);
  return isSplit ? '전용 : ' + isSplit : name;
}

function removePersonalClinicNumber(name: string) {
  const splitted = name.split(':');
  return splitted.length < 2 ? null : splitted[0];
}

/** ok, error만 있는 GraphQL 응답을 받고 토스트 출력이나 콜백 실행 */
export function simpleCheckGQLError(
  ok: boolean,
  error?: string | null,
  callback?: () => void
) {
  if (error) {
    toastVar({ messages: [`오류가 발생했습니다; ${error}`] });
  }
  if (callback && ok) callback();
}

export function checkArrayIncludeValue<T>(arr: T[] | undefined | null) {
  if (!arr) return false;
  return arr.length >= 1 ? arr : false;
}

export function createArrayFromLength(length: number) {
  const numbers = [1];
  while (numbers.length < length) {
    numbers.push(numbers.length + 1);
  }
  return numbers;
}
