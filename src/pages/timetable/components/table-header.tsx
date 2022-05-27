import { useReactiveVar } from "@apollo/client";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { faGear, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
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

  const tableNavVarients = {
    ini: (isUp: boolean) => ({ y: isUp ? -5 : 5 }),
    start: { y: 0, transition: { type: "tween", duration: 0.4 } },
  };

  if (!loggedInUser || !viewOptions) return <></>;
  return (
    <motion.nav
      initial={{ y: -20 }}
      animate={{
        y: 0,
        transition: { type: "tween", duration: 0.4 },
      }}
      className="container-header w-full"
    >
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
              "w-4 cursor-pointer hover:animate-bounce hover:text-gray-500",
              viewOptions.navigationExpand ? "text-gray-700" : "text-gray-400"
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
              "w-4 cursor-pointer hover:animate-bounce hover:text-gray-500",
              viewOptions.seeList ? "text-gray-700" : "text-gray-400"
            )}
          />
          <FontAwesomeIcon
            icon={faGear}
            fontSize="medium"
            className="cursor-pointer hover:animate-spin"
            onClick={() => {
              const newViewOptions = {
                ...viewOptions,
                seeActiveOption: !viewOptions.seeActiveOption,
              };
              viewOptionsVar(newViewOptions);
            }}
          />
          {/* <TableClinicSelector /> */}
        </div>
      </div>
      <AnimatePresence>
        {viewOptions.navigationExpand ? (
          <TableNavExpand varients={tableNavVarients} />
        ) : (
          <TableNav weeks={weeks} varients={tableNavVarients} />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
