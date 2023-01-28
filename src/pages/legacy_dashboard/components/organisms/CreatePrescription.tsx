import { useMutation, useQuery } from '@apollo/client';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import Button from '../../../../_legacy_components/molecules/Button';
import Input from '../../../../_legacy_components/molecules/Input';
import FormError from '../../../../_legacy_components/atoms/FormError';
import { REG_EXP } from '../../../../constants/regex';
import Textarea from '../../../../_legacy_components/molecules/Textarea';
import Warning from '../../../../_legacy_components/atoms/Warning';
import { toastVar } from '../../../../store';
import { client } from '../../../../apollo';
import Checkbox from '../../../../_legacy_components/molecules/Checkbox';
import {
  CREATE_PRESCRIPTION_DOCUMENT,
  FIND_ATOM_PRESCRIPTIONS_DOCUMENT,
  FIND_PRESCRIPTIONS_DOCUMENT,
} from '../../../../graphql';
import { ClinicsOfClient } from '../../../../models';
import type {
  CreatePrescriptionInput,
  CreatePrescriptionMutation,
  FindAtomPrescriptionsQuery,
  FindPrescriptionsQuery,
} from '../../../../types/generated.types';

export default function CreatePrescription() {
  const selectedClinic = ClinicsOfClient.getSelectedClinic();
  const { data: findAtomPrescriptions } = useQuery<FindAtomPrescriptionsQuery>(
    FIND_ATOM_PRESCRIPTIONS_DOCUMENT
  );

  const [createPrescription, { loading: loadingCreatePrescriptionOption }] =
    useMutation<CreatePrescriptionMutation>(CREATE_PRESCRIPTION_DOCUMENT, {
      onCompleted: (data) => {
        if (!data.createPrescription.ok) {
          if (data.createPrescription.error) {
            toastVar({ messages: [data.createPrescription.error] });
          }
          return;
        }

        client.cache.updateQuery<FindPrescriptionsQuery>(
          {
            query: FIND_PRESCRIPTIONS_DOCUMENT,
            variables: {
              input: {
                clinicId: selectedClinic.id || 0,
                onlyLookUpActive: false,
              },
            },
          },
          (cacheData) => {
            if (
              !cacheData ||
              !cacheData.findPrescriptions ||
              !cacheData.findPrescriptions.prescriptions ||
              !data.createPrescription.prescription
            )
              return cacheData;

            return {
              ...cacheData,
              findPrescriptions: {
                ...cacheData.findPrescriptions,
                prescriptions: [
                  ...cacheData.findPrescriptions.prescriptions,
                  data.createPrescription.prescription,
                ],
              },
            };
          }
        );
      },
    });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<CreatePrescriptionInput>({ mode: 'onChange' });

  const onSubmitCreatePrescription = () => {
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
            clinicId: selectedClinic ? selectedClinic.id : 0,
          },
        },
      });
    }
  };

  if (!selectedClinic.isStayed || !selectedClinic.isManager)
    return <Warning type="hasNotPermission" />;

  return (
    <section className="px-10">
      <details open={selectedClinic.isManager}>
        <summary>처방 만들기</summary>
        <form
          onSubmit={handleSubmit(onSubmitCreatePrescription)}
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
            id="create-prescription__name"
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
            id="create-prescription__requiredTime"
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
            id="create-prescription__price"
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
            id="create-prescription__description"
            label="설명"
            placeholder="처방에 대한 설명"
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
    </section>
  );
}
