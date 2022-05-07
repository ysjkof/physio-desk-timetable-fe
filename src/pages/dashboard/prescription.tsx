import {
  faCheckCircle,
  faCircleQuestion,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import {
  CreateGroupInput,
  useCreateGroupMutation,
  useFindPrescriptionsQuery,
} from "../../graphql/generated/graphql";
import { cls } from "../../libs/utils";

interface PrescriptionProps {
  groupId: number | undefined;
  groupName: string | undefined;
}

export const Prescription: React.FC<PrescriptionProps> = ({
  groupId,
  groupName,
}) => {
  const { data: prescriptionsData, loading } = useFindPrescriptionsQuery({
    variables: {
      input: {
        includeInactivate: false,
        prescriptionType: "all",
        groupId: groupId,
      },
    },
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<CreateGroupInput>({ mode: "onChange" });

  const [createGroupMutation] = useCreateGroupMutation();

  const onSubmitCreateGroup = () => {
    if (!loading) {
      const { name } = getValues();
      createGroupMutation({
        variables: { input: { name } },
      });
    }
  };
  if (!prescriptionsData) return <></>;
  return (
    <div className="h-full">
      <div className="mb-4 border-b">
        <span className="font-medium">{groupName}</span>
        <span className="text-sm text-gray-500">의 처방</span>
      </div>
      <div className="flex w-full gap-4">
        <div className="w-full space-y-2">
          <h2>단일 처방</h2>
          <ul className="space-y-2 pl-4">
            <li className="relative grid grid-cols-[1fr_5rem_3.3rem_1.75rem] justify-between gap-3 border-b text-sm">
              <span className="">이름</span>
              <span className=" text-right">가격</span>
              <span className=" text-right">소요시간</span>
              <span className=" text-center">활성</span>
            </li>
            {prescriptionsData.findPrescriptions.optionResults?.map((presc) => (
              <li
                key={presc.id}
                className="justify-bet group relative grid grid-cols-[1fr_5rem_3.3rem_1.75rem] items-center gap-3"
              >
                <span className="">{presc.name}</span>
                <span className="text-right">{presc.price}원</span>
                <span className="text-right">{presc.requiredTime}분</span>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  fontSize="large"
                  className={cls(
                    presc.activate ? "text-green-500" : "",
                    "mx-auto cursor-pointer"
                  )}
                />
                {presc.description && (
                  <p className="bubble-arrow-t-left absolute top-7 hidden rounded-md bg-black px-3 py-2 text-white group-hover:block">
                    {presc.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full space-y-2">
          <h2 className="group relative">
            묶음 처방 <FontAwesomeIcon icon={faCircleQuestion} />
            <p className="bubble-arrow-t-left absolute top-8 z-50 hidden rounded-md bg-black px-3 py-2 text-white group-hover:block">
              단일 처방을 여러개 묶은 것
            </p>
          </h2>
          <ul className="space-y-2 pl-4">
            <li className="relative grid grid-cols-[1fr_5rem_3.3rem_1.75rem] justify-between gap-3 border-b text-sm">
              <span className="">이름</span>
              <span className=" text-right">가격</span>
              <span className=" text-right">소요시간</span>
              <span className=" text-center">활성</span>
            </li>
            {prescriptionsData.findPrescriptions.bundleResults?.map((presc) => (
              <li
                key={presc.id}
                className="justify-bet group relative grid grid-cols-[1fr_5rem_3.3rem_1.75rem] items-center gap-3"
              >
                <span className="">{presc.name}</span>
                <span className="text-right">{presc.price}원</span>
                <span className="text-right">{presc.requiredTime}분</span>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  fontSize="large"
                  className={cls(
                    presc.activate ? "text-green-500" : "",
                    "mx-auto cursor-pointer"
                  )}
                />
                {presc.description && (
                  <p className="bubble-arrow-t-left absolute top-7 hidden rounded-md bg-black px-3 py-2 text-white group-hover:block">
                    {presc.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {prescriptionsData.findPrescriptions.bundleResults?.length === 0 ? 0 : 1}
      {/* <form
        onSubmit={handleSubmit(onSubmitCreateGroup)}
        className="mx-auto flex max-w-sm flex-col"
      >
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
        <Button canClick={isValid} loading={loading} actionText={"만들기"} />
      </form> */}
    </div>
  );
};
