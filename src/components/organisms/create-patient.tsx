import { useForm } from "react-hook-form";
import { FormError } from "../form-error";
import { Button } from "../molecules/button";
import {
  CreatePatientInput,
  CreatePatientMutation,
  useCreatePatientMutation,
} from "../../graphql/generated/graphql";
import { Input } from "../molecules/input";
import { selectedClinicVar, selectedPatientVar } from "../../store";
import { useReactiveVar } from "@apollo/client";
import { ModalContentsLayout } from "../templates/modal-contents-layout";
import { TimetableModalProps } from "../../pages/timetable";
import { DatepickerWithInput } from "../molecules/datepicker-with-input";

export interface BirthdayInput {
  birthdayYear?: number;
  birthdayMonth?: number;
  birthdayDate?: number;
}

export const CreatePatient = ({ closeAction }: TimetableModalProps) => {
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
        name: patient?.name!,
        gender: patient?.gender!,
        registrationNumber: patient?.registrationNumber,
        birthday: patient?.birthday,
        id: patient?.id!,
        clinicName: selectedClinic.name ?? "",
      });
    }
  };
  const [
    createPatientMutation,
    { loading, data: createaPatientMutationResult },
  ] = useCreatePatientMutation({ onCompleted });

  const onSubmit = () => {
    if (!loading) {
      const { name, gender, registrationNumber, memo } = getValues();
      const { birthdayYear, birthdayMonth, birthdayDate } = birthdayGetValues();
      const birthday = new Date(
        `${birthdayYear}-${birthdayMonth}-${birthdayDate}`
      );
      createPatientMutation({
        variables: {
          input: {
            name,
            gender,
            registrationNumber,
            memo,
            ...(birthday && { birthday }),
            ...(typeof selectedClinic.id === "number" &&
              selectedClinic.id !== 0 && { clinicId: selectedClinic.id }),
          },
        },
      });
    }
  };

  return (
    <ModalContentsLayout
      title="환자등록"
      closeAction={closeAction}
      children={
        <>
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
                defaultDate={new Date()}
                setValue={birthdaySetValue}
                register={birthdayRegister}
                formError={birthdayError}
                dateType="birthday"
                see="ymd"
              />
              {/* <InputOfDatepicker
                register={birthdayRegister}
                formError={birthdayError}
                prefix="birthday"
                see="ymd"
              /> */}
            </label>

            <Input
              label={"등록번호"}
              name={"registrationNumber"}
              type={"number"}
              placeholder={"숫자를 입력하세요"}
              required={false}
              register={register("registrationNumber", {
                maxLength: {
                  value: 10,
                  message: "등록번호는 최대 10자리 수입니다",
                },
              })}
              children={
                errors.registrationNumber?.message && (
                  <FormError errorMessage={errors.registrationNumber.message} />
                )
              }
            />
            <Input
              label={"메모"}
              name={"memo"}
              type={"textarea"}
              rows={8}
              placeholder={"메모를 입력하세요"}
              required={false}
              register={register("memo", {
                maxLength: { value: 300, message: "메모는 최대 300자 입니다" },
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
        </>
      }
    />
  );
};
