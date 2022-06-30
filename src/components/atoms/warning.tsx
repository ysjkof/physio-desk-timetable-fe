interface WarningProps {
  type:
    | "hasNotPermission"
    | "hasNotStatistics"
    | "hasNotPrescription"
    | "emptyUserIds"
    | "emptyData";
}

export const Worning = ({ type }: WarningProps) => {
  let message = "";
  switch (type) {
    case "hasNotPermission":
      message = "권한이 없습니다";
      break;
    case "hasNotStatistics":
      message = "통계 내역이 없습니다";
      break;
    case "hasNotPrescription":
      message = "처방 내역이 없습니다";
      break;
    case "emptyUserIds":
      message = "사용자를 선택해주세요";
      break;
    case "emptyData":
      message = "데이터가 없습니다";
      break;
  }
  return <h3 className="mt-10 text-center">{message}</h3>;
};
