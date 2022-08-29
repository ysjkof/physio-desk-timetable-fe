import { useReactiveVar } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { client } from '../../../apollo';
import { FormError } from '../../../components/atoms/FormError';
import { Button } from '../../../components/molecules/Button';
import { Input } from '../../../components/molecules/Input';
import {
  CreateClinicInput,
  FindMyClinicsDocument,
  useCreateClinicMutation,
} from '../../../graphql/generated/graphql';
import { selectedInfoVar } from '../../../store';
import { DashboardSectionLayout } from '../components/DashboardSectionLayout';

export const CreateClinic = () => {
  const selectedInfo = useReactiveVar(selectedInfoVar);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<CreateClinicInput>({ mode: 'onChange' });

  const [createClinicMutation, { loading, data }] = useCreateClinicMutation();

  const onSubmitCreateClinic = () => {
    if (!loading) {
      const { name } = getValues();
      createClinicMutation({
        variables: { input: { name } },
        onCompleted(data) {
          if (data.createClinic.ok) {
            if (!selectedInfo.clinic) throw new Error('선택된 병원이 없습니다');

            client.cache.updateQuery(
              {
                query: FindMyClinicsDocument,
                variables: { input: { includeInactivate: true } },
                broadcast: false,
              },
              (cacheData) => {
                return {
                  ...cacheData,
                  findMyClinics: {
                    ...cacheData.findMyClinics,
                    clinics: [
                      ...cacheData.findMyClinics.clinics,
                      data.createClinic.clinic,
                    ],
                  },
                };
              }
            );
          }
        },
      });
    }
  };

  return (
    <DashboardSectionLayout
      title="병원 만들기"
      width="md"
      moreYGap
      heightFull
      children={
        <form
          onSubmit={handleSubmit(onSubmitCreateClinic)}
          className="space-y-6"
        >
          <Input
            name="name"
            label={'이름*'}
            placeholder={'병원 이름'}
            type="text"
            register={register('name', {
              required: '이름을 입력하세요',
              maxLength: { value: 30, message: '최대 30자 입니다' },
            })}
            children={
              <>
                {errors.name?.message && (
                  <FormError errorMessage={errors.name.message} />
                )}
                {data?.createClinic.error && (
                  <FormError errorMessage={data.createClinic.error} />
                )}
              </>
            }
          />
          <Button
            isWidthFull
            type="submit"
            textContents={'만들기'}
            canClick={isValid}
            loading={loading}
          />
        </form>
      }
    />
  );
};
