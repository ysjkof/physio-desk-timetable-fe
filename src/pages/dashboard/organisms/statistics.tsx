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
import combineUserStatistics from "../../../libs/useStatistics";

type IDailyReports = GetStatisticsQuery["getStatistics"]["dailyReports"];
export type IDailyReport = NonNullable<FlatArray<IDailyReports, 0>>;
export type IUserInDaily = IDailyReport["users"][0];

type IDailyPrescriptions = GetStatisticsQuery["getStatistics"]["prescriptions"];
export type IDailyPrescription = NonNullable<FlatArray<IDailyPrescriptions, 0>>;
export interface IDailyPrescriptionWithCount extends IDailyPrescription {
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
const [initialStartDate, initailEndDate] = getMonthStartEnd(new Date());

export const Statistics = ({ loggedInUser }: InDashboardPageProps) => {
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initailEndDate);
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

      const newUserStatistics = combineUserStatistics({
        dailyReports,
        memberState,
        prescriptions,
      });

      setUserStatistics(newUserStatistics);
    }
  }, [data]);

  return (
    <>
      <DashboardSectionLayout
        elementName="date-picker"
        hasShadow
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
              <div className="flex w-full justify-end gap-x-4 py-1.5">
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
