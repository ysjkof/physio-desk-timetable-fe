import { useReactiveVar } from "@apollo/client";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { faGear, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useState } from "react";
import { Switch } from "../../../components/switch";
import {
  compareDateMatch,
  getWeeksOfMonth,
} from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import {
  clinicListsVar,
  IViewOption,
  loggedInUserVar,
  selectedClinicVar,
  selectedDateVar,
  viewOptionsVar,
} from "../../../store";
import {
  LOCALSTORAGE_SELECTED_CLINIC,
  LOCALSTORAGE_VIEW_OPTION,
  LOCALSTORAGE_VIEW_OPTION_CLINICS,
  ONE_DAY,
  ONE_WEEK,
} from "../../../variables";
import { ButtonCheck } from "./button-check";
import { MoveXBtn } from "./move-x-btn";
import { TableNav } from "./table-nav";
import { TableNavExpand } from "./table-nav-expand";

interface TableNavProps {
  today: Date;
  weeks: { date: Date }[];
}

export function TableHeader({ today, weeks }: TableNavProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const [daysOfMonths, setDaysOfMonths] = useState<
    [{ date: Date }[], { prevMonth: Date; nowMonth: Date; nextMonth: Date }]
  >([getWeeksOfMonth(selectedDate), getThreeDate(selectedDate)]);

  function getThreeDate(date: Date) {
    const prevMonth = new Date(date);
    const nowMonth = new Date(date);
    const nextMonth = new Date(date);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return { prevMonth, nowMonth, nextMonth };
  }
  const onClickMoveX = (option: "prevMonth" | "nextMonth") => {
    const months = getWeeksOfMonth(daysOfMonths[1][option]);
    const threeDate = getThreeDate(daysOfMonths[1][option]);
    setDaysOfMonths([months, threeDate]);
  };

  const onClickToggleUser = (clinicId: number, memberId: number) => {
    if (!loggedInUser) return console.warn("❌ loggedInUser가 false입니다");
    const gIndex = clinicLists.findIndex(
      (prevClinic) => prevClinic.id === clinicId
    );
    if (gIndex === -1) return console.warn("❌ group index가 -1입니다");
    const mIndex = clinicLists[gIndex].members.findIndex(
      (prevMember) => prevMember.id === memberId
    );
    if (mIndex === -1) return console.warn("❌ member index가 -1입니다");

    const activateLength = clinicLists[gIndex].members.filter(
      (member) => member.activation
    ).length;
    let isActivate = clinicLists[gIndex].members[mIndex].activation;

    if (isActivate && activateLength === 1) {
      return;
    }
    clinicLists[gIndex].members[mIndex].activation = !isActivate;
    localStorage.setItem(
      LOCALSTORAGE_VIEW_OPTION_CLINICS + loggedInUser.id,
      JSON.stringify(clinicLists)
    );
    clinicListsVar([...clinicLists]);
  };

  const onClickChangeSelectClinic = (id: number, name: string) => {
    if (!loggedInUser) return console.warn("❌ loggedInUser가 false입니다");
    let newSelectedClinic = selectedClinic;
    if (selectedClinic.id === id) {
      newSelectedClinic = {
        id: 0,
        name: "",
      };
    } else {
      newSelectedClinic = {
        id,
        name,
      };
    }
    localStorage.setItem(
      LOCALSTORAGE_SELECTED_CLINIC + loggedInUser.id,
      JSON.stringify(newSelectedClinic)
    );
    selectedClinicVar(newSelectedClinic);
  };
  if (!loggedInUser || !viewOptions) return <></>;
  return (
    <nav className="container-header w-full">
      <div className="flex justify-between">
        <button
          className="min-w-[120px] text-sm font-medium text-gray-700 hover:font-bold"
          onClick={() => selectedDateVar(today)}
        >
          {selectedDate.toLocaleString("ko-KR", {
            year: "2-digit",
            month: "short",
            day: "numeric",
            weekday: "short",
          })}
        </button>

        <div className="flex w-full items-center justify-end space-x-3">
          <div className="group-view-controller relative">
            <div
              className="flex cursor-pointer items-center gap-1"
              onClick={() => {
                const newViewOptions = {
                  ...viewOptions,
                  seeActiveOption: !viewOptions.seeActiveOption,
                };
                localStorage.setItem(
                  LOCALSTORAGE_VIEW_OPTION + loggedInUser.id,
                  JSON.stringify(newViewOptions)
                );
                viewOptionsVar(newViewOptions);
              }}
            >
              <span>보기설정</span>
              <FontAwesomeIcon icon={faGear} fontSize="medium" />
            </div>
            {viewOptions.seeActiveOption && (
              <div className="absolute top-6 z-50 h-96 w-60 rounded-md bg-white p-4 shadow-cst">
                <div className="mb-2 flex justify-between border-b pb-2">
                  <div className="w-full"></div>
                  <div className="flex w-14 whitespace-nowrap">
                    <div className="group relative w-full space-x-1 text-center">
                      <span>보기</span>
                      <span className="rounded-full border border-gray-400 px-1">
                        ?
                      </span>
                      <p className="bubble-arrow-t-center absolute top-7 right-1/2 hidden w-48 translate-x-1/2 rounded-md bg-black p-4 text-white group-hover:block">
                        시간표에 표시할 병원이나 사용자를 선택합니다.
                      </p>
                    </div>
                  </div>
                </div>
                <ul className="h-full  overflow-y-scroll">
                  {clinicLists === null || clinicLists.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      소속된 병원이 없습니다.
                    </div>
                  ) : (
                    clinicLists.map((clinic, i) => (
                      <Fragment key={i}>
                        <ButtonCheck
                          name={clinic.name}
                          isActivated={clinic.id === selectedClinic.id}
                          onClickFx={() =>
                            onClickChangeSelectClinic(clinic.id, clinic.name)
                          }
                        />
                        <ul
                          className={cls(
                            clinic.id === selectedClinic.id
                              ? ""
                              : "pointer-events-none"
                          )}
                        >
                          {clinic.members.map((member, i) => (
                            <ButtonCheck
                              key={i}
                              isActivated={clinic.id === selectedClinic.id}
                              isMemberActivated={member.activation}
                              name={member.user.name}
                              onClickFx={() =>
                                onClickToggleUser(clinic.id, member.id)
                              }
                            />
                          ))}
                        </ul>
                        <div className="seperate-bar"></div>
                      </Fragment>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
          <Switch
            enabled={viewOptions.seeCancel}
            label={"취소"}
            onClick={() => {
              const newViewOptions = {
                ...viewOptions,
                seeCancel: !viewOptions.seeCancel,
              };
              localStorage.setItem(
                LOCALSTORAGE_VIEW_OPTION + loggedInUser.id,
                JSON.stringify(newViewOptions)
              );
              viewOptionsVar(newViewOptions);
            }}
          />
          <Switch
            enabled={viewOptions.seeNoshow}
            label={"부도"}
            onClick={() => {
              const newViewOptions = {
                ...viewOptions,
                seeNoshow: !viewOptions.seeNoshow,
              };
              localStorage.setItem(
                LOCALSTORAGE_VIEW_OPTION + loggedInUser.id,
                JSON.stringify(newViewOptions)
              );
              viewOptionsVar(newViewOptions);
            }}
          />
          <Switch
            enabled={viewOptions.periodToView === ONE_DAY ? false : true}
            label={"1주일"}
            onClick={() => {
              const newViewOptions: IViewOption = {
                ...viewOptions,
                periodToView:
                  viewOptions.periodToView === ONE_DAY ? ONE_WEEK : ONE_DAY,
              };
              localStorage.setItem(
                LOCALSTORAGE_VIEW_OPTION + loggedInUser.id,
                JSON.stringify(newViewOptions)
              );
              viewOptionsVar(newViewOptions);
            }}
          />
        </div>
        <div className="flex w-full items-center justify-end space-x-5">
          <FontAwesomeIcon
            icon={faCalendarAlt}
            fontSize={"large"}
            onClick={() => {
              const newViewOptions = {
                ...viewOptions,
                navigationExpand: !viewOptions.navigationExpand,
              };
              localStorage.setItem(
                LOCALSTORAGE_VIEW_OPTION + loggedInUser.id,
                JSON.stringify(newViewOptions)
              );
              viewOptionsVar(newViewOptions);
            }}
            className={cls(
              viewOptions.navigationExpand ? "text-gray-700" : "text-gray-400",
              "w-4 cursor-pointer hover:text-gray-500"
            )}
          />
          <FontAwesomeIcon
            icon={faList}
            fontSize={"large"}
            onClick={() => {
              const newViewOptions = {
                ...viewOptions,
                seeList: !viewOptions.seeList,
              };
              localStorage.setItem(
                LOCALSTORAGE_VIEW_OPTION + loggedInUser.id,
                JSON.stringify(newViewOptions)
              );
              viewOptionsVar(newViewOptions);
            }}
            className={cls(
              viewOptions.seeList ? "text-gray-700" : "text-gray-400",
              "w-4 cursor-pointer hover:text-gray-500"
            )}
          />
        </div>
      </div>
      <AnimatePresence>
        {viewOptions.navigationExpand ? (
          <TableNavExpand />
        ) : (
          <TableNav weeks={weeks} />
        )}
      </AnimatePresence>
    </nav>
  );
}
