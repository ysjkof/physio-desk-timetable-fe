import { useForm } from "react-hook-form";
import { FormError } from "../form-error";
import { Button } from "./button";
import {
  CreatePatientInput,
  CreatePatientMutation,
  useCreatePatientMutation,
} from "../../graphql/generated/graphql";
import { Input } from "./input";
import { selectedClinicVar, selectedPatientVar } from "../../store";
import { useReactiveVar } from "@apollo/client";
import { TimetableModalProps } from "../../pages/timetable";
import { DatepickerWithInput } from "./datepicker-with-input";

export interface BirthdayInput {
  birthdayYear?: number;
  birthdayMonth?: number;
  birthdayDate?: number;
}

export const CreatePatientForm = ({ closeAction }: TimetableModalProps) => {
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<CreatePatientInput>({
    mode: "onChange",
  });
  const {
    register: birthdayRegister,
    getValues: birthdayGetValues,
    setValue: birthdaySetValue,
    formState: { errors: birthdayError, isValid: birthdayIsValid },
  } = useForm<BirthdayInput>({
    mode: "onChange",
  });

  const onCompleted = (data: CreatePatientMutation) => {
    const {
      createPatient: { ok, patient },
    } = data;
    if (ok) {
      closeAction();
      selectedPatientVar({
        id: patient?.id!,
        name: patient?.name!,
        gender: patient?.gender!,
        birthday: patient?.birthday,
        registrationNumber: patient?.registrationNumber!,
        clinicName: selectedClinic?.name ?? "",
      });
    }
  };
  const [
    createPatientMutation,
    { loading, data: createaPatientMutationResult },
  ] = useCreatePatientMutation({ onCompleted });

  const onSubmit = () => {
    if (!loading) {
      const { name, gender, memo } = getValues();
      const { birthdayYear, birthdayMonth, birthdayDate } = birthdayGetValues();
      const birthday = new Date(
        `${birthdayYear}-${birthdayMonth}-${birthdayDate}`
      );
      createPatientMutation({
        variables: {
          input: {
            name,
            gender,
            memo,
            ...(birthday && { birthday }),
            ...(typeof selectedClinic?.id === "number" &&
              selectedClinic?.id !== 0 && { clinicId: selectedClinic?.id }),
          },
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-5 mb-5 grid w-full gap-6"
    >
      <Input
        autoFocus
        label={"이름*"}
        name={"name"}
        type={"text"}
        placeholder={"이름을 입력하세요"}
        required={true}
        register={register("name", {
          required: "이름을 입력하세요",
          maxLength: { value: 30, message: "최대 30자 입니다" },
        })}
        children={
          errors.name?.message && (
            <FormError errorMessage={errors.name.message} />
          )
        }
      />
      <div className="gender-radio flex justify-around">
        <div className="flex items-center">
          <label htmlFor="gender-male" className="px-3">
            남성
          </label>
          <input
            {...register("gender", { required: "성별을 선택하세요" })}
            type="radio"
            value="male"
            id="gender-male"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="gender-female" className="px-3">
            여성
          </label>
          <input
            {...register("gender", { required: "성별을 선택하세요" })}
            type="radio"
            value="female"
            id="gender-female"
            defaultChecked
          />
        </div>
      </div>
      <label className="flex flex-col gap-2">
        생년월일
        <DatepickerWithInput
          defaultDate={new Date("0-0-0")}
          setValue={birthdaySetValue}
          register={birthdayRegister}
          formError={birthdayError}
          dateType="birthday"
          see="ymd"
        />
      </label>

      <Input
        label={"메모"}
        name={"memo"}
        type={"textarea"}
        rows={8}
        placeholder={"메모를 입력하세요"}
        required={false}
        register={register("memo", {
          maxLength: {
            value: 300,
            message: "메모는 최대 300자 입니다",
          },
        })}
        children={
          errors.memo?.message && (
            <FormError errorMessage={errors.memo.message} />
          )
        }
      />

      <Button
        type="submit"
        canClick={isValid && birthdayIsValid}
        loading={loading}
        textContents={"환자등록"}
      />
      {createaPatientMutationResult?.createPatient.error && (
        <FormError
          errorMessage={createaPatientMutationResult.createPatient.error}
        />
      )}
    </form>
  );
};
