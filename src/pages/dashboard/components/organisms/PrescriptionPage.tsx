import {
  faCheckCircle,
  faCircleQuestion,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { DashboardSectionLayout } from '../template/DashboardSectionLayout';
import {
  CreatePrescriptionInput,
  FindPrescriptionsDocument,
  useCreatePrescriptionMutation,
  useFindAtomPrescriptionsQuery,
  useFindPrescriptionsQuery,
} from '../../../../graphql/generated/graphql';
import { Button } from '../../../../components/molecules/Button';
import { Input } from '../../../../components/molecules/Input';
import { FormError } from '../../../../components/atoms/FormError';
import { REG_EXP } from '../../../../constants/regex';
import useStore from '../../../../hooks/useStore';
import { Textarea } from '../../../../components/molecules/Textarea';
import { Worning } from '../../../../components/atoms/Warning';
import { toastVar } from '../../../../store';
import { client } from '../../../../apollo';
import { Checkbox } from '../../../../components/molecules/Checkbox';
import { cls } from '../../../../utils/utils';

export const PrescriptionPage = () => {
  const { selectedInfo } = useStore();
  const { data: findAtomPrescriptions, loading: loadingAtom } =
    useFindAtomPrescriptionsQuery();
  const { data: findPrescriptionsData, loading: loadingPrescriptions } =
    useFindPrescriptionsQuery({
      variables: {
        input: {
          clinicId: selectedInfo.clinic ? selectedInfo.clinic.id : 0,
          onlyLookUpActive: false,
        },
      },
    });

  const [createPrescription, { loading: loadingCreatePrescriptionOption }] =
    useCreatePrescriptionMutation({
      onCompleted: (data) => {
        if (!data.createPrescription.ok) {
          if (data.createPrescription.error) {
            toastVar({ messages: [data.createPrescription.error] });
          }
          return;
        }

        client.writeQuery({
          query: FindPrescriptionsDocument,
          variables: {
            input: {
              clinicId: selectedInfo.clinic?.id,
              onlyLookUpActive: false,
            },
          },
          data: {
            ...findPrescriptionsData,
            findPrescriptions: {
              ...findPrescriptionsData?.findPrescriptions,
              prescriptions: [
                ...findPrescriptionsData?.findPrescriptions.prescriptions!,
                data.createPrescription.prescription,
              ],
            },
          },
        });
      },
    });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<CreatePrescriptionInput>({ mode: 'onChange' });

  const onSubmitCreatePresciption = () => {
    if (!loadingCreatePrescriptionOption) {
      const { name, requiredTime, price, prescriptionAtomIds, description } =
        getValues();

      createPrescription({
        variables: {
          input: {
            name: name.trim(),
            requiredTime: +requiredTime,
            price: +price,
            description,
            prescriptionAtomIds: prescriptionAtomIds.map((id) => +id),
            clinicId: selectedInfo.clinic ? selectedInfo.clinic.id : 0,
          },
        },
      });
    }
  };

  if (!selectedInfo.clinic?.isStayed)
    return <Worning type="hasNotPermission" />;

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <DashboardSectionLayout
        width="md"
        hasMinHeight
        children={
          <>
            <div className="grid grid-cols-[1fr_5rem_3.3rem_1.75rem] justify-between gap-3 border-b">
              <span className="">이름</span>
              <span className="text-right">가격</span>
              <span className="text-right">소요시간</span>
              <span className="text-center">활성</span>
            </div>
            <ul className="space-y-2">
              {findPrescriptionsData?.findPrescriptions.prescriptions
                ?.length === 0 ? (
                <p className="py-10 text-center font-semibold">
                  병원에 등록된 처방이 없습니다
                </p>
              ) : (
                findPrescriptionsData?.findPrescriptions.prescriptions?.map(
                  (presc) => (
                    <li
                      key={presc.id}
                      className="group relative grid grid-cols-[1fr_5rem_3.3rem_1.75rem] items-center gap-3"
                    >
                      <span className="">{presc.name}</span>
                      <span className="text-right">{presc.price}원</span>
                      <span className="text-right">{presc.requiredTime}분</span>
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        fontSize="large"
                        className={cls(
                          'mx-auto cursor-pointer',
                          presc.activate ? 'text-green-500' : ''
                        )}
                      />
                      {presc.description && (
                        <p className="bubble-arrow-t-left absolute top-7 hidden rounded-md bg-black px-3 py-2 text-white group-hover:block">
                          {presc.description}
                        </p>
                      )}
                    </li>
                  )
                )
              )}
            </ul>
          </>
        }
      />
      <div className="seperate-bar" />
      <DashboardSectionLayout
        width="md"
        children={
          <details open={selectedInfo.clinic.isManager}>
            <summary>처방 만들기</summary>
            <form
              onSubmit={handleSubmit(onSubmitCreatePresciption)}
              className="space-y-8 pt-4 pb-2"
            >
              <div className="prescription-selector flex items-center">
                <h4 className="mr-4 w-9">처방*</h4>
                <div className="flex w-full flex-wrap gap-4 px-2 py-1.5">
                  {findAtomPrescriptions?.findAtomPrescriptions.results?.map(
                    (option) => (
                      <Checkbox
                        key={option.id}
                        id={option.name}
                        label={option.name}
                        type="checkbox"
                        value={option.id}
                        register={register('prescriptionAtomIds', {
                          required: true,
                        })}
                      />
                    )
                  )}
                </div>
              </div>
              <Input
                id="name"
                label="처방이름*"
                type="text"
                placeholder="도수30, 집중형충격파1, MT20"
                required
                maxLength={REG_EXP.prescription.maxLength}
                register={register('name', {
                  required: '처방이름을 입력해주세요',
                  pattern: REG_EXP.prescription.pattern,
                })}
              >
                <div className="group absolute left-[3.8rem] top-[0.08rem] cursor-pointer">
                  <FontAwesomeIcon icon={faCircleQuestion} fontSize={14} />
                  <p className="bubble-arrow-t-2-5 absolute top-7 -left-[2.2rem] hidden w-44 rounded-md bg-black px-3 py-2 text-white group-hover:block">
                    이 이름으로 검색, 표시됩니다.
                  </p>
                </div>
                {errors.name?.message ? (
                  <FormError errorMessage={errors.name.message} />
                ) : (
                  errors.name?.type === 'pattern' && (
                    <FormError errorMessage={REG_EXP.prescription.condition} />
                  )
                )}
              </Input>
              <Input
                id="requiredTime"
                label="소요시간(분)*"
                type="number"
                placeholder="10분 단위, 0 이상의 숫자"
                required
                step={10}
                maxLength={REG_EXP.numberEnd0.maxLength}
                register={register('requiredTime', {
                  required: '시간을 입력해주세요',
                  min: { value: 10, message: '최소 10분입니다' },
                  max: { value: 180, message: '최대 180분입니다' },
                  pattern: REG_EXP.numberEnd0.pattern,
                })}
              >
                {errors.requiredTime?.message ? (
                  <FormError errorMessage={errors.requiredTime.message} />
                ) : (
                  errors.requiredTime?.type === 'pattern' && (
                    <FormError errorMessage={REG_EXP.numberEnd0.condition} />
                  )
                )}
              </Input>
              <Input
                id="price"
                label="가격(원)*"
                placeholder="0 이상의 숫자"
                required
                register={register('price', {
                  required: '가격을 입력해주세요',
                  min: { value: 0, message: '최소 0입니다' },
                  max: {
                    value: 100000000,
                    message: '더 이상 불가합니다',
                  },
                })}
                type="number"
              >
                {errors.price?.message && (
                  <FormError errorMessage={errors.price.message} />
                )}
              </Input>
              <Textarea
                id="description"
                label={'설명'}
                placeholder={'처방에 대한 설명'}
                register={register('description', {
                  maxLength: { value: 200, message: '최대 200자입니다' },
                })}
                rows={4}
              >
                {errors.description?.message && (
                  <FormError errorMessage={errors.description.message} />
                )}
              </Textarea>
              <Button
                type="submit"
                canClick={isValid}
                loading={loadingCreatePrescriptionOption}
                isWidthFull
              >
                만들기
              </Button>
            </form>
          </details>
        }
      />
    </div>
  );
};
