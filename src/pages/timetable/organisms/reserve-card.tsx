import { useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchPatient } from "../../../components/organisms/search-patient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { TimetableModalProps } from "..";
import {
  CreateReservationMutation,
  useCreateReservationMutation,
  useFindPrescriptionsQuery,
} from "../../../graphql/generated/graphql";
import {
  clinicListsVar,
  loggedInUserVar,
  PrescriptionWithSelect,
  selectedClinicVar,
  selectedPatientVar,
} from "../../../store";
import { getDateFromYMDHM } from "../../../libs/utils";
import { TIMETABLE } from "../../../variables";
import { ModalContentsLayout } from "../../../components/templates/modal-contents-layout";
import { DatepickerWithInput } from "../../../components/molecules/datepicker-with-input";
import { Button } from "../../../components/molecules/button";
import { FormError } from "../../../components/form-error";
import { DatepickerForm } from "../../../components/molecules/datepicker";

function getOneDayReservationInputDateForTest(
  inputStartDate: Date,
  inputPresc: { id: number; requiredTime: number; name: string }
) {
  const numberOfReservationsPerDay = Math.floor(Math.random() * 8);
  const startDate = new Date(inputStartDate);
  const dates: Date[] = [];
  dates.length = numberOfReservationsPerDay;
  dates.fill(startDate);

  return dates.map((d) => {
    const sd = new Date(d);
    const ed = new Date(d);
    let th = Math.floor(Math.random() * (19 - 9) + 9);
    let tm = Math.floor(Math.random() * 6) * 10;
    while (dates.find((dateInWhile) => dateInWhile.getHours() === th)) {
      th = Math.floor(Math.random() * (19 - 9) + 9);
    }
    tm === 6 ? (tm = 0) : "";
    sd.setHours(th, tm, 0, 0);
    ed.setHours(th, tm + inputPresc.requiredTime, 0, 0);
    return [sd, ed];
  });
}
function selectPrescriptionForTest(inputPresc: PrescriptionWithSelect[]) {
  const selected = inputPresc[Math.floor(Math.random() * inputPresc.length)];
  return {
    id: selected.id,
    name: selected.name,
    requiredTime: selected.requiredTime,
  };
}

interface SelectedPrescription {
  price: number;
  minute: number;
  prescriptions: number[];
}

interface ReserveForm extends DatepickerForm {
  memo?: string;
  userId?: number;
}

