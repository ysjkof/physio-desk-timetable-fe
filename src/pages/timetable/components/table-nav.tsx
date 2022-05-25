import { useReactiveVar } from "@apollo/client";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { faGear, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react";
import { Switch } from "../../../components/switch";
import { MeQuery } from "../../../graphql/generated/graphql";
import {
  ClinicWithOptions,
  compareDateMatch,
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

interface TableNavProps {
  today: Date;
  daysOfMonth: { date: Date }[];
}

export function TableNav({ today, daysOfMonth }: TableNavProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);

  const onClickToggleUser = (
    clinicLists: ClinicWithOptions[],
    clinicId: number,
    memberId: number
  ) => {
    if (!loggedInUser) return console.log("❌ loggedInUser가 false입니다");
    const gIndex = clinicLists.findIndex(
      (prevClinic) => prevClinic.id === clinicId
    );
    if (gIndex === -1) return;
    const mIndex = clinicLists[gIndex].members.findIndex(
      (prevMember) => prevMember.id === memberId
    );
    if (mIndex === -1) return;
    clinicLists[gIndex].members[mIndex].activation =
      clinicLists[gIndex].members[mIndex].activation === true ? false : true;
    localStorage.setItem(
      LOCALSTORAGE_VIEW_OPTION_CLINICS + loggedInUser.id,
      JSON.stringify(clinicLists)
    );
    clinicListsVar([...clinicLists]);
  };

  const onClickChangeSelectClinic = (id: number, name: string) => {
    if (!loggedInUser) return console.log("❌ loggedInUser가 false입니다");
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
  if (!loggedInUser) return <></>;
  return (
    <nav className="container-header mb-3 px-2 pb-4 shadow-b">
      <div className="flex justify-between">
        <div className="flex">
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
        </div>
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
                    clinicLists.map((clinic) => (
                      <Fragment key={clinic.id}>
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
                          {clinic.members.map((member) => (
                            <ButtonCheck
                              key={member.id}
                              isActivated={clinic.id === selectedClinic.id}
                              isMemberActivated={member.activation}
                              name={member.user.name}
                              onClickFx={() =>
                                onClickToggleUser(
                                  clinicLists,
                                  clinic.id,
                                  member.id
                                )
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
      {viewOptions.navigationExpand && (
        <div className="mx-4 mt-4 flex items-center justify-between">
          <MoveXBtn
            direction={"prev"}
            dateNavExpand={viewOptions.navigationExpand}
          />
          <div className="grid w-full grid-cols-7">
            {daysOfMonth.map((day, i) => (
              <div
                onClick={() => selectedDateVar(day.date)}
                key={i}
                className={cls(
                  "flex w-full cursor-pointer flex-col text-center hover:border-b-gray-500 hover:font-extrabold",
                  compareDateMatch(day.date, selectedDate, "ymd")
                    ? "border-b-2 border-sky-400 font-bold"
                    : "border-b-2 border-transparent"
                )}
              >
                <span
                  className={cls(
                    "rounded-full",
                    day.date.getDay() === 0
                      ? "text-red-600"
                      : day.date.getDay() === 6
                      ? "text-blue-600"
                      : "text-gray-600",
                    selectedDate.getDate() === day.date.getDate()
                      ? "opacity-100"
                      : "opacity-80",
                    selectedDate.getMonth() !== day.date.getMonth()
                      ? "opacity-30"
                      : ""
                  )}
                >
                  {day.date.getDate()}
                </span>
              </div>
            ))}
          </div>
          <MoveXBtn
            direction={"after"}
            dateNavExpand={viewOptions.navigationExpand}
          />
        </div>
      )}
    </nav>
  );
}
