import { DashboardSectionLayout } from "../components/section-layout";
import {
  GetStatisticsQuery,
  useGetStatisticsQuery,
} from "../../../graphql/generated/graphql";
import { useEffect, useState } from "react";
import { DatepickerForm } from "../../../components/molecules/datepicker";
import { InDashboardPageProps } from "..";
import { selectedClinicVar, selectedDateVar } from "../../../store";
import { useReactiveVar } from "@apollo/client";
import { BtnMenu } from "../../../components/molecules/button-menu";
import { Worning } from "../../../components/atoms/warning";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { getMonthStartEnd } from "../../../libs/timetable-utils";
import { Loading } from "../../../components/atoms/loading";
import Charts from "../molecules/charts";
import { Button } from "../../../components/molecules/button";

type IDailyReports = GetStatisticsQuery["getStatistics"]["dailyReports"];
export type IDailyReport = NonNullable<FlatArray<IDailyReports, 0>>;
export type IUserInDaily = IDailyReport["users"][0];

type IDailyPrescriptions = GetStatisticsQuery["getStatistics"]["prescriptions"];
export type IDailyPrescription = NonNullable<FlatArray<IDailyPrescriptions, 0>>;
interface IDailyPrescriptionWithCount extends IDailyPrescription {
  count: number;
}
export type IPrescriptionOfUser = IDailyReport["users"][0]["prescriptions"][0];

export type CountLists = {
  reservationCount: number;
  newPatient: number;
  noshow: number;
  cancel: number;
  visitMoreThanThirty: number;
};
export interface IUserStatistics {
  name: string;
  counts: CountLists;
  prescriptions: IDailyPrescriptionWithCount[];
}

interface IPrescriptionCounts {
  reservedCount: number;
  noshowCount: number;
  cancelCount: number;
  firstReservationCount: number;
}
interface IPrescriptionNamePrice {
  name: string;
  price: number;
}
interface IPrescription extends IPrescriptionNamePrice, IPrescriptionCounts {
  name: string;
  price: number;
}

export interface MemberState {
  userId: number;
  name: string;
  isSelected: boolean;
}
interface ModifiedDatepickerForm extends DatepickerForm {
  userIds?: number[];
}
const initialDate = getMonthStartEnd(new Date());

