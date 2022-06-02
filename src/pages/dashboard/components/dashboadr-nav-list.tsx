import { ModifiedClinic, SelectedMenuType } from "..";

interface DashboardNavListProps {
  selectedMenu: SelectedMenuType;
  selectedClinic: ModifiedClinic;
  type: string;
  onClick: () => void;
}
export const DashboardNavList = ({
  selectedMenu,
  selectedClinic,
  onClick,
  type,
}: DashboardNavListProps) => {
  let textContents = "";
  let isClinicMenu = false;
  switch (type) {
    case "main":
      textContents = "처음";
      break;
    case "member":
      textContents = "구성원";
      isClinicMenu = true;
      break;
    case "invite":
      textContents = "초대";
      isClinicMenu = true;
      break;
    case "inactivate":
      textContents = "비활성";
      isClinicMenu = true;
      break;
    case "prescription":
      textContents = "처방관리";
      break;
    case "statistics":
      textContents = "통계";
      break;
    case "create":
      textContents = "그룹 만들기";
      break;
    case "inactivated":
      textContents = "비활성 보기";
      break;
  }

  return (
    <li
      className={`btn-menu cursor-pointer rounded-none ${
        selectedMenu === type ? "bg-green-100 font-semibold" : ""
      } ${
        (isClinicMenu && selectedClinic.isManager === false) ||
        (isClinicMenu && selectedClinic.id === 0)
          ? "pointer-events-none opacity-50"
          : ""
      }`}
      onClick={() => onClick()}
    >
      {textContents}
    </li>
  );
};
