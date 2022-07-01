import { useReactiveVar } from "@apollo/client";
import { IListReservation, selectedClinicVar } from "../../../store";
import { DatepickerWithInput } from "../../../components/molecules/datepicker-with-input";
import { Button } from "../../../components/molecules/button";
import { SelectUser } from "./select-user";
import { Input } from "../../../components/molecules/input";
import { IReserveForm } from "./reserve-form";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { IFormErrors } from "../../../components/molecules/datepicker";

interface DayOffFormProps {
  register: UseFormRegister<IReserveForm>;
  setValue: UseFormSetValue<IReserveForm>;
  errors: IFormErrors;
  isValid: boolean;
  loading: boolean;
  reservation?: IListReservation;
}

export const DayOffForm = ({
  register,
  setValue,
  errors,
  isValid,
  loading,
  reservation,
}: DayOffFormProps) => {
  const selectedClinic = useReactiveVar(selectedClinicVar);

  return (
    <>
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
          defaultDate={
            reservation ? new Date(reservation.startDate) : new Date()
          }
          register={register}
          see="ymd-hm"
          dateType="startDate"
          formError={errors}
        />
      </label>
      <label className="flex flex-col gap-2">
        종료 시각
        <DatepickerWithInput
          setValue={setValue}
          defaultDate={
            reservation ? new Date(reservation.startDate) : new Date()
          }
          register={register}
          see="ymd-hm"
          dateType="endDate"
          formError={errors}
        />
      </label>

      <Input
        name="memo"
        label={"메모"}
        placeholder={"간단한 남길 말"}
        register={register("memo", {
          maxLength: { value: 200, message: "최대 200자입니다" },
        })}
        type={"textarea"}
        rows={2}
      />
      <Button
        type="submit"
        canClick={isValid}
        loading={loading}
        textContents="잠금 수정"
      />
    </>
  );
};
