interface DashboardTitleProps {
  clinicName: string;
  type: string;
}

export const DashboardTitle = ({ clinicName, type }: DashboardTitleProps) => {
  let menu = "";
  let subText = "";
  switch (type) {
    case "main":
      menu = "처음";
      break;
    case "member":
      menu = "구성원";
      break;
    case "invite":
      menu = "초대";
      break;
    case "inactivate":
      menu = "비활성";
      subText = "비활성한 모임을 조회합니다.";
      break;
    case "prescription":
      menu = "처방관리";
      break;
    case "statistics":
      menu = "통계";
      break;
    case "create":
      menu = "그룹 만들기";
      break;
    case "inactivated":
      menu = "비활성 보기";
      break;
  }

  return (
    <h2 className="mb-3 bg-white pl-4 pt-2 pb-1.5">
      <span>
        {clinicName} &gt; {menu}
      </span>
      {/* <span className="text-xs">{subText}</span> */}
    </h2>
  );
};
