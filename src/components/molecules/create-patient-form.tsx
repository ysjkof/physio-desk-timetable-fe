import { useForm } from "react-hook-form";
import { FormError } from "../form-error";
import { Button } from "./button";
import {
  CreatePatientInput,
  CreatePatientMutation,
  useCreatePatientMutation,
  useEditPatientMutation,
} from "../../graphql/generated/graphql";
import { Input } from "./input";
import { selectedClinicVar, selectedPatientVar } from "../../store";
import { useReactiveVar } from "@apollo/client";
import { TimetableModalProps } from "../../pages/timetable";
import { DatepickerWithInput } from "./datepicker-with-input";
import { useEffect } from "react";

export interface BirthdayInput {
  birthdayYear?: number;
  birthdayMonth?: number;
  birthdayDate?: number;
}
interface ICreatePatientForm extends TimetableModalProps {
  patient?: {
    __typename?: "Patient" | undefined;
    id: number;
    name: string;
    gender: string;
    registrationNumber: number;
    birthday?: any;
    memo?: string | null | undefined;
  };
}

export const CreatePatientForm = ({
  closeAction,
  patient,
}: ICreatePatientForm) => {
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
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
  const [editPatientMutation, { loading: editLoading }] =
    useEditPatientMutation({});

  const onSubmit = () => {
    if (!loading && !editLoading) {
      const { name, gender, memo } = getValues();
      const { birthdayYear, birthdayMonth, birthdayDate } = birthdayGetValues();
      const birthday = new Date(
        `${birthdayYear}-${birthdayMonth}-${birthdayDate}`
      );

      if (patient) {
        // eidt
        editPatientMutation({
          variables: {
            input: {
              id: patient.id,
              birthday,
              gender,
              memo,
              name,
            },
          },
        });
      } else {
        // create
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
    }
  };
  useEffect(() => {
    if (patient) {
      setValue("birthday", patient.birthday);
      setValue("gender", patient.gender);
      setValue("memo", patient.memo);
      setValue("name", patient.name);
    }
  }, [patient]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-6">
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
          defaultDate={new Date(patient ? patient.birthday : "0-0-0")}
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
        rows={4}
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
        loading={loading || editLoading}
        textContents={patient ? "환자수정" : "환자등록"}
      />
      {createaPatientMutationResult?.createPatient.error && (
        <FormError
          errorMessage={createaPatientMutationResult.createPatient.error}
        />
      )}
    </form>
  );
};