export const Statistics = ({ loggedInUser }: InDashboardPageProps) => {
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const [startDate, setStartDate] = useState(initialDate[0]);
  const [endDate, setEndDate] = useState(initialDate[1]);

  const [memberState, setMemberState] = useState<MemberState[]>();
  const [userIds, setUserIds] = useState<number[]>([]);
  const [userStatistics, setUserStatistics] = useState<
    IUserStatistics[] | null
  >(null);

  const {
    data,
    loading: loadingStatisticsData,
    refetch,
  } = useGetStatisticsQuery({
    variables: {
      input: {
        startDate,
        endDate,
        clinicId: selectedClinic?.id ?? 0,
        userIds,
      },
    },
  });

  function onClickSetDate(
    date: Date,
    month: number,
    changeYear?: "prev" | "next"
  ) {
    const start = new Date(date);
    start.setMonth(month);

    switch (changeYear) {
      case "prev":
        start.setFullYear(start.getFullYear() - 1);
        break;
      case "next":
        start.setFullYear(start.getFullYear() + 1);
        break;
    }

    const [startDate, endDate] = getMonthStartEnd(start);
    setStartDate(startDate);
    setEndDate(endDate);

    refetch({
      input: {
        startDate,
        endDate,
        clinicId: selectedClinic?.id ?? 0,
        userIds,
      },
    });
    return startDate;
  }

  function onSubmit() {
    if (memberState) {
      setUserIds(
        memberState
          .filter((member) => member.isSelected)
          .map((member) => member.userId)
      );
    }
  }

  useEffect(() => {
    setMemberState(
      selectedClinic?.members
        ?.map((m) => ({
          userId: m.user.id,
          name: m.user.name,
          isSelected: true,
        }))
        .sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        })
    );
  }, [selectedClinic]);

  useEffect(() => {
    if (loadingStatisticsData) return;
    if (data?.getStatistics.dailyReports && data?.getStatistics.prescriptions) {
      const { dailyReports, prescriptions, visitRates } = data.getStatistics;

      console.log("dailyReports", dailyReports);
      console.log("prescriptions", prescriptions);
      console.log("visitRates", visitRates);
      console.log("memberState", memberState);

      function combineUserStatistics() {
        const flattening = (reports: IDailyReport[]) =>
          reports.map((day) => day.users).flat(1);
        const combineSameUser = (
          flatReports: ReturnType<typeof flattening>
        ) => {
          const obj: {
            [key: string]: {
              reservationCount: number;
              newPatient: number;
              noshow: number;
              cancel: number;
              visitMoreThanThirty: number;
              prescriptions: IDailyPrescriptionWithCount[];
            };
          } = {};

          flatReports.forEach((user) => {
            const userKey = user.userId;

            function makePrescriptionList(): IDailyPrescriptionWithCount[] {
              return prescriptions.map((prescription) => ({
                id: prescription.id,
                name: prescription.name,
                count: 0,
                price: 0,
                requiredTime: 0,
              }));
            }
            function combinePrescriptions(
              prevPrescriptions: IDailyPrescriptionWithCount[],
              nextPrescriptions: IPrescriptionOfUser[]
            ) {
              nextPrescriptions.forEach((prescription) => {
                const idx = prevPrescriptions.findIndex(
                  (prevPrescription) => prevPrescription.id === prescription.id
                );
                if (idx !== -1) {
                  prevPrescriptions[idx].count =
                    prevPrescriptions[idx].count + prescription.count;
                  prevPrescriptions[idx].price = 0;
                  prevPrescriptions[idx].requiredTime = 0;
                }
              });
              return prevPrescriptions;
            }

            const prevPrescriptions = obj[userKey]
              ? obj[userKey].prescriptions
              : makePrescriptionList();
            const nextPrescription = user.prescriptions;
            const injectedCount = combinePrescriptions(
              prevPrescriptions,
              nextPrescription
            );
            const injectedOther = injectedCount.map((prescription) => {
              const selectedPrescription = prescriptions.find(
                (prescriptionInList) =>
                  prescriptionInList.id === prescription.id
              );
              if (!selectedPrescription)
                throw new Error("처방을 찾을 수 없습니다");
              return {
                ...prescription,
                price: prescription.count * selectedPrescription.price,
                requiredTime:
                  prescription.count * selectedPrescription.requiredTime,
              };
            });

            if (obj[userKey]) {
              obj[userKey] = {
                reservationCount:
                  obj[userKey].reservationCount + user.reservationCount,
                newPatient: obj[userKey].newPatient + user.newPatient,
                noshow: obj[userKey].noshow + user.noshow,
                cancel: obj[userKey].cancel + user.cancel,
                visitMoreThanThirty:
                  obj[userKey].visitMoreThanThirty + user.visitMoreThanThirty,
                prescriptions: injectedOther,
              };
            } else {
              obj[userKey] = {
                reservationCount: user.reservationCount,
                newPatient: user.newPatient,
                noshow: user.noshow,
                cancel: user.cancel,
                visitMoreThanThirty: user.visitMoreThanThirty,
                prescriptions: injectedOther,
              };
            }
          });
          return obj;
        };
        const convertObjToArr = (
          objReport: ReturnType<typeof combineSameUser>
        ) => {
          const toArrReport = Object.entries(objReport);
          const injectUserName = toArrReport.map(([userId, reports]) => {
            function injectUserName() {
              const member = memberState?.find(
                (member) => member.userId === +userId
              );
              return member ? member.name : userId;
            }
            const {
              reservationCount,
              newPatient,
              noshow,
              cancel,
              visitMoreThanThirty,
              prescriptions,
            } = reports;

            const counts = {
              reservationCount,
              newPatient,
              noshow,
              cancel,
              visitMoreThanThirty,
            };

            return {
              name: injectUserName(),
              counts,
              prescriptions,
            };
          });
          return injectUserName;
        };

        const flatReports = flattening(dailyReports);
        const objReport = combineSameUser(flatReports);
        const arrReport = convertObjToArr(objReport);
        return arrReport.sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
      }

      const newUserStatistics = combineUserStatistics();

      setUserStatistics(newUserStatistics);
    }
  }, [data]);

  return (
    <>
      <DashboardSectionLayout
        elementName="date-picker"
        children={
          <div className="flex flex-col items-center justify-center gap-x-4 gap-y-1">
            <div className="flex w-full justify-between gap-4">
              <div className="flex items-center">
                <BtnMenu
                  onClick={() => {
                    const newStartDate = onClickSetDate(
                      startDate,
                      selectedDate.getMonth(),
                      "prev"
                    );
                    selectedDateVar(new Date(newStartDate));
                  }}
                  icon={<FontAwesomeIcon icon={faChevronLeft} fontSize={14} />}
                  enabled
                  hasBorder
                />
                <BtnMenu label={selectedDate.getFullYear() + "년 "} enabled />
                <BtnMenu
                  onClick={() => {
                    const newStartDate = onClickSetDate(
                      startDate,
                      selectedDate.getMonth(),
                      "next"
                    );
                    selectedDateVar(new Date(newStartDate));
                  }}
                  enabled
                  icon={<FontAwesomeIcon icon={faChevronRight} fontSize={14} />}
                  hasBorder
                />
              </div>
              <div className="flex items-center gap-x-1.5">
                {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, idx) => (
                  <BtnMenu
                    key={idx}
                    hasBorder
                    onClick={() => onClickSetDate(startDate, idx)}
                    label={idx + 1 + "월"}
                    enabled={startDate.getMonth() === idx}
                    hasActiveRing
                    thinFont
                    hasFocus
                  />
                ))}
              </div>
            </div>
            {memberState && (
              <div className="flex w-full justify-end gap-x-4">
                {memberState.map((m, i) => (
                  <BtnMenu
                    key={m.userId}
                    label={m.name}
                    hasBorder
                    hasActiveRing
                    thinFont
                    enabled={m.isSelected}
                    onClick={() => {
                      if (loadingStatisticsData) return;
                      memberState[i].isSelected = !memberState[i].isSelected;
                      setMemberState([...memberState]);
                    }}
                  />
                ))}
                <Button
                  canClick={!loadingStatisticsData}
                  loading={loadingStatisticsData}
                  textContents="조회하기"
                  type="button"
                  isSmall
                  onClick={onSubmit}
                ></Button>
              </div>
            )}
          </div>
        }
      />
      {loadingStatisticsData && <Loading />}
      {!loadingStatisticsData &&
      userStatistics &&
      data &&
      data.getStatistics.prescriptions &&
      data.getStatistics.dailyReports ? (
        <>
          {data.getStatistics.prescriptions.length < 1 ? (
            <Worning type="hasNotPrescription" />
          ) : data.getStatistics.dailyReports.length < 1 ? (
            <Worning type="hasNotStatistics" />
          ) : (
            userStatistics.length > 0 && (
              <Charts
                userStatistics={userStatistics}
                prescriptions={data.getStatistics.prescriptions}
                dailyReports={data.getStatistics.dailyReports}
                startDate={startDate}
                endDate={endDate}
              />
            )
          )}
        </>
      ) : userIds.length === 0 ? (
        <Worning type="emptyUserIds" />
      ) : null}
    </>
  );
};
