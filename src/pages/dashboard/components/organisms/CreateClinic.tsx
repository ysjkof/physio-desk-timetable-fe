import { useMutation, useReactiveVar } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { client } from '../../../../apollo';
import FormError from '../../../../_legacy_components/atoms/FormError';
import Button from '../../../../_legacy_components/molecules/Button';
import Input from '../../../../_legacy_components/molecules/Input';
import { REG_EXP } from '../../../../constants/regex';
import { selectedInfoVar, toastVar } from '../../../../store';
import FormSection from '../molecules/FormSection';
import {
  ME_DOCUMENT,
  CREATE_CLINIC_DOCUMENT,
  FIND_MY_CLINICS_DOCUMENT,
} from '../../../../graphql';
import type {
  CreateClinicInput,
  CreateClinicMutation,
} from '../../../../types/generated.types';

export default function CreateClinic() {
  const selectedInfo = useReactiveVar(selectedInfoVar);
  const {
    register,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<Pick<CreateClinicInput, 'name'>>({ mode: 'onChange' });

  const [createClinicMutation, { loading, data }] =
    useMutation<CreateClinicMutation>(CREATE_CLINIC_DOCUMENT);

  const onSubmitCreateClinic = () => {
    if (!loading) {
      let { name } = getValues();
      name = name.trim();
      createClinicMutation({
        variables: { input: { name } },
        onCompleted(data) {
          if (data.createClinic.ok) {
            if (!selectedInfo.clinic) throw new Error('선택된 병원이 없습니다');
            toastVar({ messages: [`병원 "${name}"을 만들었습니다`] });

            const newClinic = {
              ...data.createClinic.clinic?.members[0],
              clinic: {
                id: data.createClinic.clinic?.id,
                name: data.createClinic.clinic?.name,
              },
            };
            const newMember = { ...newClinic };
            // @ts-ignore
            newMember.clinic.isActivated =
              data.createClinic.clinic?.isActivated;
            // @ts-ignore
            newMember.clinic.type = data.createClinic.clinic?.type;

            client.cache.updateQuery(
              {
                query: FIND_MY_CLINICS_DOCUMENT,
                variables: { input: { includeInactivate: true } },
              },
              (cacheData) => {
                return {
                  ...cacheData,
                  findMyClinics: {
                    ...cacheData.findMyClinics,
                    clinics: [
                      ...cacheData.findMyClinics.clinics,
                      {
                        ...data.createClinic.clinic,
                        members: [newClinic],
                      },
                    ],
                  },
                };
              }
            );

            client.cache.updateQuery(
              {
                query: ME_DOCUMENT,
              },
              (cacheData) => {
                return {
                  me: {
                    ...cacheData.me,
                    members: [...cacheData.me.members, newMember],
                  },
                };
              }
            );
          }
        },
      });
    }
  };
  const invokeClearErrors = () => {
    if (errors.name && !errors.name.message && !errors.name.type) return;
    clearErrors('name');
  };
  return (
    <FormSection>
      <form
        onSubmit={handleSubmit(onSubmitCreateClinic)}
        className="mt-10 space-y-6"
      >
        <Input
          id="create-clinic__name"
          label="이름*"
          type="text"
          placeholder={'병원 이름'}
          maxLength={REG_EXP.clinicName.maxLength}
          onChange={invokeClearErrors}
          register={register('name', {
            required: '이름을 입력하세요',
            pattern: REG_EXP.clinicName.pattern,
          })}
        >
          {errors.name?.message ? (
            <FormError errorMessage={errors.name.message} />
          ) : errors.name?.type === 'pattern' ? (
            <FormError errorMessage={REG_EXP.clinicName.condition} />
          ) : (
            data?.createClinic.error && (
              <FormError errorMessage={data.createClinic.error} />
            )
          )}
        </Input>
        <Button type="submit" canClick={isValid} loading={loading} isWidthFull>
          만들기
        </Button>
      </form>
    </FormSection>
  );
}
