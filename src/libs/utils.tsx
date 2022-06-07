import { ModifiedClinic } from "../pages/dashboard";
import {
  clinicListsVar,
  IViewOption,
  selectedClinicVar,
  viewOptionsVar,
} from "../store";
import {
  LOCALSTORAGE_SELECTED_CLINIC,
  LOCALSTORAGE_CLINIC_LISTS,
  LOCALSTORAGE_VIEW_OPTION,
} from "../variables";
import { ClinicWithOptions } from "./timetable-utils";

export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export function getDateFromYMDHM(
  startDateYear: number,
  startDateMonth: number,
  startDateDate: number,
  startDateHours?: number,
  startDateMinutes?: number
) {
  const ymd = `${startDateYear}-${String(startDateMonth).padStart(
    2,
    "0"
  )}-${String(startDateDate).padStart(2, "0")}`;
  let hms = `T00:00:00.000`;
  if (
    typeof startDateHours === "number" &&
    typeof startDateMinutes === "number"
  ) {
    hms = `T${String(startDateHours).padStart(2, "0")}:${String(
      startDateMinutes
    ).padStart(2, "0")}:00.000`;
  }
  return new Date(ymd + hms);
}

export function getPositionRef(
  ref: React.RefObject<HTMLDivElement>,
  modalGap: number
): [top: number, left: number] {
  const height = ref.current?.getBoundingClientRect().height ?? 0;
  const top =
    ref.current?.getBoundingClientRect().top! + height + modalGap ?? 0;
  const left = ref.current?.getBoundingClientRect().left ?? 0;
  return [top, left];
}

export function saveSelectedClinic(
  newSelectedClinic: ModifiedClinic,
  loggedInUserId: number
) {
  localStorage.setItem(
    LOCALSTORAGE_SELECTED_CLINIC + loggedInUserId,
    JSON.stringify(newSelectedClinic)
  );
  selectedClinicVar(newSelectedClinic);
}
export function saveClinicLists(
  newClinicList: ClinicWithOptions[],
  loggedInUserId: number
) {
  localStorage.setItem(
    LOCALSTORAGE_CLINIC_LISTS + loggedInUserId,
    JSON.stringify(newClinicList)
  );
  clinicListsVar(newClinicList);
}
export function saveViewOptions(
  newViewOptions: IViewOption,
  loggedInUserId: number
) {
  localStorage.setItem(
    LOCALSTORAGE_VIEW_OPTION + loggedInUserId,
    JSON.stringify(newViewOptions)
  );
  viewOptionsVar(newViewOptions);
}