export const ReserveCard = ({ closeAction, refetch }: TimetableModalProps) => {
  const location = useLocation();
  const state = location.state as {
    startDate: Date;
    member: { id: number; name: string };
  };
  let startDate = state?.startDate;
  let member = state?.member;
  if (!startDate || !member) return <p>state가 없습니다</p>;

  const navigate = useNavigate();
  const selectedPatient = useReactiveVar(selectedPatientVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const [selectedPrescription, setSelectedPrescription] =
    useState<SelectedPrescription>({
      price: 0,
      minute: 0,
      prescriptions: [],
    });
  const [prescriptions, setPrescriptions] = useState<PrescriptionWithSelect[]>(
    []
  );

  const { data: prescriptionsData } = useFindPrescriptionsQuery({
    variables: {
      input: {
        clinicId: selectedClinic?.id ?? 0,
        onlyLookUpActive: false,
      },
    },
  });

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = useForm<ReserveForm>({ mode: "onChange" });

  const onCompleted = (data: CreateReservationMutation) => {
    const {
      createReservation: { ok, error },
    } = data;
    if (error) {
      alert(`오류가 발생했습니다; ${error}`);
    }
    refetch();
    if (ok) closeAction();
  };

  const [
    createReservationMutation,
    { loading, data: createReservationResult },
  ] = useCreateReservationMutation({ onCompleted });

  function createDummyReserve(userId: number | undefined) {
    const firstDate = new Date("2022-6-1");
    let countSum = 0;
    for (let i = 0; i < 30; i++) {
      console.log(`${i + 1}일`);
      firstDate.setDate(i + 1);
      const presc = selectPrescriptionForTest(prescriptions);
      const times = getOneDayReservationInputDateForTest(firstDate, presc);
      countSum = countSum + times.length;
      console.log(times, times.length);
      times.forEach((t) => {
        createReservationMutation({
          variables: {
            input: {
              startDate: t[0],
              endDate: t[1],
              patientId: selectedPatient!.id,
              userId: +userId!,
              clinicId: selectedClinic!.id,
              prescriptionIds: [presc.id],
            },
          },
        });
      });
    }
    console.log("총 생성된 예약 : ", countSum);
  }

  const onSubmit = () => {
    console.log("onSubmit 시작");
    if (!loading && selectedPatient?.id) {
      console.log("onSubmit if 통과");
      const {
        startDateYear,
        startDateMonth,
        startDateDate,
        startDateHours,
        startDateMinutes,
        memo,
        userId,
      } = getValues();
      if (
        startDateYear !== undefined &&
        startDateMonth !== undefined &&
        startDateDate !== undefined &&
        startDateHours !== undefined &&
        startDateMinutes !== undefined
      ) {
        const startDate = getDateFromYMDHM(
          startDateYear,
          startDateMonth,
          startDateDate,
          startDateHours,
          startDateMinutes
        );
        const endDate = new Date(startDate);
        // startDate와 같은 값인 endDate에 치료시간을 분으로 더함
        endDate.setMinutes(endDate.getMinutes() + selectedPrescription.minute);
        // createDummyReserve(userId);
        createReservationMutation({
          variables: {
            input: {
              startDate: startDate,
              endDate,
              memo,
              patientId: selectedPatient.id,
              userId: +userId!,
              clinicId: selectedClinic!.id,
              prescriptionIds: selectedPrescription.prescriptions,
            },
          },
        });
      }
      return console.error("timetable > organisms > reserve-card.tsx; 196 row");
    }
  };

  function getTotal(
    getThis: "price" | "requiredTime",
    prescriptions: PrescriptionWithSelect[]
  ) {
    return prescriptions
      .filter((pre) => pre.isSelect)
      .reduce((prev, curr) => prev + curr[getThis], 0);
  }

  const onClickPrescription = (id: number) => {
    const newPrescriptions = prescriptions.map((prev) => {
      if (prev.id === id) {
        return { ...prev, isSelect: !prev.isSelect };
      }
      return prev;
    });
    const newState = {
      minute: getTotal("requiredTime", newPrescriptions),
      price: getTotal("price", newPrescriptions),
      prescriptions: newPrescriptions
        .filter((prescription) => prescription.isSelect)
        .map((prescription) => prescription.id),
    };

    setPrescriptions(newPrescriptions);
    setSelectedPrescription(newState);
  };

  useEffect(() => {
    if (!startDate || !member) navigate(TIMETABLE);
    return () => {
      selectedPatientVar(null);
    };
  }, []);

  useEffect(() => {
    if (prescriptionsData) {
      const prescriptions =
        prescriptionsData.findPrescriptions.prescriptions?.map((presc) => ({
          ...presc,
          isSelect: false,
        })) ?? [];
      setPrescriptions(prescriptions);
    }
  }, [prescriptionsData]);

  useEffect(() => {
    setValue("userId", member.id);
  }, [member]);

  return (
    <ModalContentsLayout
      title="예약하기"
      closeAction={closeAction}
      children={
        <>
          <SearchPatient />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5 mb-5 grid w-full gap-4"
          >
            <label className="flex flex-col gap-2">
              담당 치료사
              <select
                {...register("userId")}
                className="w-full rounded-md border text-center"
              >
                {selectedClinic?.id === 0 ? (
                  <option value={loggedInUser?.id}>{loggedInUser?.name}</option>
                ) : (
                  clinicLists
                    ?.find((g) => g.id === selectedClinic?.id)
                    ?.members.map((m) => (
                      <option key={m.id} value={m.user.id}>
                        {m.user.name}
                      </option>
                    ))
                )}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              예약 시간
              <DatepickerWithInput
                setValue={setValue}
                defaultDate={startDate}
                register={register}
                see="ymd-hm"
                dateType="startDate"
                formError={errors}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-1">
                처방
                <Link
                  to={"/dashboard"}
                  state={{
                    selectedClinicId: selectedClinic?.id,
                    selectedClinicName: selectedClinic?.name,
                    selectedClinicType: selectedClinic?.type,
                    selectedClinicMembers: selectedClinic?.members,
                    selectedMenu: "prescription",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faLink}
                    fontSize={14}
                    className="btn-menu"
                  />
                </Link>
              </span>
              {prescriptions.length === 0 ? (
                <div className="flex flex-col items-center px-2 ">
                  <span>등록된 처방이 없습니다.</span>
                  <span>
                    처방을
                    <Link
                      to={"/dashboard"}
                      state={{
                        selectedClinicId: selectedClinic?.id,
                        selectedClinicName: selectedClinic?.name,
                        selectedClinicType: selectedClinic?.type,
                        selectedClinicMembers: selectedClinic?.members,
                        selectedMenu: "prescription",
                      }}
                    >
                      <button
                        type="button"
                        className="btn-sm btn-border mx-2 w-fit shadow-cst"
                      >
                        <FontAwesomeIcon icon={faLink} />
                        등록
                      </button>
                      하세요
                    </Link>
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <ul className="grid grid-cols-4 gap-x-3 gap-y-1">
                    {prescriptions.map((prescription, index) => (
                      <li
                        key={index}
                        value={prescription.id}
                        onClick={() => onClickPrescription(prescription.id)}
                        className={`btn-menu overflow-hidden rounded-md border text-center ${
                          prescription.isSelect
                            ? "border-green-500 font-semibold"
                            : "opacity-50"
                        }`}
                      >
                        {prescription.name}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-around">
                    <span>총가격 : {selectedPrescription.price}원</span>
                    <span>치료시간 : {selectedPrescription.minute}분</span>
                  </div>
                </div>
              )}
            </label>
            <Button
              type="submit"
              canClick={
                selectedPatient &&
                isValid &&
                selectedPrescription.prescriptions.length >= 1
              }
              loading={loading}
              textContents={"예약등록"}
            />
            {createReservationResult?.createReservation.error && (
              <FormError
                errorMessage={createReservationResult.createReservation.error}
              />
            )}
          </form>
        </>
      }
    />
  );
};
