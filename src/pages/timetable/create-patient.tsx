import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { FormError } from "../../components/form-error";
import { Button } from "../../components/button";
import {
  CreatePatientInput,
  CreatePatientMutation,
  useCreatePatientMutation,
} from "../../graphql/generated/graphql";
import { Input } from "../../components/input";
import { selectedPatientVar } from "../../store";

interface CreatePatientProps {
  clinicId?: number;
  clinicName?: string;
  closeModal: any;
}

export const CreatePatient = ({
  clinicId,
  clinicName,
  closeModal,
}: CreatePatientProps) => {
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<CreatePatientInput>({
    mode: "onChange",
  });

  const onCompleted = (data: CreatePatientMutation) => {
    const {
      createPatient: { ok, patient },
    } = data;
    if (ok) {
      closeModal();
      selectedPatientVar({
        name: patient?.name!,
        gender: patient?.gender!,
        registrationNumber: patient?.registrationNumber,
        birthday: patient?.birthday,
        id: patient?.id!,
        clinicName: clinicName ?? "",
      });
    }
  };
  const [
    createPatientMutation,
    { loading, data: createaPatientMutationResult },
  ] = useCreatePatientMutation({ onCompleted });
  const onSubmit = () => {
    if (!loading) {
      const { name, gender, registrationNumber, birthday, memo } = getValues();
      createPatientMutation({
        variables: {
          input: {
            name,
            gender,
            registrationNumber,
            birthday,
            memo,
            ...(clinicId && { clinicId }),
          },
        },
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>환자등록 | Muool</title>
      </Helmet>
      <h4 className="mb-5 text-left font-medium">환자등록</h4>
      <button
        className="absolute top-14 right-10 rounded-md border px-2 text-gray-500 hover:text-gray-700"
        onClick={() => closeModal(false)}
      >
        돌아가기
      </button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 mb-5 grid w-full gap-3"
      >
        {errors.name?.message && (
          <FormError errorMessage={errors.name?.message} />
        )}
        <Input
          label={"이름*"}
          name={"name"}
          placeholder={"이름을 입력하세요"}
          register={register("name", {
            required: "Name is required",
          })}
          type={"name"}
          required={true}
        />
        {errors.gender?.message && (
          <FormError errorMessage={errors.gender?.message} />
        )}
        <div className="flex justify-around">
          <div>
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
          <div>
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
        <Input
          label={"생년월일*"}
          name={"birthday"}
          placeholder={"1970-01-15"}
          register={register("birthday", { required: "생일을 입력하세요" })}
          type={"datetime"}
          required={true}
        />
        <Input
          label={"등록번호"}
          name={"registrationNumber"}
          placeholder={"숫자를 입력하세요"}
          register={register("registrationNumber")}
          type={"number"}
          required={false}
        />
        <Input
          label={"메모"}
          name={"memo"}
          placeholder={"메모를 입력하세요"}
          register={register("memo")}
          type={"text"}
          required={false}
        />

        <Button canClick={isValid} loading={loading} actionText={"환자 등록"} />
        {createaPatientMutationResult?.createPatient.error && (
          <FormError
            errorMessage={createaPatientMutationResult.createPatient.error}
          />
        )}
      </form>
    </>
  );
};
