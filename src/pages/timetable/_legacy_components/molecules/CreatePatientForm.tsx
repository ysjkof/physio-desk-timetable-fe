import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { selectedPatientVar, toastVar } from '../../../../store';
import { TimetableModalProps } from '../../Timetable';
import { REG_EXP } from '../../../../constants/regex';
import { GENDER_KOR } from '../../../../constants/constants';
import FormError from '../../../../_legacy_components/atoms/FormError';
import Button from '../../../../_legacy_components/molecules/Button';
import Input from '../../../../_legacy_components/molecules/Input';
import Textarea from '../../../../_legacy_components/molecules/Textarea';
import Checkbox from '../../../../_legacy_components/molecules/Checkbox';
import Datepicker from '../../../../_legacy_components/molecules/Datepicker/Datepicker';
import { ClinicsOfClient } from '../../../../models';
import {
  CREATE_PATIENT_DOCUMENT,
  EDIT_PATIENT_DOCUMENT,
} from '../../../../graphql';
import type {
  CreatePatientInput,
  CreatePatientMutation,
  EditPatientOutput,
} from '../../../../types/generated.types';

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

export default function CreatePatientForm({
  closeAction,
  patient,
}: CreatePatientFormProps) {
  const { selectedClinic } = ClinicsOfClient;

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

  const [
    createPatientMutation,
    { loading, data: createaPatientMutationResult },
  ] = useMutation<CreatePatientMutation>(CREATE_PATIENT_DOCUMENT);

  const [editPatientMutation, { loading: editLoading }] =
    useMutation<EditPatientOutput>(EDIT_PATIENT_DOCUMENT);

  const [birthday, setBirthday] = useState<Date | undefined>(undefined);

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
        if (!selectedClinic) throw new Error('선택된 병원이 없습니다');

        createPatientMutation({
          variables: {
            input: {
              name,
              gender,
              memo,
              clinicId: selectedClinic.id,
              ...(birthday && { birthday }),
            },
          },
          onCompleted(data) {
            const {
              createPatient: { ok, patient },
            } = data;
            if (ok) {
              closeAction();
              toastVar({ messages: [`"${patient?.name}"님을 등록했습니다`] });
              selectedPatientVar({
                id: patient?.id!,
                name: patient?.name!,
                gender: patient?.gender!,
                birthday: patient?.birthday,
                registrationNumber: patient?.registrationNumber!,
                clinicName: selectedClinic.name,
              });
            }
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
        id="create-patient-form__name"
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
        {['male', 'female'].map((gender) => (
          <Checkbox
            key={gender}
            id={'create-patient-form__gender-' + gender}
            label={GENDER_KOR[gender as 'male' | 'female']}
            type="radio"
            value={gender}
            register={register('gender', { required: '성별을 선택하세요' })}
          />
        ))}
      </div>
      <label className="flex flex-col gap-2">
        생년월일
        <Datepicker
          setSelectedDate={setBirthday}
          defaultDate={patient && new Date(patient.birthday)}
        />
      </label>

      <Textarea
        id="create-patient-form__memo"
        label="메모"
        rows={4}
        placeholder="메모를 입력하세요"
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
        canClick={!!birthday && isValid}
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
}
