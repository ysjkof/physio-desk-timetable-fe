import { useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { TimetableModalProps } from "..";
import {
  CreateReservationMutation,
  EditReservationMutation,
  ListReservationsDocument,
  ReservationState,
  useCreateReservationMutation,
  useEditReservationMutation,
  useFindPrescriptionsQuery,
} from "../../../graphql/generated/graphql";
import {
  IListReservation,
  PrescriptionWithSelect,
  selectedClinicVar,
  selectedPatientVar,
} from "../../../store";
import { getDateFromYMDHM } from "../../../libs/utils";
import { DatepickerWithInput } from "../../../components/molecules/datepicker-with-input";
import { Button } from "../../../components/molecules/button";
import { FormError } from "../../../components/form-error";
import { DatepickerForm } from "../../../components/molecules/datepicker";
import { SelectUser } from "./select-user";
import { Input } from "../../../components/molecules/input";
import { DayOffForm } from "./day-off-form";

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

export interface ISelectedPrescription {
  price: number;
  minute: number;
  prescriptions: number[];
}

export interface IReserveForm extends DatepickerForm {
  memo?: string;
  userId?: number;
  description?: string;
}

interface IReservaFromProps extends TimetableModalProps {
  startDate?: Date;
  member?: { id: number; name: string };
  selectedPrescriptionData?: PrescriptionWithSelect[];
  reservation?: IListReservation;
  isDayoff?: boolean;
}

export const ReserveForm = ({
  closeAction,
  startDate,
  member,
  selectedPrescriptionData,
  reservation,
  isDayoff,
}: IReservaFromProps) => {
  const navigate = useNavigate();
  const selectedPatient = useReactiveVar(selectedPatientVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const [selectedPrescription, setSelectedPrescription] =
    useState<ISelectedPrescription>({
      price: 0,
      minute: 0,
      prescriptions: [],
    });
  const [prescriptions, setPrescriptions] = useState<PrescriptionWithSelect[]>(
    []
  );
  const isDayOff = isDayoff ?? reservation?.state === ReservationState.DayOff;

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
  } = useForm<IReserveForm>({
    mode: "onChange",
  });

  const createOnCompleted = (data: CreateReservationMutation) => {
    const {
      createReservation: { ok, error },
    } = data;
    if (error) {
      alert(`오류가 발생했습니다; ${error}`);
    }
    if (ok) closeAction();
  };
  const editOnComplete = (data: EditReservationMutation) => {
    const {
      editReservation: { ok, error },
    } = data;
    if (error) {
      alert(`오류가 발생했습니다; ${error}`);
    }
    // 할일: 캐시작업
    if (ok) closeAction();
  };

  const [
    createReservationMutation,
    { loading, data: createReservationResult },
  ] = useCreateReservationMutation({ onCompleted: createOnCompleted });

  const [
    callEditReservation,
    { loading: editLoading, data: editReservationResult },
  ] = useEditReservationMutation({ onCompleted: editOnComplete });

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
    if (!loading) {
      console.log("onSubmit if 통과");
      const {
        startDateYear,
        startDateMonth,
        startDateDate,
        startDateHours,
        startDateMinutes,
        endDateYear,
        endDateMonth,
        endDateDate,
        endDateHours,
        endDateMinutes,
        memo,
        userId,
      } = getValues();

      const startDate = getDateFromYMDHM(
        startDateYear!,
        startDateMonth!,
        startDateDate!,
        startDateHours!,
        startDateMinutes!
      );
      if (!startDate) throw new Error("startDate가 없습니다");

      if (isDayOff) {
        const endDate = getDateFromYMDHM(
          endDateYear!,
          endDateMonth!,
          endDateDate!,
          endDateHours!,
          endDateMinutes!
        );
        if (reservation) {
          callEditReservation({
            variables: {
              input: {
                startDate,
                endDate,
                memo,
                userId: +userId!,
                reservationId: reservation.id,
              },
            },
            refetchQueries: [
              { query: ListReservationsDocument },
              "listReservations",
            ],
          });
        } else {
          createReservationMutation({
            variables: {
              input: {
                startDate,
                endDate,
                memo,
                isDayoff: true,
                userId: +userId!,
                clinicId: selectedClinic!.id,
              },
            },
            refetchQueries: [
              { query: ListReservationsDocument },
              "listReservations",
            ],
          });
        }
        return;
      }
      const endDate = new Date(startDate);
      // startDate와 같은 값인 endDate에 치료시간을 분으로 더함
      endDate.setMinutes(endDate.getMinutes() + selectedPrescription.minute);
      if (reservation) {
        // reservation이 있으면 edit모드
        callEditReservation({
          variables: {
            input: {
              startDate,
              endDate,
              memo,
              userId: +userId!,
              reservationId: reservation.id,
              prescriptionIds: selectedPrescription.prescriptions,
            },
          },
          refetchQueries: [
            { query: ListReservationsDocument },
            "listReservations",
          ],
        });
      } else {
        // createDummyReserve(userId);
        createReservationMutation({
          variables: {
            input: {
              startDate,
              endDate,
              memo,
              userId: +userId!,
              clinicId: selectedClinic!.id,
              patientId: selectedPatient!.id,
              prescriptionIds: selectedPrescription.prescriptions,
            },
          },
          refetchQueries: [
            { query: ListReservationsDocument },
            "listReservations",
          ],
        });
      }
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

  const onClickPrescription = (
    id: number | null,
    prescriptions: PrescriptionWithSelect[],
    selectedPrescriptionData?: PrescriptionWithSelect[]
  ) => {
    let newPrescriptions: PrescriptionWithSelect[] = [];

    if (selectedPrescriptionData) {
      newPrescriptions = prescriptions.map((prev) => {
        const exists = selectedPrescriptionData.find(
          (prescription) => prescription.id === prev.id
        );
        if (exists) {
          return { ...exists, isSelect: !prev.isSelect };
        }
        return { ...prev, isSelect: false };
      });
    } else {
      newPrescriptions = prescriptions.map((prev) => {
        if (prev.id === id) {
          return { ...prev, isSelect: !prev.isSelect };
        }
        return prev;
      });
    }

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
    return () => {
      selectedPatientVar(null);
    };
  }, []);

  useEffect(() => {
    if (prescriptionsData) {
      let prescriptions =
        prescriptionsData.findPrescriptions.prescriptions?.map((presc) => ({
          ...presc,
          isSelect: false,
        })) ?? [];
      if (selectedPrescriptionData) {
        onClickPrescription(null, prescriptions, selectedPrescriptionData);
      } else {
        setPrescriptions(prescriptions);
      }
    }
  }, [prescriptionsData]);

  useEffect(() => {
    if (reservation) {
      setValue("memo", reservation.memo!);
      setValue("userId", reservation.user.id);
      // @ts-ignore 여기서는 patientId만 있으면 된다
      selectedPatientVar(reservation.patient);
    } else if (member) {
      setValue("userId", member.id);
    }
  }, [member, reservation]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-4">
      {isDayOff && (
        <DayOffForm
          register={register}
          setValue={setValue}
          errors={errors}
          isValid={isValid}
          loading={loading}
          reservation={reservation}
        />
      )}
      {!isDayOff && (
        <>
          {/* <label className="grid grid-cols-[5rem,1fr] items-center"> */}
          <label className="flex flex-col gap-2">
            담당 치료사
            <SelectUser
              members={selectedClinic?.members ?? []}
              register={register("userId")}
            />
          </label>
          <label className="flex flex-col gap-2">
            시작 시각
            <DatepickerWithInput
              setValue={setValue}
              defaultDate={new Date(startDate ?? reservation?.startDate)}
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
                      onClick={() =>
                        onClickPrescription(prescription.id, prescriptions)
                      }
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
          <Input
            name="memo"
            label={"메모"}
            placeholder={"처방에 대한 설명"}
            register={register("memo", {
              maxLength: { value: 200, message: "최대 200자입니다" },
            })}
            type={"textarea"}
            rows={2}
          />
          <Button
            type="submit"
            canClick={
              selectedPatient &&
              isValid &&
              selectedPrescription.prescriptions.length >= 1
            }
            loading={loading}
            textContents={reservation ? "예약수정" : "예약하기"}
          />
          {createReservationResult?.createReservation.error && (
            <FormError
              errorMessage={createReservationResult.createReservation.error}
            />
          )}
        </>
      )}{" "}
    </form>
  );
};
