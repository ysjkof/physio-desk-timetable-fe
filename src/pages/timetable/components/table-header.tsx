import { useReactiveVar } from "@apollo/client";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence } from "framer-motion";
import { BtnDot } from "../../../components/button-dot";
import { cls } from "../../../libs/utils";
import {
  IViewOption,
  loggedInUserVar,
  selectedDateVar,
  viewOptionsVar,
} from "../../../store";
import {
  LOCALSTORAGE_VIEW_OPTION,
  ONE_DAY,
  ONE_WEEK,
} from "../../../variables";
import { TableClinicSelector } from "./table-clinic-selector";
import { TableNav } from "./table-nav";
import { TableNavExpand } from "./table-nav-expand";

interface TableNavProps {
  today: Date;
  weeks: { date: Date }[];
}

export function TableHeader({ today, weeks }: TableNavProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);

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
        <TableClinicSelector></TableClinicSelector>
        <div className="flex w-full items-center justify-end space-x-3">
          <BtnDot
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
          <BtnDot
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
          <BtnDot
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
