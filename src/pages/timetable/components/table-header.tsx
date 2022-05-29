import { useReactiveVar } from "@apollo/client";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import {
  faBan,
  faCommentSlash,
  faGear,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { BtnMenu } from "../../../components/button-menu";
import { BtnMenuToggle } from "../../../components/button-menu-toggle";
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
}

export function TableHeader({ today }: TableNavProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);
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
      id="table-header"
      className="table-header w-full"
    >
      <div className="flex justify-between">
        <button
          className="min-w-[120px] text-sm font-medium text-gray-700 hover:font-bold"
          onClick={() => selectedDateVar(today)}
        >
          {today.toLocaleString("ko-KR", {
            year: "2-digit",
            month: "short",
            day: "numeric",
            weekday: "short",
          })}
        </button>

        <div className="flex w-full items-center justify-end space-x-5">
          <BtnMenu
            icon={<FontAwesomeIcon icon={faBan} />}
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
          <BtnMenu
            icon={<FontAwesomeIcon icon={faCommentSlash} />}
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
          <BtnMenuToggle
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
            enabled={viewOptions.periodToView === ONE_WEEK}
            label={["1주일", "하루"]}
          />
          {/* ---------------------- 구분선 ---------------------- */}
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
              "pl-10",
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
        </div>
      </div>
      <AnimatePresence>
        {viewOptions.navigationExpand ? (
          <TableNavExpand varients={tableNavVarients} />
        ) : (
          <TableNav varients={tableNavVarients} />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
