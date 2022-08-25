import { useForm } from 'react-hook-form';
import { FormError } from '../../../components/atoms/FormError';
import { Button } from '../../../components/molecules/Button';
import {
  CreatePatientInput,
  CreatePatientMutation,
  useCreatePatientMutation,
  useEditPatientMutation,
} from '../../../graphql/generated/graphql';
import { Input } from '../../../components/molecules/Input';
import { TimetableModalProps } from '..';
import { DatepickerWithInput } from '../../../components/molecules/DatepickerWithInput';
import { useEffect, useState } from 'react';
import useStore from '../../../hooks/useStore';

interface CreatePatientFormProps extends TimetableModalProps {
  patient?: {
    __typename?: 'Patient' | undefined;
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
}: CreatePatientFormProps) => {
  const { selectedInfo, setSelectedInfo } = useStore();

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = useForm<CreatePatientInput>({
    mode: 'onChange',
    defaultValues: {
      ...(patient && {
        gender: patient.gender,
        memo: patient.memo,
        name: patient.name,
      }),
    },
  });

  const onCompleted = (data: CreatePatientMutation) => {
    const {
      createPatient: { ok, patient },
    } = data;
    if (ok) {
      closeAction();
      setSelectedInfo('patient', {
        id: patient?.id!,
        name: patient?.name!,
        gender: patient?.gender!,
        birthday: patient?.birthday,
        registrationNumber: patient?.registrationNumber!,
        clinicName: selectedInfo.clinic?.name ?? '',
      });
    }
  };
  const [
    createPatientMutation,
    { loading, data: createaPatientMutationResult },
  ] = useCreatePatientMutation({ onCompleted });
  const [editPatientMutation, { loading: editLoading }] =
    useEditPatientMutation({});

  const [birthday, setBirthday] = useState<Date | null>(null);

  const onSubmit = () => {
    if (!loading && !editLoading) {
      const { name, gender, memo } = getValues();

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
        if (!selectedInfo.clinic) throw new Error('선택된 병원이 없습니다');

        createPatientMutation({
          variables: {
            input: {
              name,
              gender,
              memo,
              clinicId: selectedInfo.clinic.id,
              ...(birthday && { birthday }),
            },
          },
        });
      }
    }
  };
  useEffect(() => {
    if (patient) {
      setBirthday(patient.birthday);
    }
  }, [patient]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-6">
      <Input
        autoFocus
        label={'이름*'}
        name={'name'}
        type={'text'}
        placeholder={'이름을 입력하세요'}
        required={true}
        register={register('name', {
          required: '이름을 입력하세요',
          maxLength: { value: 30, message: '최대 30자 입니다' },
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
            {...register('gender', { required: '성별을 선택하세요' })}
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
            {...register('gender', { required: '성별을 선택하세요' })}
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
          setSelectedDate={setBirthday}
          defaultDate={patient ? new Date(patient.birthday) : new Date()}
        />
      </label>

      <Input
        label={'메모'}
        name={'memo'}
        type={'textarea'}
        rows={4}
        placeholder={'메모를 입력하세요'}
        required={false}
        register={register('memo', {
          maxLength: {
            value: 300,
            message: '메모는 최대 300자 입니다',
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
        canClick={birthday && isValid}
        loading={loading || editLoading}
        textContents={patient ? '환자수정' : '환자등록'}
      />
      {createaPatientMutationResult?.createPatient.error && (
        <FormError
          errorMessage={createaPatientMutationResult.createPatient.error}
        />
      )}
    </form>
  );
};
