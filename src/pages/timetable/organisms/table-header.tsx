import { useReactiveVar } from "@apollo/client";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import {
  faBan,
  faCommentSlash,
  faGear,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BtnMenu } from "../../../components/molecules/button-menu";
import { BtnMenuToggle } from "../../../components/molecules/button-menu-toggle";
import { saveViewOptions } from "../../../libs/utils";
import {
  IViewOption,
  loggedInUserVar,
  selectedDateVar,
  viewOptionsVar,
} from "../../../store";
import { ONE_DAY, ONE_WEEK } from "../../../variables";

interface TableNavProps {
  today: Date;
}

export function TableHeader({ today }: TableNavProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);

  if (!loggedInUser || !viewOptions) return <></>;
  return (
    <div id="table-header" className="table-header">
      <button
        className="min-w-[120px] font-medium hover:font-bold"
        onClick={() => selectedDateVar(today)}
      >
        {today.toLocaleString("ko-KR", {
          year: "2-digit",
          month: "short",
          day: "numeric",
          weekday: "short",
        })}
      </button>

      <div className="flex w-full items-center justify-end space-x-2">
        <BtnMenu
          icon={<FontAwesomeIcon icon={faBan} fontSize={14} />}
          enabled={viewOptions.seeCancel}
          label={"취소"}
          onClick={() => {
            const newViewOptions = {
              ...viewOptions,
              seeCancel: !viewOptions.seeCancel,
            };
            saveViewOptions(newViewOptions, loggedInUser.id);
          }}
        />
        <BtnMenu
          icon={<FontAwesomeIcon icon={faCommentSlash} fontSize={14} />}
          enabled={viewOptions.seeNoshow}
          label={"부도"}
          onClick={() => {
            const newViewOptions = {
              ...viewOptions,
              seeNoshow: !viewOptions.seeNoshow,
            };
            saveViewOptions(newViewOptions, loggedInUser.id);
          }}
        />
        <BtnMenuToggle
          onClick={() => {
            const newViewOptions: IViewOption = {
              ...viewOptions,
              periodToView:
                viewOptions.periodToView === ONE_DAY ? ONE_WEEK : ONE_DAY,
            };
            saveViewOptions(newViewOptions, loggedInUser.id);
          }}
          enabled={viewOptions.periodToView === ONE_WEEK}
          label={["1주일", "하루"]}
        />
        {/* ---------------------- 구분선 ---------------------- */}

        <BtnMenu
          icon={<FontAwesomeIcon icon={faCalendarAlt} fontSize={14} />}
          enabled={viewOptions.navigationExpand}
          label={"달력"}
          onClick={() => {
            const newViewOptions = {
              ...viewOptions,
              navigationExpand: !viewOptions.navigationExpand,
            };
            saveViewOptions(newViewOptions, loggedInUser.id);
          }}
        />

        <BtnMenu
          icon={<FontAwesomeIcon icon={faList} fontSize={14} />}
          enabled={viewOptions.seeList}
          label={"목록"}
          onClick={() => {
            const newViewOptions = {
              ...viewOptions,
              seeList: !viewOptions.seeList,
            };
            saveViewOptions(newViewOptions, loggedInUser.id);
          }}
        />
        <BtnMenu
          icon={<FontAwesomeIcon icon={faGear} fontSize={14} />}
          enabled={viewOptions.seeActiveOption}
          label={"설정"}
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
  );
}
