import { useMemo, type PropsWithChildren } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { addMinutes } from 'date-fns';
import { DateForm, InputWrapper, MenuButton } from '../../../../components';
import AutoCompleteForUser from './AutoCompleteForUser';
import AutoCompleteForPatient from './AutoCompleteForPatient';
import AutoCompleteForPrescription from './AutoCompleteForPrescription';
import { Textarea } from '../../../../components';
import { PickedPrescriptions } from '../../../../models';
import { useStore } from '../../../../store';
import { useFindPrescriptions } from '../../../../hooks';
import { useCreateReservation } from '../../hooks';
import type { FormOfReserveFields } from '../../../../types/formTypes';
import type { FormForReservationProps } from '../../../../types/propsTypes';

const FormForReservation = ({
  date,
  userId,
  closeAction,
}: FormForReservationProps) => {
  const { register, setValue, getValues, handleSubmit } =
    useForm<FormOfReserveFields>({
      defaultValues: { startDate: date, userId },
    });

  const [prescriptionData, { loading }] = useFindPrescriptions();

  const prescriptionList = useMemo(
    () => new PickedPrescriptions(prescriptionData?.prescriptions),
    [prescriptionData, loading]
  );

  register('userId', { required: true });
  register('patientId', { required: true });
  register('prescriptions', { required: true });
  register('startDate', { required: true });

  const { createReservation } = useCreateReservation();

  const clinicId = useStore((state) => state.pickedClinicId);
  const onSubmit: SubmitHandler<FormOfReserveFields> = (data) => {
    const { startDate, memo, patientId, prescriptions, userId } = data;
    const formData = {
      startDate,
      endDate: addMinutes(startDate, prescriptionList.get().minute),
      memo,
      userId,
      clinicId,
      patientId,
      prescriptionIds: prescriptions,
    };
    createReservation(formData, closeAction);
  };

  const setUserId = (userId: number) => {
    setValue('userId', userId);
  };
  const setPatient = (patientId: number) => {
    setValue('patientId', patientId);
  };
  const setStartDate = (date: Date) => {
    setValue('startDate', date);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col gap-5 pt-8"
    >
      <div className="flex basis-full flex-col justify-between gap-5 px-4">
        <InputWrapper label="담당치료사" htmlFor="담당치료사" required>
          <AutoCompleteForUser
            label="담당치료사"
            setParentValue={setUserId}
            userId={userId}
          />
        </InputWrapper>
        <InputWrapper label="환자" htmlFor="환자" required>
          <AutoCompleteForPatient label="환자" setParentValue={setPatient} />
        </InputWrapper>
        <InputWrapper label="처방" htmlFor="처방" required>
          <AutoCompleteForPrescription
            setValue={setValue}
            prescriptionList={prescriptionList}
          />
        </InputWrapper>
        <InputWrapper label="치료일정" htmlFor="치료일정" required>
          <DateForm
            hasHour
            date={getValues('startDate')}
            setParentValue={setStartDate}
          />
        </InputWrapper>
        <InputWrapper label="메모" htmlFor="메모">
          <Textarea id="메모" rows={3} register={register('memo')} />
        </InputWrapper>
      </div>
      <Buttons>
        <MenuButton
          type="button"
          className="w-full bg-close-bg text-base font-medium text-font-gray"
          onClick={closeAction}
        >
          닫기
        </MenuButton>
        <MenuButton
          onClick={handleSubmit(onSubmit)}
          type="submit"
          className="w-full bg-cst-blue text-base font-medium text-white"
        >
          예약하기
        </MenuButton>
      </Buttons>
    </form>
  );
};

export default FormForReservation;

export const Buttons = ({ children }: PropsWithChildren) => {
  return <div className="flex gap-4 bg-light-gray px-4 py-4">{children}</div>;
};
