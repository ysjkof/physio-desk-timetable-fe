import { useForm } from 'react-hook-form';
import { FormError } from '../../../../components/atoms/FormError';
import { Button } from '../../../../components/molecules/Button';
import {
  CreatePatientInput,
  CreatePatientMutation,
  useCreatePatientMutation,
  useEditPatientMutation,
} from '../../../../graphql/generated/graphql';
import { Input } from '../../../../components/molecules/Input';
import { TimetableModalProps } from '../..';
import { DatepickerWithInput } from '../../../../components/molecules/DatepickerWithInput';
import { useEffect, useState } from 'react';
import useStore from '../../../../hooks/useStore';
import { toastVar } from '../../../../store';
import { REG_EXP } from '../../../../constants/regex';
import { Textarea } from '../../../../components/molecules/Textarea';
import { Checkbox } from '../../../../components/molecules/Checkbox';

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
      toastVar({ messages: [`"${patient?.name}"님을 등록했습니다`] });
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
        id="name"
        label="이름*"
        type="text"
        placeholder="이름을 입력하세요"
        required={true}
        autoFocus
        maxLength={REG_EXP.personName.maxLength}
        register={register('name', {
          required: '이름을 입력하세요',
          pattern: REG_EXP.personName.pattern,
        })}
      >
        {errors.name?.message ? (
          <FormError errorMessage={errors.name.message} />
        ) : (
          errors.name?.type === 'pattern' && (
            <FormError errorMessage={REG_EXP.personName.condition} />
          )
        )}
      </Input>
      <div className="gender-radio flex justify-around">
        {[
          { label: '남성', value: 'male' },
          { label: '여성', value: 'female' },
        ].map((gender) => (
          <Checkbox
            id={'gender_' + gender.value}
            label={gender.label}
            type="radio"
            value={gender.value}
            register={register('gender', { required: '성별을 선택하세요' })}
          />
        ))}
      </div>
      <label className="flex flex-col gap-2">
        생년월일
        <DatepickerWithInput
          setSelectedDate={setBirthday}
          defaultDate={patient && new Date(patient.birthday)}
        />
      </label>

      <Textarea
        id={'memo'}
        label={'메모'}
        rows={4}
        placeholder={'메모를 입력하세요'}
        required={false}
        register={register('memo', {
          maxLength: {
            value: 300,
            message: '메모는 최대 300자 입니다',
          },
        })}
      >
        {errors.memo?.message && (
          <FormError errorMessage={errors.memo.message} />
        )}
      </Textarea>

      <Button
        type="submit"
        canClick={birthday && isValid}
        loading={loading || editLoading}
        children={patient ? '환자수정' : '환자등록'}
      />
      {createaPatientMutationResult?.createPatient.error && (
        <FormError
          errorMessage={createaPatientMutationResult.createPatient.error}
        />
      )}
    </form>
  );
};
