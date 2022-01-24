import { ILabel } from "../pages/user/time-table";

export const makeLabels = (
  tableStartAndEndTime: string[],
  forLabel?: "forLabel"
) => {
  const labels: ILabel[] = [];
  // 아래 for는 tableStartAndEndTime에 따른 ReservationsContainer를 만든다.
  // 수의 증가를 위해 tableStartAndEndTime을 숫자로 바꿈
  for (
    let i = parseInt(tableStartAndEndTime[0]);
    i <= parseInt(tableStartAndEndTime[1]);
    i = i + 10
  ) {
    let hhmm: string = "";
    // i의 자릿수를 맞추기 위해서 확인하고 string으로 바꿔서 hhmm에 할당
    if (String(i).length === 4) {
      hhmm = String(i);
    } else if (String(i).length === 3) {
      hhmm = String(i).padStart(4, "0");
    }
    // 60분이 되면 시간이 1오르고 0분이 되야 하는데 숫자는 10진법이고, 문자열이라서 10분 단위 위치인 3번째 자리를 읽어서 확인, hhmm을 빈 문자열로 만들고 i값을 더함
    const handleOverMinute = (number: number) => {
      hhmm = "";
      i = i + number;
    };
    if (hhmm[2] === "6") handleOverMinute(30);
    if (hhmm[2] === "7") handleOverMinute(20);
    if (hhmm[2] === "8") handleOverMinute(10);
    if (hhmm[2] === "9") handleOverMinute(0);
    // 10분 단위가 6~9인 경우 hhmm의 길이가 0이고 이때 push하지 않는다.
    if (forLabel && hhmm.length !== 0)
      labels.push({
        label: hhmm,
      });
    if (!forLabel && hhmm.length !== 0)
      labels.push({
        label: hhmm,
        reservations: [],
      });

    if (labels.length > 200) {
      break;
    }
  }
  return labels;
};
